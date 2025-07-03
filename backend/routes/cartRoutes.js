import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addToCart,
  clearCart,
  deleteFromCart,
  getAllFromCart,
} from "../controller/cartController.js";

const router = express.Router();

router.get("/get-all", protect, getAllFromCart);
router.post("/add-to-cart", protect, addToCart);
router.post("/clear-cart", protect, clearCart);
router.post("/update-quantity/:product", protect, clearCart);
router.delete("/delete-from-cart/:product", protect, deleteFromCart);

export default router;
