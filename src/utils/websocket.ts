interface WebSocketMessage {
  type: string;
  payload: unknown; // Cambia 'unknown' por el tipo específico si sabes la estructura exacta del payload
}

class WebSocketClient {
  private ws: WebSocket | null = null;
  private messageHandlers: ((data: WebSocketMessage) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  async connect() {
    try {
      let isReady = false;
      let attempts = 0;
      const maxAttempts = 5;
      const delay = 1000; // Retraso de 1 segundo entre intentos
  
      // Reintenta hasta que el servidor esté listo o se alcancen los intentos máximos
      while (!isReady && attempts < maxAttempts) {
        const response = await fetch('https://ramadas2025.onrender.com/health');

        if (response.ok) {
          const data = await response.json();
          if (data.status === 'ok') {
            isReady = true;
          } else {
            console.log('Respuesta de health check inválida:', data);
          }
        } else {
          console.log(`Falló el health check con estado: ${response.status}`);
        }
  
        if (!isReady) {
          attempts++;
          console.log(`Servidor no listo. Intento ${attempts}/${maxAttempts}`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
  
      if (!isReady) throw new Error('Servidor no listo');
  
     
      const websocketUrl = process.env.NODE_ENV === 'production'
        ? 'wss://ramadas2025.onrender.com'
        : 'ws://localhost:3001';


      this.ws = new WebSocket(websocketUrl);

      this.ws.onopen = () => {
        console.log('WebSocket conectado');
        this.reconnectAttempts = 0;
      };
  
      this.ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          this.messageHandlers.forEach(handler => handler(data));
        } catch (error) {
          console.error('Error al analizar el mensaje de WebSocket:', error);
        }
      };
  
      this.ws.onclose = () => {
        console.log('WebSocket desconectado');
        this.handleReconnect();
      };
  
      this.ws.onerror = (error) => {
        console.error('Error en WebSocket:', error);
        this.handleReconnect();
      };
    } catch (error) {
      console.error('Falló la conexión:', error);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      setTimeout(() => this.connect(), this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  send(data: WebSocketMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket not connected, message not sent');
    }
  }

  onMessage(handler: (data: WebSocketMessage) => void) {
    this.messageHandlers.push(handler);
  }
}

export const wsClient = new WebSocketClient();
