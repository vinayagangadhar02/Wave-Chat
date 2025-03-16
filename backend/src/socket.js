import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const setUpSocket = (server) => {

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5174",
      methods: ["GET", "POST"]
    }
  });

  const userSocketMap = new Map();
  
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      console.log("User ID not provided during connection");
    }

    socket.on("sendMessage", async (message) => {
      await sendMessage(message, io);
    });
    

    socket.on("disconnect", () => {
      disconnect(socket);
    });
  });
  const disconnect = (socket) => {
    console.log(`Client Disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message,io) => {
    if (!message.senderId || !message.recipientId || !message.content || !message.messageType) {
      console.error("Invalid message data:", message);
      return;
    }
    

    const senderSocketId = userSocketMap.get(message.senderId);
   const recipientSocketId = userSocketMap.get(message.recipientId);


    const createMessage = await prisma.message.create({
      data: {
        senderId: message.senderId,
        recipientId: message.recipientId,
        messageType: message.messageType,
        content: message.content,
        fileUrl: message.fileUrl || null,
      },
    });
    

    const messageData = await prisma.message.findUnique({
      where: { id: createMessage.id },
      include: {
        sender: { select: { id: true, f_name: true, l_name: true } },
        recipient: { select: { id: true, f_name: true, l_name: true } },
      },
    });

    if (recipientSocketId) io.to(recipientSocketId).emit("newMessage", messageData);
    if (senderSocketId) io.to(senderSocketId).emit("newMessage", messageData);
  };
  return io;
  
};

export default setUpSocket;
