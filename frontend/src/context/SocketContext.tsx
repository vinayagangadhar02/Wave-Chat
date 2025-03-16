// import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
// import { io, Socket } from "socket.io-client";
// import axiosInstance from "@/axios/axios";

// interface SocketContextType {
//   socket: Socket | null;
// }

// const SocketContext = createContext<SocketContextType | null>(null);

// export const useSocket = () => useContext(SocketContext);

// interface SocketProviderProps {
//   children: ReactNode;
// }

// export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
//   const socket = useRef<Socket | null>(null);
//   const [userId, setUserId] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await axiosInstance.get<{ userId: string }>("/auth/me"); 
//         setUserId(response.data.userId);
//       } catch (error) {
//         console.error("Error fetching user:", error);
//       }
//     };

//     fetchUser();
//   }, []);

//   useEffect(() => {
//     if (userId) {
//       socket.current = io("http://localhost:3001", {
//         query: { userId },
//       });

//       socket.current.on("connect", () => {
//         console.log(`Connected: ${socket.current?.id}`);
//       });

//       const handleRecieveMessage=(message)=>{
//        const{selectedChatData,selectedChatType,addMessage}=useAppStore.getState()
//        if(selectedChatType!=undefined && (selectedChatData.id===message.sender.id || selectedChatData.id===message.recipent.id)){
//         addMessage(message)
//        }
//       }

//       socket.current.on("recieveMessage",handleRecieveMessage)

//       socket.current.on("disconnect", () => {
//         console.log("Disconnected from server");
//       });

//       return () => {
//         socket.current?.disconnect();
//       };
//     }
//   }, [userId]);

//   return (
//     <SocketContext.Provider value={{ socket: socket.current }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };
