const Cart        = require("../models/Cart");
const asyncHandler = require("../utils/asyncHandler");

/* ── helpers ── */
const findOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

/* ── GET CART ─────────────────────────────────── */
exports.getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  res.status(200).json(cart ?? { items: [] });
});

/* ── ADD TO CART ─────────────────────────────── */
exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error("productId is required");
  }
  const qty = parseInt(quantity) || 1;
  if (qty < 1) {
    res.status(400);
    throw new Error("Quantity must be at least 1");
  }

  const cart = await findOrCreateCart(req.user._id);

  const existing = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existing) {
    existing.quantity += qty;
  } else {
    cart.items.push({ product: productId, quantity: qty });
  }

  await cart.save();
  res.status(200).json({ success: true, message: "Product added to cart" });
});

/* ── UPDATE CART ITEM QTY (SET, not increment) ── */
exports.updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity }  = req.body;
  const qty = parseInt(quantity);

  if (!qty || qty < 1) {
    res.status(400);
    throw new Error("Quantity must be a positive integer");
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) {
    res.status(404);
    throw new Error("Item not in cart");
  }

  item.quantity = qty; // direct set — no fragile delete+re-add
  await cart.save();
  res.status(200).json({ success: true, message: "Quantity updated" });
});

/* ── REMOVE CART ITEM ────────────────────────── */
exports.removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const before = cart.items.length;
  cart.items = cart.items.filter(
    (item) => item.product.toString() !== req.params.productId
  );

  if (cart.items.length === before) {
    res.status(404);
    throw new Error("Item not found in cart");
  }

  await cart.save();
  res.status(200).json({ success: true, message: "Item removed from cart" });
});

/* ── CLEAR CART ──────────────────────────────── */
exports.clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.status(200).json({ success: true, message: "Cart cleared" });
});
