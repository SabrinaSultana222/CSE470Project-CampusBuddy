const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

class WebSocketServer {
  constructor(port = 5002) {
    this.port = port;
    this.clients = new Map(); // userId -> Set<ws>
    this.wss = null;
  }

  start() {
    this.wss = new WebSocket.Server({ port: this.port });
    
    this.wss.on('connection', (ws, req) => {
      const url = new URL(req.url, `http://localhost:${this.port}`);
      const token = url.searchParams.get('token');
      
      let userId = null;
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        userId = decoded.id || decoded.userId || decoded._id;
      } catch (err) {
        console.log('Invalid WebSocket token');
        ws.close(1008, 'Invalid token');
        return;
      }

      if (!this.clients.has(userId)) {
        this.clients.set(userId, new Set());
      }
      this.clients.get(userId).add(ws);

      ws.on('close', () => {
        this.clients.get(userId)?.delete(ws);
        if (this.clients.get(userId)?.size === 0) {
          this.clients.delete(userId);
        }
      });
    });

    console.log(`✅ WebSocket server started on port ${this.port}`);
  }

  // ✅ FIXED: Send to SINGLE user only ONCE
  async sendToUser(userId, data) {
    const sockets = this.clients.get(userId);
    if (sockets) {
      for (const socket of sockets) {
        if (socket.readyState === WebSocket.OPEN) {
          console.log(`📤 Sending to user ${userId}:`, data);
          socket.send(JSON.stringify(data));
          break; // ✅ SEND ONLY ONCE per user
        }
      }
    }
  }

  // ✅ FIXED: No duplicate sends
  async sendToUsers(userIds, data) {
    const uniqueUserIds = [...new Set(userIds.map(id => id.toString()))]; // ✅ Remove duplicates
    console.log(`📤 Broadcasting to ${uniqueUserIds.length} unique users`);
    
    for (const userId of uniqueUserIds) {
      await this.sendToUser(userId, data);
    }
  }
}

module.exports = WebSocketServer;
