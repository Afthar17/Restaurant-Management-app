import Product from "../models/productModel.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error finding products" + error.message });
  }
};

export const addProducts = async (req, res) => {
  try {
    const { name, image, price, category, decription, offer } = req.body;
    if (!name || !image || !price || !category || !decription || !offer) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (price < 0) {
      return res.status(400).json({ message: "Price cannot be negative" });
    }
    const result = await cloudinary.uploader.upload(image);
    const newProduct = await Product.create({
      name,
      image: result.secure_url,
      price,
      category,
      decription,
      offer,
    });
    res.status(200).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error adding products " + error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, price, category, decription, offer } = req.body;
    if (!name || !image || !price || !category || !decription || !offer) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (price < 0) {
      return res.status(400).json({ message: "Price cannot be negative" });
    }
    const result = await cloudinary.uploader.upload(image);
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        image: result.secure_url,
        price,
        category,
        decription,
        offer,
      },
      { new: true }
    );
    if (!updatedProduct) {
      res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating products " + error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting products " + error.message });
  }
};

export const reviewProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rating, comment } = req.body;
    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.reviews.push({ name, rating, comment });
    const totalReviews = product.reviews.length;
    const totalRating = product.reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    product.rating = totalRating / totalReviews;
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error review product " + error.message });
  }
};

export const featureProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.featured = !product.featured;
    const updatedProduct = await product.save({ new: true });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error featuring product " + error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    if (!products) {
      return res
        .status(404)
        .json({ message: `Products not found of category ${category}` });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: `Error finding products` + error.message });
  }
};

export const recomendedProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);
    if (!products) {
      return res.status(404).json({ message: `Products not found ` });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: `Error finding products` + error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const keyword = req.query.query || "";
    console.log(keyword);
    const products = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
      ],
    });
    if (!products) {
      return res.status(404).json({ message: `Products not found ` });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: `Error finding products` + error.message });
  }
};
