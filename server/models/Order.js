const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },

    orderItems: [
      {
        product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        title:    { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price:    { type: Number, required: true, min: 0 },
        image:    { type: String, default: "" },
      },
    ],

    shippingAddress: {
      address:    { type: String, required: true },
      city:       { type: String, required: true },
      postalCode: { type: String, required: true },
      country:    { type: String, required: true },
    },

    paymentMethod: {
      type:    String,
      default: "COD",
      enum:    ["COD", "Razorpay", "Stripe"],
    },

    /* Razorpay payment details — populated after successful payment */
    paymentResult: {
      razorpayOrderId:   { type: String },
      razorpayPaymentId: { type: String },
      razorpaySignature: { type: String },
    },

    totalPrice: {
      type:     Number,
      required: true,
      min:      0,
    },

    isPaid: {
      type:    Boolean,
      default: false,
    },

    paidAt: {
      type: Date,
    },

    orderStatus: {
      type:    String,
      default: "Processing",
      enum:    ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);