const express = require("express");
const { createRazorpayOrder, verifyPayment } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-order", protect, createRazorpayOrder);  // Step 1: get Razorpay order ID
router.post("/verify",       protect, verifyPayment);         // Step 2: verify signature

module.exports = router;
