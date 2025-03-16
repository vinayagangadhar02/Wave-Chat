import express from "express";
import { getProfile } from "../controllers/profileController.js";
import { authentication } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile", authentication, getProfile);

export default router;
