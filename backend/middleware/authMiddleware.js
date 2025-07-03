import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({ message: "Not authorized, no token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      res.status(401).json({ message: "Not authorized, invalid token" });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      res.status(401).json({ message: "Not authorized, user not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
    console.log(error.message, error.stack);
  }
};

export const hasRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  next();
};
