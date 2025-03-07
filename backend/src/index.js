import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";


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

app.listen(3001,()=>{
    console.log("server started")
})
