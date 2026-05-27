const crypto       = require("crypto");
const razorpay     = require("../utils/razorpay");
const Order        = require("../models/Order");
const asyncHandler = require("../utils/asyncHandler");

/* ── CREATE RAZORPAY ORDER ───────────────────────────
 * Called AFTER our Order is saved in DB (COD, isPaid=false).
 * Creates a payment order at Razorpay with the given amount.
 * Returns razorpayOrderId + key to the frontend for the modal.
 * ────────────────────────────────────────────────── */
exports.createRazorpayOrder = asyncHandler(async (req, res) => {
  // Guard: Razorpay not configured (credentials missing on this deployment)
  if (!razorpay) {
    res.status(503);
    throw new Error("Payment service is not configured on this server");
  }

  const { amount, currency = "INR", orderId } = req.body;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("A valid payment amount is required");
  }
  if (!orderId) {
    res.status(400);
    throw new Error("orderId is required");
  }

  // Verify the order belongs to this user and is still unpaid
  const dbOrder = await Order.findById(orderId);
  if (!dbOrder) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (dbOrder.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }
  if (dbOrder.isPaid) {
    res.status(400);
    throw new Error("Order is already paid");
  }

  // Razorpay expects amount in paise (1 INR = 100 paise)
  const options = {
    amount:          Math.round(amount * 100),
    currency,
    receipt:         `order_${orderId}`,
    notes:           { orderId: orderId.toString(), userId: req.user._id.toString() },
  };

  const razorpayOrder = await razorpay.orders.create(options);

  res.status(200).json({
    success:         true,
    razorpayOrderId: razorpayOrder.id,
    amount:          razorpayOrder.amount,
    currency:        razorpayOrder.currency,
    key:             process.env.RAZORPAY_KEY_ID,
  });
});


/* ── VERIFY PAYMENT ──────────────────────────────────
 * Razorpay sends payment_id + order_id + signature.
 * We verify the HMAC-SHA256 signature server-side.
 * On success, we mark the order as paid.
 * ────────────────────────────────────────────────── */
exports.verifyPayment = asyncHandler(async (req, res) => {
  // Guard: Razorpay not configured
  if (!razorpay) {
    res.status(503);
    throw new Error("Payment service is not configured on this server");
  }

  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    orderId,
  } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderId) {
    res.status(400);
    throw new Error("All payment verification fields are required");
  }

  // HMAC-SHA256 verification — prevents tampered payment data
  const body      = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected  = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expected !== razorpaySignature) {
    res.status(400);
    throw new Error("Payment verification failed — invalid signature");
  }

  // Mark our order as paid
  const order = await Order.findByIdAndUpdate(
    orderId,
    {
      isPaid:        true,
      paidAt:        new Date(),
      paymentMethod: "Razorpay",
      paymentResult: {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      },
      orderStatus:   "Confirmed",
    },
    { new: true }
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    order,
  });
});
