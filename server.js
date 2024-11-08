import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import express from 'express';
import cors from 'cors';

const app = express();
const server = createServer(app);

// Configurar WebSocket
const wss = new WebSocketServer({ server });
const clients = new Set();

// CORS para permitir solicitudes desde el frontend en Vercel
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://ramadas2025.vercel.app' : 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));

// Configurar Content Security Policy
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' data:;");
  next();
});

// Ruta de Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// WebSocket connection
wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.add(ws);

  ws.on('message', (message) => {
    const data = message.toString();
    clients.forEach((client) => {
      if (client !== ws && client.readyState === 1) {
        client.send(data);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });

  ws.send(JSON.stringify({ type: 'CONNECTED' }));
});

// Escuchar en el puerto configurado en Render
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
