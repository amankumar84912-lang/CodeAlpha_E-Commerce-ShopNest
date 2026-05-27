/**
 * razorpay.js — fault-tolerant Razorpay initializer.
 *
 * Razorpay is OPTIONAL — the server starts normally even without credentials.
 * Payment routes will return 503 if credentials are not set.
 * To enable payments: add RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET to env vars.
 */

let razorpay = null;

try {
  const Razorpay = require("razorpay");

  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log("✅ Razorpay initialized");
  } else {
    console.warn("⚠️  Razorpay credentials not set — payment features disabled");
  }
} catch (err) {
  console.warn("⚠️  Razorpay initialization failed:", err.message);
}

module.exports = razorpay; // null when credentials are missing
