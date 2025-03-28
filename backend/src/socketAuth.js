import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.headers.authorization?.split(" ")[1];
    console.log(socket.handshake.headers)
    console.log("TOKEN: ", token)
    if (!token) {
      return new Error("Authentication required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    if (!userId) {
      return next(new Error("Invalid authentication"));
    }

    const userExists = await prisma.user.findUnique({ where: { id: userId } });

    if (!userExists) {
      return next(new Error("User not found"));
    }

    // Attach user details to socket object
    socket.user = { id: userId };
    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
};

export default socketAuthMiddleware;
