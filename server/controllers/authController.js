const User        = require("../models/User");
const bcrypt      = require("bcryptjs");
const jwt         = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");


/* ── REGISTER ─────────────────────────────────── */
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("name, email and password are required");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409);
    throw new Error("An account with that email already exists");
  }

  const hashed = await bcrypt.hash(password, 10);
  const user   = await User.create({ name, email, password: hashed });

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
});


/* ── LOGIN ────────────────────────────────────── */
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
  });
});


/* ── UPDATE PROFILE ───────────────────────────── */
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  /* ── Name update ── */
  if (name && name.trim()) {
    user.name = name.trim();
  }

  /* ── Email update — check it's not already taken ── */
  if (email && email.trim() && email.trim() !== user.email) {
    const taken = await User.findOne({ email: email.trim() });
    if (taken) {
      res.status(409);
      throw new Error("That email address is already in use");
    }
    user.email = email.trim();
  }

  /* ── Password change — requires current password ── */
  if (newPassword) {
    if (!currentPassword) {
      res.status(400);
      throw new Error("Current password is required to set a new password");
    }
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      res.status(401);
      throw new Error("Current password is incorrect");
    }
    if (newPassword.length < 6) {
      res.status(400);
      throw new Error("New password must be at least 6 characters");
    }
    user.password = await bcrypt.hash(newPassword, 10);
  }

  const updated = await user.save();

  /* Issue a fresh token so the client stays logged in after email change */
  const token = jwt.sign({ id: updated._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    token,
    user: {
      _id:       updated._id,
      name:      updated.name,
      email:     updated.email,
      role:      updated.role,
      createdAt: updated.createdAt,
    },
  });
});