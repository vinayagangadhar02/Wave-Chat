import express from "express";
import  searchContacts  from "../controllers/searchController.js"
import { authentication } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/search",authentication, searchContacts);

export default router;
