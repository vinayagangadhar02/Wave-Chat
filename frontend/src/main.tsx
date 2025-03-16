import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from "sonner";
import './index.css'
import App from './App.tsx'
import { SocketProvider } from './context/SocketContext.tsx';

createRoot(document.getElementById('root')!).render(
  <SocketProvider>
  <StrictMode>
    <Toaster position="top-center"  />
    <App />
  </StrictMode>
  </SocketProvider>
)
