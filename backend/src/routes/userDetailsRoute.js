import express from "express";
import { getDetails } from "../controllers/userDetailsController.js"


const router = express.Router();

router.get("/details", getDetails);

export default router;
