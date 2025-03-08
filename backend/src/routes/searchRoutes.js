import express from "express";
import { searchContacts } from "./controllers/searchController"
import { authentication } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/search",authentication, searchContacts);

export default router;
