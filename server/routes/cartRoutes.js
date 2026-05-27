const express = require("express");

const {
  addToCart,
  getCart,
  removeCartItem,
  clearCart,
  updateCartItem,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/",                  protect, getCart);        // GET  /api/cart
router.post("/",                 protect, addToCart);      // POST /api/cart
router.put("/:productId",        protect, updateCartItem); // PUT  /api/cart/:productId  (set qty)
router.delete("/:productId",     protect, removeCartItem); // DELETE /api/cart/:productId
router.delete("/",               protect, clearCart);      // DELETE /api/cart  (clear all)

module.exports = router;