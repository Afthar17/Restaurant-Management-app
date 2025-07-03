import express from "express";
import {
  checkAuth,
  getUsers,
  login,
  logout,
  signUp,
  updateUser,
} from "../controller/authController.js";
import { hasRole, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check-auth", protect, checkAuth);
router.get("/get-users", protect, hasRole(["super-admin", "admin"]), getUsers);
router.put("/get-user/:id", protect, hasRole(["super-admin"]), updateUser);

export default router;
