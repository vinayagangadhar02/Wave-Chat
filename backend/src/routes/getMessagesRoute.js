import express from "express";
import { authentication } from "../middlewares/authMiddleware.js";
import { getMessages } from "../controllers/getMessagesController.js"
const router = express.Router();

router.get("/getMessages", authentication,getMessages);


export default router;
