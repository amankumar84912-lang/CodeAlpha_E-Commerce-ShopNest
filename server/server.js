const express    = require("express");
const mongoose   = require("mongoose");
const cors       = require("cors");
const helmet     = require("helmet");
const rateLimit  = require("express-rate-limit");
require("dotenv").config();

const authRoutes    = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes    = require("./routes/cartRoutes");
const orderRoutes   = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const uploadRoutes  = require("./routes/uploadRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

/* ── Trust proxy (required for Render / Railway behind reverse proxy) ── */
app.set("trust proxy", 1);

/* ── Security Headers ── */
app.use(helmet());

/* ── CORS — allow localhost in dev, production frontend in prod ── */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://code-alpha-e-commerce-shop-nest.vercel.app",  // ← actual Vercel URL
  "https://codealpha-e-commerce-shopnest.vercel.app",    // alternate format
  process.env.CLIENT_URL,   // set this on Render to your exact Vercel URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman / server-to-server
    // Allow any *.vercel.app preview URL (Vercel generates unique URLs per commit)
    if (origin.endsWith(".vercel.app")) return callback(null, true);
    if (allowedOrigins.includes(origin))    return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));


/* ── Body Parser ── */
app.use(express.json({ limit: "10kb" }));

/* ── Rate Limiting ── */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests — please try again in 15 minutes." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts — please wait 15 minutes." },
});

app.use("/api", apiLimiter);
app.use("/api/auth", authLimiter);

/* ── MongoDB ── */
mongoose.set("returnDocument", "after"); // Fix Mongoose deprecation warning

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS:          45000,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

/* ── Routes ── */
app.get("/",            (req, res) => res.json({ status: "ok", app: "ShopNest API", version: "1.0.0" }));
app.get("/api/health",  (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

app.use("/api/auth",     authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart",     cartRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/payment",  paymentRoutes);
app.use("/api/upload",   uploadRoutes);

/* ── Error Handling ── */
app.use(notFound);
app.use(errorHandler);

/* ── Start Server ── */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`)
);

/* ── Graceful Shutdown (Render / Railway SIGTERM) ── */
const shutdown = (signal) => {
  console.log(`\n${signal} received — closing server gracefully`);
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log("✅ MongoDB connection closed");
      process.exit(0);
    });
  });
  // Force exit after 10s if connections don't close
  setTimeout(() => process.exit(1), 10000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT",  () => shutdown("SIGINT"));