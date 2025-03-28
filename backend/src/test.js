import { io } from "socket.io-client";

console.log("Starting Socket.io client...");
const socket = io("http://localhost:3001", {
  extraHeaders: {
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1OWZkZDNiMS05ODJlLTQ5ZjYtOTU2Zi1lZTE3ZGUwMGI3OTMiLCJlbWFpbCI6ImFiY0BnbWFpbC5jb20iLCJpYXQiOjE3NDI1NjQ4MjYsImV4cCI6MTc0MjY1MTIyNn0.aycH5KnDLIiNI3wxHK_RYX-mA6y6pHyddwPDhUQudmE"
  }
});

socket.on("connect", () => {
  console.log("✅ Connected to server with socket ID:", socket.id);
});

// Listen for a ready event from server before sending any messages
socket.on("ready", () => {
  console.log("🔌 Server is ready to receive messages");
  
  console.log("🏓 Sending ping...");
  socket.emit("ping", { message: "Ping from client" });
  
  console.log("📤 Attempting to send message...");
  socket.emit("sendMessage", {
    recipientId: "36f421db-ad9d-47f6-9063-4f111167c3b2",
    messageType: "text",
    content: "Hello from client"
  });
  console.log("📨 Message sent!");
});

socket.on("pong", (data) => {
  console.log("Received pong:", data);
});

socket.on("newMessage", (message) => {
  console.log("📩 Received message:", message);
});

socket.on("error", (error) => {
  console.error("❌ Socket error:", error);
});

socket.on("connect_error", (error) => {
  console.error("⚠️ Connection error:", error);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Disconnected. Reason:", reason);
});