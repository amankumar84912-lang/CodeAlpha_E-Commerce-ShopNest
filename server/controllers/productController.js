const Product      = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

/* ── CREATE PRODUCT ── */
exports.createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, category, image, stock, rating, numReviews } = req.body;

  if (!title || !description || price == null || !category || stock == null) {
    res.status(400);
    throw new Error("title, description, price, category, and stock are required");
  }

  const product = await Product.create({
    title, description, price, category, image, stock,
    rating:     rating     ?? 0,
    numReviews: numReviews ?? 0,
  });

  res.status(201).json({ success: true, message: "Product created successfully", product });
});


/* ── GET ALL PRODUCTS ── */
exports.getProducts = asyncHandler(async (req, res) => {
  const { category, search, sort } = req.query;

  const filter = {};
  if (category) filter.category = category.toLowerCase();
  if (search)   filter.title    = { $regex: search, $options: "i" };

  const sortOptions = {
    "price-asc":  { price:  1 },
    "price-desc": { price: -1 },
    "rating":     { rating: -1 },
    "newest":     { createdAt: -1 },
  };
  const sortBy = sortOptions[sort] || { createdAt: -1 };

  const products = await Product.find(filter).sort(sortBy);
  res.status(200).json(products);
});


/* ── GET SINGLE PRODUCT ── */
exports.getSingleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json(product);
});


/* ── UPDATE PRODUCT ── */
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const allowed = ["title", "description", "price", "category", "image", "stock", "rating", "numReviews"];
  const updates = {};
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const updated = await Product.findByIdAndUpdate(req.params.id, updates, {
    new:        true,
    runValidators: true,
  });

  res.status(200).json({ success: true, message: "Product updated successfully", product: updated });
});


/* ── DELETE PRODUCT ── */
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();

  res.status(200).json({ success: true, message: "Product deleted successfully" });
});