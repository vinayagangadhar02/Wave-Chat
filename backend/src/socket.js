import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const setUpSocket=(server)=>{

const io = new Server(server,{
    cors:{
        origin:process.env.ORIGIN,
        methods:["GET","POST"]
    }
 });

 const userSocketMap=new Map();

 const disconnect=(socket)=>{
   console.log(`Client Disconntected: ${socket.id}`);
   for(const[userId,socketId] of userSocketMap.entries()){
    if(socketId===socket.id){
        userSocketMap.delete(userId);
        break;
    }
   }
 }


 const sendMessage = async (message) => {
  const senderSocketId = userSocketMap.get(message.sender);
  const recipientSocketId = userSocketMap.get(message.recipient);

  const createMessage = await prisma.message.create({
    data: message
  });

  const messageData = await prisma.message.findUnique({
    where: { id: createMessage.id },
    include: {
      sender: {
        select: { id: true, f_name: true, l_name: true }
      },
      recipient: {
        select: { id: true, f_name: true, l_name: true }
      }
    }


  });

  if (recipientSocketId) {
    io.to(recipientSocketId).emit("newMessage", messageData);
  }

  
  if (senderSocketId) {
    io.to(senderSocketId).emit("newMessage", messageData);
  }
};



io.on("connection", (socket) => {
  const userId=socket.handshake.query.userId;

  if(userId){
    userSocketMap.set(userId,socket.id);
    console.log(`User connected: ${userId} with socket ID: ${socket.id}`)
  }
  else{
    console.log("User ID not provided during connection")
  }



  socket.on("sendMessage",sendMessage)

  socket.io("disconnect",()=>{
disconnect(socket)
  })
});
}


export default setUpSocket;