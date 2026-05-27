const jwt        = require("jsonwebtoken");
const User       = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

/* ── Protect routes — verify JWT ── */
exports.protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Not authorized — no token provided");
  }

  const token   = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET); // throws on invalid/expired

  req.user = await User.findById(decoded.id).select("-password");

  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized — user no longer exists");
  }

  next();
});

/* ── Admin-only guard ── */
exports.admin = (req, res, next) => {
  if (req.user?.role === "admin") return next();
  res.status(403);
  throw new Error("Forbidden — admin access required");
};