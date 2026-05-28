import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/product/ProductCard";
import SkeletonCard from "../components/ui/SkeletonCard";
import "./WishlistPage.css";

/* ── Icons ── */
const HeartBreakIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48 }}>
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

export default function WishlistPage() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const { wishlist, count } = useWishlist();

  useEffect(() => {
    getProducts()
      .then(({ data }) => setProducts(data))
      .catch(() => setError("Failed to load wishlist items."))
      .finally(() => setLoading(false));
  }, []);

  // Filter products by wishlisted IDs
  const wishlistedItems = products.filter((p) => wishlist.includes(p._id));

  return (
    <div className="page-wrapper wishlist-page">
      <div className="container">
        
        {/* Header */}
        <div className="wishlist-header">
          <div>
            <h1 className="wishlist-header__title">
              My Wishlist
              {count > 0 && <span className="wishlist-header__count">{count} {count === 1 ? "item" : "items"}</span>}
            </h1>
            <p className="wishlist-header__sub">
              Your saved favorites in one elegant place
            </p>
          </div>
          <Link to="/products" className="btn btn-ghost btn-sm wishlist-header__back">
            <ArrowLeftIcon /> Continue Shopping
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="products-grid">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="wishlist-error">
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : wishlistedItems.length === 0 ? (
          <div className="wishlist-empty">
            <div className="wishlist-empty__icon">
              <HeartBreakIcon />
            </div>
            <h2 className="wishlist-empty__title">Your wishlist is empty</h2>
            <p className="wishlist-empty__text">
              Add items that you love to your wishlist to keep track of them and buy them later.
            </p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="products-grid">
            {wishlistedItems.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
