import express from "express";
import { editUser } from "../controllers/editController.js";
import { authentication } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.put("/edit", authentication,editUser);


export default router;
