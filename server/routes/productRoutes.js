const express = require("express");

const {
  protect,
  admin,
} = require("../middleware/authMiddleware");

const {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

router.post("/", protect, admin, createProduct);

router.get("/", getProducts);

router.get("/:id", getSingleProduct);

router.put("/:id", protect, admin, updateProduct);

router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;