import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById, getProducts } from "../services/productService";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useToastContext } from "../context/ToastContext";
import ProductCard from "../components/product/ProductCard";
import Spinner from "../components/ui/Spinner";
import StarRating from "../components/ui/StarRating";
import "./ProductDetailPage.css";

/* ── Icons ── */
const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

const CartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6" />
  </svg>
);

const TagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const BoxIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const SpinIcon = () => (
  <svg className="spin-icon-detail" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round" />
  </svg>
);

const ImagePlaceholder = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
  </svg>
);

/* ── Quantity Selector ── */
function QuantitySelector({ value, onChange, max }) {
  return (
    <div className="qty-selector">
      <button
        className="qty-btn"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >−</button>
      <span className="qty-value">{value}</span>
      <button
        className="qty-btn"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >+</button>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id }     = useParams();
  const navigate   = useNavigate();

  const [product,       setProduct]       = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [imgError,      setImgError]      = useState(false);
  const [quantity,      setQuantity]      = useState(1);
  const [addingToCart,  setAddingToCart]  = useState(false);
  const [addedToCart,   setAddedToCart]   = useState(false);

  const { user }         = useContext(AuthContext);
  const { addToCart }    = useContext(CartContext);
  const { showToast }    = useToastContext();

  const [recentProducts, setRecentProducts] = useState([]);

  /* ── Fetch product ── */
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      setAddedToCart(false);
      try {
        const { data } = await getProductById(id);
        if (!data) { setError("Product not found."); return; }
        setProduct(data);
      } catch (err) {
        setError(err.response?.status === 404
          ? "Product not found."
          : "Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  /* ── Recently Viewed tracking ── */
  useEffect(() => {
    if (product && product._id) {
      try {
        const stored = JSON.parse(localStorage.getItem("shopnest-recent-viewed") || "[]");
        const filtered = stored.filter((x) => x !== product._id);
        const updated  = [product._id, ...filtered].slice(0, 4);
        localStorage.setItem("shopnest-recent-viewed", JSON.stringify(updated));

        getProducts()
          .then(({ data }) => {
            const matched = data.filter((p) => filtered.includes(p._id));
            setRecentProducts(matched);
          })
          .catch(() => {});
      } catch (e) {
        console.error(e);
      }
    }
  }, [product]);

  /* ── Add to cart ── */
  const handleAddToCart = async () => {
    if (!user) {
      showToast("Please sign in to add items to your cart.", "info");
      navigate("/login", { state: { from: { pathname: `/products/${id}` } } });
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(product._id, quantity);
      setAddedToCart(true);
      showToast(`${quantity}× "${product.title}" added to cart!`, "success");
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (err) {
      showToast(err.response?.data?.message || "Could not add to cart.", "error");
    } finally {
      setAddingToCart(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="product-detail-loading">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="page-wrapper">
        <div className="product-detail-error">
          <div className="product-detail-error__icon"><AlertIcon /></div>
          <h2>{error}</h2>
          <div className="product-detail-error__actions">
            <button className="btn btn-ghost" onClick={() => navigate(-1)}>
              <ArrowLeftIcon /> Go Back
            </button>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        </div>
      </div>
    );
  }

  const inStock   = product.stock > 0;
  const stockLow  = inStock && product.stock <= 5;

  return (
    <div className="page-wrapper">

      {/* ── Breadcrumb ── */}
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb__item">Home</Link>
          <span className="breadcrumb__sep">›</span>
          <Link to="/products" className="breadcrumb__item">Products</Link>
          <span className="breadcrumb__sep">›</span>
          <span className="breadcrumb__item breadcrumb__item--current">{product.title}</span>
        </nav>
      </div>

      {/* ── Main Content ── */}
      <div className="container product-detail">

        {/* ── Image Column ── */}
        <div className="product-detail__image-col">
          <div className="product-detail__img-wrap">
            {!imgError && product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="product-detail__img"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="product-detail__img-placeholder">
                <ImagePlaceholder />
              </div>
            )}

            {!inStock && (
              <div className="product-detail__oos-badge">Out of Stock</div>
            )}
          </div>

          {/* Mobile: back button */}
          <button className="btn btn-ghost product-detail__back" onClick={() => navigate(-1)}>
            <ArrowLeftIcon /> Back to Products
          </button>
        </div>

        {/* ── Info Column ── */}
        <div className="product-detail__info">

          {/* Back (desktop) */}
          <button className="btn btn-ghost btn-sm product-detail__back-desktop" onClick={() => navigate(-1)}>
            <ArrowLeftIcon /> Back
          </button>

          {/* Category */}
          <div className="product-detail__category">
            <TagIcon />
            <span>{product.category}</span>
          </div>

          {/* Title */}
          <h1 className="product-detail__title">{product.title}</h1>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="product-detail__rating">
              <StarRating rating={product.rating} count={product.numReviews} size="md" />
            </div>
          )}

          {/* Price */}
          <div className="product-detail__price-row">
            <span className="product-detail__price">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Stock status */}
          <div className={`product-detail__stock ${inStock ? "product-detail__stock--in" : "product-detail__stock--out"}`}>
            {inStock ? (
              <>
                <CheckIcon />
                <span>
                  {stockLow
                    ? `Only ${product.stock} left — order soon!`
                    : `In Stock (${product.stock} available)`}
                </span>
              </>
            ) : (
              <>
                <AlertIcon />
                <span>Out of Stock</span>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="divider" />

          {/* Description */}
          <div className="product-detail__desc-section">
            <h3 className="product-detail__desc-heading">
              <BoxIcon /> Description
            </h3>
            <p className="product-detail__desc">{product.description}</p>
          </div>

          {/* Divider */}
          <div className="divider" />

          {/* Quantity + Add to Cart */}
          {inStock && (
            <div className="product-detail__purchase">
              <div className="product-detail__qty-row">
                <label className="product-detail__qty-label">Quantity</label>
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  max={product.stock}
                />
              </div>

              <button
                className={`btn btn-lg w-full product-detail__cart-btn${addedToCart ? " product-detail__cart-btn--added" : ""}`}
                onClick={handleAddToCart}
                disabled={addingToCart || addedToCart}
              >
                {addingToCart ? (
                  <><SpinIcon /> Adding…</>
                ) : addedToCart ? (
                  <><CheckIcon /> Added to Cart!</>
                ) : (
                  <><CartIcon /> Add to Cart</>
                )}
              </button>
            </div>
          )}

          {!inStock && (
            <div className="product-detail__unavailable">
              <AlertIcon />
              <p>This product is currently unavailable. Check back soon.</p>
            </div>
          )}

          {/* Tags */}
          <div className="product-detail__tags">
            <span className="badge badge-accent">{product.category}</span>
            {inStock
              ? <span className="badge badge-success">In Stock</span>
              : <span className="badge badge-error">Out of Stock</span>}
          </div>
        </div>
      </div>

      {/* ── Recently Viewed Products ── */}
      {recentProducts.length > 0 && (
        <section className="recent-viewed-section" style={{ marginTop: "var(--space-16)", borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-12)", paddingBottom: "var(--space-12)" }}>
          <div className="container">
            <h2 className="section-title" style={{ fontSize: "var(--text-2xl)", fontWeight: 800, color: "var(--color-text-heading)", marginBottom: "var(--space-1)", letterSpacing: "-0.5px" }}>
              Recently Viewed
            </h2>
            <p className="section-subtitle" style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: "var(--space-6)" }}>
              Items you inspected recently on your shopping trip
            </p>
            <div className="products-grid">
              {recentProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
