const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type:     String,
      required: [true, "Product title is required"],
      trim:     true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    description: {
      type:     String,
      required: [true, "Product description is required"],
      trim:     true,
    },

    price: {
      type:     Number,
      required: [true, "Product price is required"],
      min:      [0, "Price cannot be negative"],
    },

    image: {
      type:    String,
      default: "",
    },

    category: {
      type:     String,
      required: [true, "Product category is required"],
      trim:     true,
      lowercase: true,
    },

    stock: {
      type:    Number,
      required: [true, "Stock quantity is required"],
      min:     [0, "Stock cannot be negative"],
      default: 0,
    },

    rating: {
      type:    Number,
      default: 0,
      min:     0,
      max:     5,
    },

    numReviews: {
      type:    Number,
      default: 0,
      min:     0,
    },
  },
  { timestamps: true }
);

/* ── Indexes for query performance ── */
productSchema.index({ category: 1 });                      // Category filter
productSchema.index({ createdAt: -1 });                    // Default sort (newest)
productSchema.index({ price: 1 });                         // Price sort
productSchema.index({ title: "text", description: "text" }); // Full-text search

module.exports = mongoose.model("Product", productSchema);