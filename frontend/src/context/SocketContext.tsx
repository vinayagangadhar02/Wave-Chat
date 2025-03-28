// import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
// import { io, Socket } from "socket.io-client";

// interface SocketContextType {
//   socket: Socket | null;
// }

// const SocketContext = createContext<SocketContextType | null>(null);

// export const useSocket = () => {
//   const context = useContext(SocketContext);
//   if (!context) throw new Error("useSocket must be used within a SocketProvider");
//   return context;
// };

// interface SocketProviderProps {
//   children: ReactNode;
// }

// export const SocketProvider: React.FC<SocketProviderProps> = ( {children}) => {
//   const socket = useState<Socket | null>(null);
  
//   useEffect(() => {
//    const token=localStorage.getItem("token")
  
//     socket.current = io("http://localhost:4000" ,{
//       extraHeaders: {
//         authorization: 'Bearer ' + token, // Pass the token in auth
//       }
//     });
  
//     socket.current.on("connect", () => console.log(`Connected: ${socket.current?.id}`));
//     socket.current.on("disconnect", () => console.log("Disconnected"));
  
//     // return () => {
//     //   socket.current?.disconnect();
//     // };
//   }, []);
  

//   return <SocketContext.Provider value={{ socket: socket.current }}>{children}</SocketContext.Provider>;
// };
