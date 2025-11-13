import { Server } from "socket.io";

let io;

export const initIO = (server) => {
  io = new Server(server, {
    cors: { origin: "*" }, // replace with frontend URL in production
  });

  io.on("connection", (socket) => {
    console.log("✅ New client connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`Socket ${socket.id} joined room ${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
