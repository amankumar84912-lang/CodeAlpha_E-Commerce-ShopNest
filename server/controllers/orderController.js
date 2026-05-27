const Order      = require("../models/Order");
const Cart       = require("../models/Cart");
const asyncHandler = require("../utils/asyncHandler");


/* ── PLACE ORDER ─────────────────────────────── */
exports.placeOrder = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;

  // Validate shipping address fields
  if (!shippingAddress?.address || !shippingAddress?.city || !shippingAddress?.postalCode || !shippingAddress?.country) {
    res.status(400);
    throw new Error("Complete shipping address is required (address, city, postalCode, country)");
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Your cart is empty");
  }

  // Snapshot products at checkout price (prevents price changes mid-order)
  const orderItems = cart.items
    .filter((item) => item.product) // skip orphaned cart items
    .map((item) => ({
      product:  item.product._id,
      title:    item.product.title,
      quantity: item.quantity,
      price:    item.product.price,
      image:    item.product.image,
    }));

  if (orderItems.length === 0) {
    res.status(400);
    throw new Error("No valid products in cart");
  }

  const totalPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    totalPrice,
    paymentMethod: "COD",  // default — updated to Razorpay when paid online
  });

  // Clear cart after successful order creation
  cart.items = [];
  await cart.save();

  res.status(201).json({ success: true, message: "Order placed successfully", order });
});


/* ── GET MY ORDERS ───────────────────────────── */
exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(orders);
});


/* ── GET SINGLE ORDER ────────────────────────── */
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Only allow the owning user or admin to view
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }

  res.status(200).json(order);
});