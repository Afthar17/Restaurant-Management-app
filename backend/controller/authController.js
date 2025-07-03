import { genToken } from "../lib/utils.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });
    if (newUser) {
      await newUser.save();
      genToken(newUser._id, res);
    }

    res.status(201).json({
      message: "User created successfully",
      user: {
        user: newUser.name,
        id: newUser._id,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      genToken(user._id, res);
    }
    res.status(200).json({
      message: "User logged in successfully",
      user: {
        user: user.name,
        id: user._id,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message, error.stack);
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    console.log(req.cookies);
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json("error logging out", error.message);
    console.log(error.message, error.stack);
  }
};

export const checkAuth = async (req, res) => {
  try {
    console.log(req.user);
    res.status(200).json(req.user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "error finding user", error: error.message });
    console.log(error.message, error.stack);
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      "-password"
    );
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "error finding users", error: error.message });
    console.log(error.message, error.stack);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role: "admin" },
      { new: true }
    ).select("-password");
    if (!updateUser) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "error updating user", error: error.message });
  }
};
