import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import socketAuthMiddleware from "./socketAuth.js";

const prisma = new PrismaClient();

const setUpSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const userSocketMap = new Map();

  io.use(socketAuthMiddleware); // Apply authentication middleware

  io.on("connection", async (socket) => {
    const userId = socket.user.id; // Retrieved from middleware
    // socket.emit("sendMessage", {
    //   recipientId: "36f421db-ad9d-47f6-9063-4f111167c3b2",
    //   messageType: "text",
    //   content: "Hello from client"
    // });
    console.log(`✅ User connected: ${userId} with socket ID: ${socket.id}`);

    if (!userSocketMap.has(userId)) {
      userSocketMap.set(userId, new Set());
    }
    userSocketMap.get(userId).add(socket.id);

    // Register event handlers
    socket.on("sendMessage", async (messageData) => {
      try {
        console.log("helllllloooo")
        const { recipientId, messageType, content, fileUrl } = messageData;
        const senderId = userId;

        // Save message to DB
        const newMessage = await prisma.message.create({
          data: {
            senderId,
            recipientId,
            messageType,
            content,
            fileUrl: fileUrl || null,
            status: userSocketMap.has(recipientId) ? "read" : "unread",
          },
        });

        sendToUser(senderId, "newMessage", newMessage);
        sendToUser(recipientId, "newMessage", newMessage);
      } catch (error) {
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`❌ Client Disconnected: ${socket.id}, User: ${userId}`);
      disconnect(socket, userId);
    });

    // Fetch unread messages
    const unreadMessages = await prisma.message.findMany({
      where: { recipientId: userId, status: "unread" },
    });

    unreadMessages.forEach((message) => {
      socket.emit("newMessage", message);
    });

    await prisma.message.updateMany({
      where: { recipientId: userId, status: "unread" },
      data: { status: "read" },
    });

    socket.emit("ready");
  });

  const sendToUser = (userId, event, data) => {
    const userSockets = userSocketMap.get(userId) || new Set();
    userSockets.forEach((socketId) => {
      io.to(socketId).emit(event, data);
    });
  };

  const disconnect = (socket, userId) => {
    if (userSocketMap.has(userId)) {
      const socketIds = userSocketMap.get(userId);
      socketIds.delete(socket.id);
      if (socketIds.size === 0) {
        userSocketMap.delete(userId);
      }
    }
  };

  return io;
};

export default setUpSocket;
