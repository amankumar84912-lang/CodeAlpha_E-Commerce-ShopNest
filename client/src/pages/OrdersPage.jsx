import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../services/orderService";
import Spinner from "../components/ui/Spinner";
import "./OrdersPage.css";

/* ── Icons ── */
const ClipboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="2" /><path d="M9 12h6M9 16h4" />
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const ChevronDown = ({ open }) => (
  <svg
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
    strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s ease" }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const PackageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

/* ── Helpers ── */

/** Derive creation date — uses Mongoose createdAt if present, falls back to ObjectId timestamp */
function getCreatedAt(order) {
  if (order.createdAt) return new Date(order.createdAt);
  try {
    return new Date(parseInt(order._id.substring(0, 8), 16) * 1000);
  } catch {
    return new Date();
  }
}

/** Simulate order status based on age (backend has no status field) */
function deriveStatus(order) {
  const days = (Date.now() - getCreatedAt(order).getTime()) / 86_400_000;
  if (days < 1)  return { label: "Processing", cls: "status-warning", dot: "🟡" };
  if (days < 4)  return { label: "Shipped",     cls: "status-info",    dot: "🔵" };
  return           { label: "Delivered",    cls: "status-success", dot: "🟢" };
}

function formatDate(date) {
  return date.toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

/* ── Skeleton ── */
function OrderSkeleton() {
  return (
    <div className="order-skeleton">
      <div className="order-skeleton__header">
        <div className="skeleton sk-id"  />
        <div className="skeleton sk-badge" />
      </div>
      <div className="order-skeleton__body">
        <div className="order-skeleton__thumbs">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton sk-thumb" />)}
        </div>
        <div className="order-skeleton__meta">
          <div className="skeleton sk-line" />
          <div className="skeleton sk-line sk-line--short" />
        </div>
      </div>
    </div>
  );
}

/* ── Empty State ── */
function EmptyOrders() {
  return (
    <div className="orders-empty">
      <div className="orders-empty__icon"><ShoppingBagIcon /></div>
      <h2 className="orders-empty__title">No orders yet</h2>
      <p className="orders-empty__text">
        You haven't placed any orders yet. Start shopping to see your orders here.
      </p>
      <Link to="/products" className="btn btn-primary btn-lg">Browse Products</Link>
    </div>
  );
}

/* ── Error State ── */
function ErrorState({ message, onRetry }) {
  return (
    <div className="orders-error">
      <p className="orders-error__text">{message}</p>
      <button className="btn btn-primary" onClick={onRetry}>
        <RefreshIcon /> Try Again
      </button>
    </div>
  );
}

/* ── Order Card ── */
function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);

  const status      = deriveStatus(order);
  const created     = getCreatedAt(order);
  const shortId     = order._id.slice(-8).toUpperCase();
  const items       = order.orderItems ?? [];
  const previewItems = items.slice(0, 4);
  const remaining   = items.length - previewItems.length;

  /* Estimated delivery */
  const deliveryDate = new Date(created);
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  const deliveryStr = formatDate(deliveryDate);

  return (
    <article className={`order-card ${status.cls}`}>

      {/* ── Header ── */}
      <div className="order-card__header">
        <div className="order-card__ids">
          <span className="order-card__id">
            <ClipboardIcon /> Order #{shortId}
          </span>
          <span className="order-card__date">{formatDate(created)}</span>
        </div>
        <span className={`order-badge ${status.cls}`}>
          {status.label}
        </span>
      </div>

      {/* ── Preview row ── */}
      <div className="order-card__preview">
        {/* Thumbnail strip */}
        <div className="order-thumbs">
          {previewItems.map((item, i) => (
            <div key={i} className="order-thumb">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="order-thumb__img"
                  onError={(e) => { e.target.style.display = "none"; }}
                  loading="lazy"
                />
              ) : (
                <div className="order-thumb__placeholder"><PackageIcon /></div>
              )}
            </div>
          ))}
          {remaining > 0 && (
            <div className="order-thumb order-thumb--more">+{remaining}</div>
          )}
        </div>

        {/* Summary text */}
        <div className="order-card__meta">
          <span className="order-card__item-count">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
          <span className="order-card__total">₹{order.totalPrice?.toLocaleString("en-IN")}</span>
          {status.label !== "Delivered" && (
            <span className="order-card__delivery">Est. {deliveryStr}</span>
          )}
        </div>

        {/* Toggle */}
        <button
          className={`order-card__toggle${expanded ? " order-card__toggle--open" : ""}`}
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label="Toggle order details"
        >
          {expanded ? "Hide" : "View"} Details
          <ChevronDown open={expanded} />
        </button>
      </div>

      {/* ── Expanded details ── */}
      <div className={`order-card__details${expanded ? " order-card__details--open" : ""}`}>
        <div className="order-card__details-inner">

          {/* Items table */}
          <div className="order-items-table">
            <div className="order-items-table__head">
              <span>Product</span>
              <span className="align-center">Qty</span>
              <span className="align-right">Unit Price</span>
              <span className="align-right">Total</span>
            </div>
            {items.map((item, i) => (
              <div key={i} className="order-items-table__row">
                <div className="order-items-table__product">
                  <div className="order-items-table__img-wrap">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="order-items-table__img"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    ) : (
                      <div className="order-items-table__img-ph"><PackageIcon /></div>
                    )}
                  </div>
                  <span className="order-items-table__title">{item.title}</span>
                </div>
                <span className="align-center">×{item.quantity}</span>
                <span className="align-right">₹{item.price?.toLocaleString("en-IN")}</span>
                <span className="align-right font-semibold">
                  ₹{(item.price * item.quantity)?.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom row: address + total */}
          <div className="order-details-bottom">
            {/* Shipping address */}
            {order.shippingAddress && (
              <div className="order-address">
                <h4 className="order-address__title"><MapPinIcon /> Shipping Address</h4>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city} – {order.shippingAddress.pinCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            )}

            {/* Order total */}
            <div className="order-grand-total">
              <div className="order-grand-total__row">
                <span>Order Total</span>
                <span className="order-grand-total__val">
                  ₹{order.totalPrice?.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="order-grand-total__placed">
                Placed on {formatDate(created)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── Main Page ── */
export default function OrdersPage() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getMyOrders();
      // Sort newest first using ObjectId timestamp
      const sorted = [...data].sort(
        (a, b) => getCreatedAt(b).getTime() - getCreatedAt(a).getTime()
      );
      setOrders(sorted);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="page-wrapper orders-page">
      <div className="container">

        {/* ── Header ── */}
        <div className="orders-header">
          <div>
            <h1 className="orders-header__title">My Orders</h1>
            {!loading && !error && (
              <p className="orders-header__sub">
                {orders.length > 0
                  ? `${orders.length} ${orders.length === 1 ? "order" : "orders"} placed`
                  : "No orders yet"}
              </p>
            )}
          </div>
          <Link to="/products" className="btn btn-primary">
            Shop More
          </Link>
        </div>

        {/* ── Status Legend ── */}
        {!loading && !error && orders.length > 0 && (
          <div className="orders-legend">
            {[
              { cls: "status-warning", label: "Processing" },
              { cls: "status-info",    label: "Shipped" },
              { cls: "status-success", label: "Delivered" },
            ].map(({ cls, label }) => (
              <div key={label} className="legend-item">
                <span className={`legend-dot ${cls}`} />
                <span className="legend-label">{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Content ── */}
        {loading ? (
          <div className="orders-list">
            {[1, 2, 3].map((i) => <OrderSkeleton key={i} />)}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchOrders} />
        ) : orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
