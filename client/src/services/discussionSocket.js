export class DiscussionSocket {
  constructor(userToken) {
    this.ws = null;
    this.userToken = userToken;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.isConnecting = false;
    this.connect();
  }

  connect() {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }
    this.isConnecting = true;

    try {
      if (this.ws) this.ws.close();

      this.ws = new WebSocket(`ws://localhost:5002?token=${this.userToken}`);

      this.ws.onopen = () => {
        console.log('✅ Connected to discussion notifications WebSocket');
        this.reconnectAttempts = 0;
        this.isConnecting = false;
      };

      // ✅ Keep discussion working + ADD club notifications
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 WebSocket received:', data);

          // =========================
          // 1) DISCUSSION NOTIFICATIONS (existing)
          // =========================
          if (data.type === 'discussion_notification') {
            if (Array.isArray(data.data)) {
              data.data.forEach((notification, index) => {
                if (notification && !notification.deleted) {
                  console.log(`📢 Dispatching discussion notification ${index + 1}:`, notification);
                  window.dispatchEvent(new CustomEvent('discussionNotification', {
                    detail: notification
                  }));
                }
              });
            } else if (data.data && !data.data.deleted) {
              console.log('📢 Dispatching single discussion notification:', data.data);
              window.dispatchEvent(new CustomEvent('discussionNotification', {
                detail: data.data
              }));
            }
          }

          // =========================
          // 2) CLUB NOTIFICATIONS (NEW)
          // =========================
          if (data.type === 'club_notification') {
            // your backend sends single object in data.data
            if (Array.isArray(data.data)) {
              // in case you ever send arrays later, this supports it
              data.data.forEach((notification, index) => {
                if (notification && !notification.deleted) {
                  console.log(`📢 Dispatching club notification ${index + 1}:`, notification);
                  window.dispatchEvent(new CustomEvent('clubNotification', {
                    detail: notification
                  }));
                }
              });
            } else if (data.data && !data.data.deleted) {
              console.log('📢 Dispatching single club notification:', data.data);
              window.dispatchEvent(new CustomEvent('clubNotification', {
                detail: data.data
              }));
            }
          }
        } catch (err) {
          console.error('WebSocket message parse error:', err);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.ws = null;
        this.isConnecting = false;
        this.reconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
        this.reconnect();
      };

    } catch (err) {
      console.error('WebSocket connection failed:', err);
      this.isConnecting = false;
    }
  }

  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(5000 * this.reconnectAttempts, 30000);
      console.log(`Reconnecting WebSocket in ${delay}ms... (attempt ${this.reconnectAttempts})`);
      setTimeout(() => this.connect(), delay);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
