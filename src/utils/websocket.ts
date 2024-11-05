class WebSocketClient {
  private ws: WebSocket | null = null;
  private messageHandlers: ((data: any) => void)[] = [];

  connect() {
    this.ws = new WebSocket('ws://localhost:3001');

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messageHandlers.forEach(handler => handler(data));
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected. Reconnecting...');
      setTimeout(() => this.connect(), 1000);
    };
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  onMessage(handler: (data: any) => void) {
    this.messageHandlers.push(handler);
  }
}

export const wsClient = new WebSocketClient();