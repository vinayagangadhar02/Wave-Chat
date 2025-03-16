import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js";
import searchRoutes from "./routes/searchRoutes.js"
import cors from "cors";
import setUpSocket from "./socket.js";
import me from "./routes/me.js"
import validateToken from "./routes/validateToken.js"
import profile from "./routes/profile.js"
import  editRoutes from "./routes/editRoutes.js";

dotenv.config()
const app=express()

app.use(cors());

app.use(
    cors({
      origin: "http://localhost:5174",
   
    })
  );


app.use(express.json());
app.use("/api/auth", authRoutes);
app.use('/api',searchRoutes)
app.use('/api',me)
app.use('/api',validateToken)
app.use('/api',profile)
app.use('/api',editRoutes)

const server=app.listen(3001,()=>{
    console.log("server started")
})


setUpSocket(server)