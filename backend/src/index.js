import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js";
import { searchContacts } from "./controllers/SearchController.js";
import cors from "cors";
import setUpSocket from "./socket.js";
import me from "./routes/me.js"

dotenv.config()
const app=express()

app.use(cors());

app.use(
    cors({
      origin: "http://localhost:5173",
   
    })
  );


app.use(express.json());
app.use("/api/auth", authRoutes);
app.use('/api',searchContacts)
app.use('/api',me)

const server=app.listen(3001,()=>{
    console.log("server started")
})


setUpSocket(server)