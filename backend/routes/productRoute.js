import express from "express";
import {
  addProducts,
  deleteProduct,
  featureProduct,
  getAllProducts,
  getProductsByCategory,
  reviewProduct,
  searchProducts,
  updateProduct,
} from "../controller/productController.js";
import { hasRole, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get-products", getAllProducts);
router.get("/get-products/search", searchProducts);
router.get("/get-products/:category", getProductsByCategory);

router.post("/add-product", protect, hasRole(["super-admin"]), addProducts);
router.put(
  "/update-product/:id",
  protect,
  hasRole(["super-admin"]),
  updateProduct
);
router.post("/delete/:id", protect, hasRole(["super-admin"]), deleteProduct);
router.post(
  "/feature-product/:id",
  protect,
  hasRole(["super-admin"]),
  featureProduct
);
router.post("/review/:id", protect, reviewProduct);

export default router;
