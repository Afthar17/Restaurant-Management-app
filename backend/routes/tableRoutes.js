import express from "express";
import { protect, hasRole } from "../middleware/authMiddleware.js";
import { addTable } from "../controller/tableController.js";

const router = express.Router();

router.post("/add-table", protect, hasRole(["super-admin"]), addTable);

export default router;
