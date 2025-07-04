import express from "express";
import { hasRole, protect } from "../middleware/authMiddleware.js";
import {
  addBooking,
  cancelBooking,
  getAllBookings,
} from "../controller/bookingController.js";

const router = express.Router();

router.get(
  "/get-bookings",
  protect,
  hasRole(["super-admin", "admin"]),
  getAllBookings
);
router.post("/add-booking", protect, addBooking);
router.delete("/cancel-booking/:id", protect, cancelBooking);

export default router;
