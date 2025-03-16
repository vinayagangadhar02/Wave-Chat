import express from "express";
import { authentication } from "../middlewares/authMiddleware.js"; 

const router = express.Router();

router.get("/me", authentication, (req, res) => {
  res.json({ userId: req.id });
});

export default router;

