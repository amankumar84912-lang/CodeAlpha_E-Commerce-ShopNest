const express = require("express");
const { placeOrder, getMyOrders, getOrderById } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/",             protect, placeOrder);
router.get("/myorders",      protect, getMyOrders);
router.get("/:id",           protect, getOrderById);

module.exports = router;