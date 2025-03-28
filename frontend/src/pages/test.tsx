import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function MessageInput() {
  const [message, setMessage] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState("");
  const socket = useRef<Socket | null>(null); // Use useRef to prevent unnecessary re-renders

  useEffect(() => {
    const token = localStorage.getItem("token");

    socket.current = io("http://localhost:4000", {
      extraHeaders: {
        authorization: `Bearer ${token}`,
      },
    });

    socket.current.on("connect", () => console.log(`Connected: ${socket.current?.id}`));
    socket.current.on("disconnect", () => console.log("Disconnected"));

    return () => {
      socket.current?.disconnect(); // Cleanup when component unmounts
    };
  }, []);

  const handleSubmit = () => {
    setSubmittedMessage(message);

    if (!socket.current) {
      console.warn("Socket not ready yet!");
      return;
    }

    socket.current.emit("sendMessage", {
      recipientId: "36f421db-ad9d-47f6-9063-4f111167c3b2",
      messageType: "text",
      content: message,
    });

    setMessage("");
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message"
        className="border p-2 rounded w-64"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
      {submittedMessage && (
        <p className="mt-4 p-2 bg-gray-200 rounded">{submittedMessage}</p>
      )}
    </div>
  );
}
