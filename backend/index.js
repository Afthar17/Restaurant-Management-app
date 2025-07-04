import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/productRoute.js";
import cartRoutes from "./routes/cartRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import { server, app } from "./lib/socket.js";

dotenv.config();

connectDB();

const port = process.env.PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/bookings", bookingRoutes);

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
