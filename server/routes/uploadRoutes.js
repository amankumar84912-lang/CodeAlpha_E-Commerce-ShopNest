const express    = require("express");
const upload     = require("../middleware/uploadMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * POST /api/upload
 * Admin-only — Upload a single product image to Cloudinary.
 * Returns: { imageUrl: "https://res.cloudinary.com/..." }
 */
router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400);
      throw new Error("No image file provided");
    }

    res.status(200).json({
      success:  true,
      imageUrl: req.file.path,            // Cloudinary secure HTTPS URL
      publicId: req.file.filename,        // Cloudinary public_id for deletion
    });
  })
);

module.exports = router;
