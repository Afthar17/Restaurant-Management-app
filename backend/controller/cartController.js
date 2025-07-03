import User from "../models/userModel.js";
import Product from "../models/productModel.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const cart = user.cart;
    const existingProduct = cart.find(
      (item) => item.productId.toString() === productId
    );
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ productId, quantity: 1 });
    }
    await user.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error getting cart", error: error.message });
  }
};

export const getAllFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const productIds = user.cart.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const cartItems = user.cart.map((item) => {
      const product = products.find(
        (i) => i._id.toString() === item.productId.toString()
      );
      return { ...product.toJSON(), quantity: item.quantity };
    });
    res.status(200).json({ message: "Cart fetched successfully", cartItems });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error getting cart", error: error.message });
  }
};

export const deleteFromCart = async (req, res) => {
  try {
    const { product } = req.params;
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const cart = user.cart;
    const updatedCart = cart.filter(
      (item) => item.productId.toString() !== product
    );
    user.cart = updatedCart;
    await user.save({ new: true });
    res.status(200).json({ message: "Product deleted from cart", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error deleting cart", error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.cart = [];
    await user.save({ new: true });
    res.status(200).json({ message: "Cart cleared successfully", cart: [] });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error clearing cart", error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { product } = req.params;
    const { quantity } = req.body;
    const cart = user.cart;
    const existingProduct = cart.find(
      (item) => item.productId.toString() === product
    );
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    existingProduct.quantity = quantity;
    await user.save({ new: true });
    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error updating cart", error: error.message });
  }
};
