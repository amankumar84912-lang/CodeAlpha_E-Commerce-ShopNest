import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";
import { AuthContext } from "../context/AuthContext";
import ProductCard from "../components/product/ProductCard";
import SkeletonCard from "../components/ui/SkeletonCard";
import StarRating   from "../components/ui/StarRating";
import "./HomePage.css";

/* ── Category Config ── */
const CATEGORIES = [
  { id: "smartphones", label: "Smartphones",  emoji: "📱", color: "#6366f1" },
  { id: "laptops",     label: "Laptops",       emoji: "💻", color: "#8b5cf6" },
  { id: "electronics", label: "Electronics",   emoji: "🎧", color: "#3b82f6" },
  { id: "watches",     label: "Watches",       emoji: "⌚", color: "#f59e0b" },
  { id: "fashion",     label: "Fashion",       emoji: "👕", color: "#ec4899" },
  { id: "shoes",       label: "Shoes",         emoji: "👟", color: "#10b981" },
  { id: "accessories", label: "Accessories",   emoji: "🎒", color: "#f97316" },
];

const features = [
  { icon: "🚚", title: "Fast Delivery",       desc: "Delivered in 2–5 business days nationwide." },
  { icon: "↩️",  title: "30-Day Returns",      desc: "Not happy? Return it, no questions asked." },
  { icon: "🔒", title: "Secure Payments",     desc: "Bank-grade encryption on every transaction." },
  { icon: "⭐", title: "Quality Guaranteed",  desc: "Every product verified before it ships." },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const { user } = useContext(AuthContext);
  const navigate  = useNavigate();

  useEffect(() => {
    getProducts()
      .then(({ data }) => setProducts(data.slice(0, 8)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* Top-rated product for hero spotlight */
  const spotlight = products.find((p) => p.rating >= 4.7) ?? products[0];

  return (
    <div className="page-wrapper home-page">

      {/* ═══════ HERO ═══════ */}
      <section className="hero">
        <div className="hero__glow hero__glow--left"  />
        <div className="hero__glow hero__glow--right" />
        <div className="container hero__content">
          <span className="hero__badge">🎉 New arrivals every week</span>
          <h1 className="hero__title">
            Discover Products<br />
            <span className="gradient-text">You'll Love</span>
          </h1>
          <p className="hero__subtitle">
            Shop thousands of premium products across electronics, fashion,
            home &amp; living — all in one beautiful place.
          </p>
          <div className="hero__cta">
            <Link to="/products" className="btn btn-primary btn-lg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6" />
              </svg>
              Shop Now
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-outline btn-lg">Create Free Account</Link>
            )}
          </div>

          {/* Stats */}
          <div className="hero__stats">
            {[["20+", "Products"], ["120K+", "Happy Customers"], ["4.7★", "Avg Rating"]].map(([val, label]) => (
              <div key={label} className="hero__stat">
                <span className="hero__stat-val">{val}</span>
                <span className="hero__stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spotlight product floating card */}
        {spotlight && (
          <div className="hero__spotlight" onClick={() => navigate(`/products/${spotlight._id}`)}>
            <div className="spotlight-card">
              <div className="spotlight-card__img-wrap">
                <img src={spotlight.image} alt={spotlight.title} className="spotlight-card__img" onError={(e) => e.target.style.display="none"} />
              </div>
              <div className="spotlight-card__info">
                <span className="spotlight-card__badge">🔥 Top Rated</span>
                <p className="spotlight-card__title">{spotlight.title}</p>
                <StarRating rating={spotlight.rating} count={spotlight.numReviews} size="xs" />
                <p className="spotlight-card__price">₹{spotlight.price?.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ═══════ CATEGORIES ═══════ */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Explore our curated collections across every lifestyle</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(({ id, label, emoji, color }) => (
              <Link
                key={id}
                to={`/products?category=${id}`}
                className="category-tile"
                style={{ "--cat-color": color }}
              >
                <span className="category-tile__emoji">{emoji}</span>
                <span className="category-tile__label">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FEATURED PRODUCTS ═══════ */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Handpicked favorites — top-rated across all categories</p>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm">View All</Link>
          </div>

          <div className="products-grid">
            {loading
              ? Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)
              : products.map((p)  => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ═══════ PROMO BANNER ═══════ */}
      <section className="promo-section">
        <div className="container">
          <div className="promo-banner">
            <div className="promo-banner__glow" />
            <div className="promo-banner__content">
              <span className="promo-banner__tag">Limited Offer</span>
              <h2 className="promo-banner__title">Free Shipping on Orders Over ₹500</h2>
              <p className="promo-banner__sub">
                Stock up on your favourites. No code needed — discount applied automatically at checkout.
              </p>
              <Link to="/products" className="btn btn-primary btn-lg">Grab the Deal</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why ShopNest?</h2>
            <p className="section-subtitle">Everything you need for a seamless shopping experience</p>
          </div>
          <div className="features__grid">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="feature-card">
                <div className="feature-card__icon">{icon}</div>
                <h3 className="feature-card__title">{title}</h3>
                <p className="feature-card__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA BANNER ═══════ */}
      <section className="cta-banner">
        <div className="container cta-banner__inner">
          <div>
            <h2 className="cta-banner__title">Ready to start shopping?</h2>
            <p className="cta-banner__sub">Browse our curated catalog and find something you'll love.</p>
          </div>
          <Link to="/products" className="btn btn-primary btn-lg">Browse All Products</Link>
        </div>
      </section>

    </div>
  );
}
