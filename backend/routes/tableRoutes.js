import express from "express";
import { protect, hasRole } from "../middleware/authMiddleware.js";
import {
  addTable,
  getAllTables,
  toggleAvailability,
} from "../controller/tableController.js";

const router = express.Router();

router.get("/get-tables", protect, getAllTables);
router.post("/add-table", protect, hasRole(["super-admin"]), addTable);
router.post(
  "/toggle-availability/:id",
  protect,
  hasRole(["super-admin", "admin"]),
  toggleAvailability
);

export default router;
