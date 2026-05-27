import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Spinner from "../components/ui/Spinner";
import "./CartPage.css";

/* ── Icons ── */
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

const TruckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const TagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COST           = 50;

/* ── Empty State ── */
function EmptyCart() {
  return (
    <div className="cart-empty">
      <div className="cart-empty__icon"><ShoppingBagIcon /></div>
      <h2 className="cart-empty__title">Your cart is empty</h2>
      <p className="cart-empty__text">
        Looks like you haven't added anything yet. Start browsing to find
        products you'll love.
      </p>
      <Link to="/products" className="btn btn-primary btn-lg">
        Browse Products
      </Link>
    </div>
  );
}

/* ── Cart Item Row ── */
function CartItem({ item, onRemove, onQtyChange }) {
  const { product, quantity } = item;

  // Guard against orphaned cart items (product deleted from DB)
  if (!product || !product._id) return null;

  const lineTotal = (product?.price ?? 0) * quantity;

  return (
    <div className="cart-item">
      {/* Image */}
      <Link to={`/products/${product._id}`} className="cart-item__img-link">
        <div className="cart-item__img-wrap">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="cart-item__img"
              onError={(e) => { e.target.style.display = "none"; }}
              loading="lazy"
            />
          ) : (
            <div className="cart-item__img-placeholder">
              <ShoppingBagIcon />
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="cart-item__info">
        <div className="cart-item__top">
          <div>
            <Link to={`/products/${product._id}`} className="cart-item__title">
              {product.title}
            </Link>
            <span className="cart-item__category">
              <TagIcon /> {product.category}
            </span>
          </div>
          <button
            className="cart-item__remove"
            onClick={() => onRemove(product._id)}
            aria-label={`Remove ${product.title} from cart`}
          >
            <TrashIcon />
          </button>
        </div>

        <div className="cart-item__bottom">
          {/* Quantity controls */}
          <div className="cart-item__qty">
            <button
              className="qty-ctrl-btn"
              onClick={() => onQtyChange(product._id, quantity, -1)}
              aria-label="Decrease quantity"
            >−</button>
            <span className="qty-ctrl-val">{quantity}</span>
            <button
              className="qty-ctrl-btn"
              onClick={() => onQtyChange(product._id, quantity, +1)}
              disabled={quantity >= product.stock}
              aria-label="Increase quantity"
            >+</button>
          </div>

          {/* Unit price */}
          <span className="cart-item__unit-price">
            ₹{product.price.toLocaleString("en-IN")} each
          </span>

          {/* Line total */}
          <span className="cart-item__total">
            ₹{lineTotal.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Order Summary ── */
function OrderSummary({ cartItems, cartTotal, cartCount }) {
  const navigate     = useNavigate();
  const shippingFree = cartTotal >= FREE_SHIPPING_THRESHOLD;
  const shipping     = shippingFree ? 0 : SHIPPING_COST;
  const grandTotal   = cartTotal + shipping;

  return (
    <div className="order-summary">
      <h2 className="order-summary__title">Order Summary</h2>

      <div className="order-summary__rows">
        <div className="summary-row">
          <span className="summary-row__label">
            Items ({cartCount})
          </span>
          <span className="summary-row__value">
            ₹{cartTotal.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="summary-row">
          <span className="summary-row__label">
            <TruckIcon /> Shipping
          </span>
          <span className={`summary-row__value${shippingFree ? " summary-row__value--free" : ""}`}>
            {shippingFree ? "Free" : `₹${shipping}`}
          </span>
        </div>

        {!shippingFree && (
          <div className="summary-row summary-row--hint">
            <span>
              Add ₹{(FREE_SHIPPING_THRESHOLD - cartTotal).toLocaleString("en-IN")} more for free shipping
            </span>
          </div>
        )}
      </div>

      <div className="order-summary__divider" />

      <div className="summary-row summary-row--total">
        <span className="summary-row__label">Grand Total</span>
        <span className="summary-row__value summary-row__value--total">
          ₹{grandTotal.toLocaleString("en-IN")}
        </span>
      </div>

      <button
        className="btn btn-primary btn-lg w-full order-summary__checkout"
        onClick={() => navigate("/checkout")}
      >
        Proceed to Checkout <ChevronRightIcon />
      </button>

      <Link to="/products" className="btn btn-ghost w-full order-summary__continue">
        <ArrowLeftIcon /> Continue Shopping
      </Link>

      {/* Trust badges */}
      <div className="order-summary__trust">
        <div className="trust-badge">
          <ShieldIcon /> Secure checkout
        </div>
        <div className="trust-badge">
          <TruckIcon /> Fast delivery
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function CartPage() {
  const { cartItems, cartCount, cartTotal, loading, removeFromCart, updateItemQty } =
    useContext(CartContext);

  if (loading) {
    return (
      <div className="page-wrapper cart-loading">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper cart-page">
      <div className="container">

        {/* ── Header ── */}
        <div className="cart-header">
          <h1 className="cart-header__title">
            My Cart
            <span className="cart-header__count">{cartCount} {cartCount === 1 ? "item" : "items"}</span>
          </h1>
          <Link to="/products" className="btn btn-ghost btn-sm cart-header__back">
            <ArrowLeftIcon /> Continue Shopping
          </Link>
        </div>

        {/* ── Two-column layout ── */}
        <div className="cart-layout">

          {/* ── Items column ── */}
          <div className="cart-items-col">
            <div className="cart-items">
              {cartItems.map((item) => (
                <CartItem
                  key={item._id ?? item.product._id}
                  item={item}
                  onRemove={removeFromCart}
                  onQtyChange={updateItemQty}
                />
              ))}
            </div>
          </div>

          {/* ── Summary column ── */}
          <div className="cart-summary-col">
            <OrderSummary
              cartItems={cartItems}
              cartTotal={cartTotal}
              cartCount={cartCount}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
