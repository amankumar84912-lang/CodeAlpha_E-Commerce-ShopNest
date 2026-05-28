import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext }      from "../../context/AuthContext";
import { CartContext }      from "../../context/CartContext";
import { useToastContext }  from "../../context/ToastContext";
import { useWishlist }      from "../../context/WishlistContext";
import StarRating           from "../ui/StarRating";
import "./ProductCard.css";

/* ── Icons ── */
const CartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);

const SpinIcon = () => (
  <svg className="spin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round" />
  </svg>
);

const ImagePlaceholder = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

export default function ProductCard({ product }) {
  const [imgError,     setImgError]     = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const { user }                    = useContext(AuthContext);
  const { addToCart }               = useContext(CartContext);
  const { showToast }               = useToastContext();
  const { toggle, isWishlisted }    = useWishlist();
  const navigate                    = useNavigate();

  const inStock    = product.stock > 0;
  const wishlisted = isWishlisted(product._id);

  /* ── Derived discount badge: show on high-rated or high-priced items ── */
  const discountPct = product.discount ?? null;   // use if stored on model
  const isNew       = product.numReviews === 0;   // brand-new product
  const isHot       = product.rating >= 4.5 && product.numReviews >= 5;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast("Please sign in to add items to your cart.", "info");
      navigate("/login");
      return;
    }
    if (!inStock) return;
    setAddingToCart(true);
    try {
      await addToCart(product._id, 1);
      showToast(`"${product.title}" added to cart! 🛒`, "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Could not add to cart.", "error");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggle(product._id);
    showToast(
      wishlisted ? "Removed from wishlist" : "Saved to wishlist ❤️",
      wishlisted ? "info" : "success"
    );
  };

  return (
    <article className="product-card">

      {/* ── Image ── */}
      <Link to={`/products/${product._id}`} className="product-card__img-link" tabIndex={-1}>
        <div className="product-card__img-wrap">
          {!imgError && product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="product-card__img"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="product-card__img-placeholder">
              <ImagePlaceholder />
            </div>
          )}

          {/* Badges */}
          <div className="product-card__badges">
            {!inStock && <span className="product-card__badge product-card__badge--out">Out of Stock</span>}
            {inStock && isNew && <span className="product-card__badge product-card__badge--new">New</span>}
            {inStock && isHot && !isNew && <span className="product-card__badge product-card__badge--hot">🔥 Hot</span>}
            {discountPct && inStock && (
              <span className="product-card__badge product-card__badge--discount">-{discountPct}%</span>
            )}
          </div>

          {/* Wishlist */}
          <button
            className={`product-card__wishlist${wishlisted ? " product-card__wishlist--active" : ""}`}
            onClick={handleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <HeartIcon filled={wishlisted} />
          </button>

          {/* Out of stock full overlay */}
          {!inStock && <div className="product-card__oos-overlay" />}
        </div>
      </Link>

      {/* ── Body ── */}
      <div className="product-card__body">
        {/* Category + Stock */}
        <div className="product-card__meta">
          <span className="badge badge-accent product-card__category">
            {product.category}
          </span>
          {inStock ? (
            <span className="product-card__stock product-card__stock--in">
              ✓ {product.stock} left
            </span>
          ) : (
            <span className="product-card__stock product-card__stock--out">
              Sold out
            </span>
          )}
        </div>

        {/* Title */}
        <Link to={`/products/${product._id}`} className="product-card__title-link">
          <h3 className="product-card__title">{product.title}</h3>
        </Link>

        {/* Description preview */}
        <p className="product-card__desc">{product.description}</p>

        {/* Rating */}
        {product.rating > 0 && (
          <StarRating rating={product.rating} count={product.numReviews} size="sm" />
        )}

        {/* Price */}
        <p className="product-card__price">
          ₹{product.price.toLocaleString("en-IN")}
        </p>

        {/* Actions */}
        <div className="product-card__actions">
          <Link
            to={`/products/${product._id}`}
            className="btn btn-secondary btn-sm product-card__btn"
          >
            <EyeIcon /> Details
          </Link>

          <button
            className="btn btn-primary btn-sm product-card__btn"
            onClick={handleAddToCart}
            disabled={addingToCart || !inStock}
          >
            {addingToCart ? <SpinIcon /> : <CartIcon />}
            {addingToCart ? "Adding…" : "Add to Cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
