import { useLocation, Link, Navigate } from "react-router-dom";
import "./OrderConfirmationPage.css";

/* ── Icons ── */
const PackageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const ClipboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="2" /><path d="M9 12h6M9 16h4" />
  </svg>
);

const TruckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

/* ── Animated Checkmark ── */
function AnimatedCheck() {
  return (
    <div className="confirm-check-wrap">
      <svg className="confirm-svg" viewBox="0 0 52 52" aria-hidden="true">
        <circle className="confirm-circle" cx="26" cy="26" r="25" fill="none" />
        <polyline className="confirm-poly" points="14,27 22,35 38,17" fill="none" />
      </svg>
    </div>
  );
}

/* ── Info Badge ── */
function InfoRow({ icon, label, value }) {
  return (
    <div className="info-row">
      <div className="info-row__icon">{icon}</div>
      <div>
        <p className="info-row__label">{label}</p>
        <p className="info-row__value">{value}</p>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  const { state } = useLocation();

  /* Guard: redirect if reached directly (no order state) */
  if (!state?.order) {
    return <Navigate to="/" replace />;
  }

  const { order, shippingAddress, items, total } = state;
  const FREE_THRESHOLD = 500;
  const shipping       = (total ?? 0) >= FREE_THRESHOLD ? 0 : 50;
  const grand          = (total ?? order.totalPrice) + shipping;

  /* Estimate delivery date: +5 business days */
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  const formattedDate = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  /* Short order ID */
  const shortId = order._id?.slice(-8).toUpperCase();

  return (
    <div className="page-wrapper confirm-page">
      <div className="container confirm-container">

        {/* ── Success Animation ── */}
        <div className="confirm-hero">
          <AnimatedCheck />
          <h1 className="confirm-title">Order Placed!</h1>
          <p className="confirm-subtitle">
            Thank you for your order. We'll have it on its way soon.
          </p>
        </div>

        {/* ── Order info cards ── */}
        <div className="confirm-info-grid">
          <InfoRow
            icon={<ClipboardIcon />}
            label="Order ID"
            value={`#${shortId}`}
          />
          <InfoRow
            icon={<TruckIcon />}
            label="Estimated Delivery"
            value={formattedDate}
          />
          {shippingAddress && (
            <InfoRow
              icon={<MapPinIcon />}
              label="Delivering to"
              value={`${shippingAddress.address}, ${shippingAddress.city} – ${shippingAddress.pinCode}`}
            />
          )}
        </div>

        {/* ── Order summary ── */}
        <div className="confirm-summary">
          <h2 className="confirm-summary__title">
            <PackageIcon /> Items in your order
          </h2>

          <div className="confirm-items">
            {(items ?? order.orderItems ?? []).map((item, i) => {
              const product = item.product ?? item; // handles both populated and snapshot
              const title   = product.title ?? item.title;
              const price   = product.price ?? item.price;
              const image   = product.image ?? item.image;
              const qty     = item.quantity;
              return (
                <div key={i} className="confirm-item">
                  <div className="confirm-item__img-wrap">
                    {image ? (
                      <img src={image} alt={title} className="confirm-item__img" onError={(e) => e.target.style.display="none"} />
                    ) : (
                      <div className="confirm-item__img-placeholder"><ShoppingBagIcon /></div>
                    )}
                  </div>
                  <div className="confirm-item__info">
                    <p className="confirm-item__title">{title}</p>
                    <p className="confirm-item__meta">Qty: {qty} &times; ₹{price?.toLocaleString("en-IN")}</p>
                  </div>
                  <span className="confirm-item__total">
                    ₹{((price ?? 0) * qty).toLocaleString("en-IN")}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="confirm-totals">
            <div className="confirm-totals__row">
              <span>Subtotal</span>
              <span>₹{(total ?? order.totalPrice)?.toLocaleString("en-IN")}</span>
            </div>
            <div className="confirm-totals__row">
              <span>Shipping</span>
              <span className={shipping === 0 ? "confirm-free" : ""}>
                {shipping === 0 ? "Free" : `₹${shipping}`}
              </span>
            </div>
            <div className="confirm-totals__divider" />
            <div className="confirm-totals__row confirm-totals__row--grand">
              <span>Total Paid</span>
              <span>₹{grand.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* ── Next steps ── */}
        <div className="confirm-next">
          <h3 className="confirm-next__title">What's next?</h3>
          <div className="confirm-next__steps">
            {[
              { icon: "📧", text: "You'll receive an order confirmation on your registered email." },
              { icon: "📦", text: "Our team will pack and dispatch your order within 1–2 business days." },
              { icon: "🚚", text: "Track your delivery — estimated arrival by " + formattedDate + "." },
            ].map(({ icon, text }) => (
              <div key={text} className="confirm-next__item">
                <span className="confirm-next__emoji">{icon}</span>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="confirm-cta">
          <Link to="/orders"   className="btn btn-primary btn-lg">View My Orders</Link>
          <Link to="/products" className="btn btn-secondary btn-lg">Continue Shopping</Link>
        </div>

      </div>
    </div>
  );
}
