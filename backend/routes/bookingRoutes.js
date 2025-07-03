import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get-bookings", protect);

export default router;
