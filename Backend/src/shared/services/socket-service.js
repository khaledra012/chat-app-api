const jwt = require("jsonwebtoken");

class SocketService {
  constructor() {
    this.io = null;
    this.onlineUsers = new Map();
  }

  init(io) {
    this.io = io;

    this.io.on("connection", (socket) => {
      console.log("New socket connection:", socket.id);

      socket.on("register_user", (data) => {
        try {
          if (!data || !data.token) {
            return console.error("Register attempt without token! ❌");
          }

          const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
          const userId = decoded.id;

          socket.userId = userId;

          socket.join(userId);

          const deviceCount = this.onlineUsers.get(userId) || 0;
          this.onlineUsers.set(userId, deviceCount + 1);

          console.log(
            `User ${userId} secured. Total devices: ${deviceCount + 1}`,
          );

          socket.emit("registration_success", { userId });
        } catch (err) {
          console.error("Socket Auth Failed:", err.message);
          socket.emit("auth_error", "التوكن غير صالح أو انتهت مدته");
        }
      });

      socket.on("disconnect", () => {
        const userId = socket.userId;

        if (userId) {
          const deviceCount = this.onlineUsers.get(userId) || 1;

          if (deviceCount > 1) {
            this.onlineUsers.set(userId, deviceCount - 1);
            console.log(
              `Device disconnected for user ${userId}. Remaining: ${deviceCount - 1}`,
            );
          } else {
            this.onlineUsers.delete(userId);
            console.log(`User ${userId} is now fully offline 🔴`);
          }
        }
      });
    });
  }

  sendToUser(userId, event, data) {
    if (this.io) {
      this.io.to(userId).emit(event, data);
    }
  }
}

module.exports = new SocketService();
