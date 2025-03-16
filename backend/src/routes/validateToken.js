import express from "express";

import { authentication } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/validateToken", authentication, (req, res) => {
    res.json({ success: true });
});
export default router;



