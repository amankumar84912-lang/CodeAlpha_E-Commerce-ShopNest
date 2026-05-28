import { useState, useEffect, useContext } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { AuthContext }      from "../context/AuthContext";
import { CartContext }      from "../context/CartContext";
import { useToastContext }  from "../context/ToastContext";
import * as orderService    from "../services/orderService";
import Spinner              from "../components/ui/Spinner";
import "./CheckoutPage.css";

/* ── Load Razorpay SDK dynamically ─────────────── */
const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script   = document.createElement("script");
    script.src     = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

/* ── Icons ── */
const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);
const HashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
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
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const SpinIcon = () => (
  <svg className="spin-anim" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round" />
  </svg>
);
const RazorpayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" height="18" width="18">
    <path d="M14.25 2L6 14.25h5.25L8.25 22l10.5-11.25H13.5L17.25 2z"/>
  </svg>
);

/* ── Step Indicator ── */
function Steps({ current }) {
  const steps = [
    { n: 1, label: "Shipping" },
    { n: 2, label: "Review & Pay" },
  ];
  return (
    <div className="checkout-steps" role="list">
      {steps.map((s, i) => (
        <div key={s.n} className="step-wrapper" role="listitem">
          <div className={`step-item${current === s.n ? " step-item--active" : ""}${current > s.n ? " step-item--done" : ""}`}>
            <div className="step-circle">
              {current > s.n ? <CheckIcon /> : s.n}
            </div>
            <span className="step-label">{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`step-line${current > 1 ? " step-line--done" : ""}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Order Sidebar ── */
function OrderMini({ cartItems, cartTotal }) {
  const shipping = cartTotal >= 500 ? 0 : 50;
  const grand    = cartTotal + shipping;
  return (
    <aside className="checkout-sidebar">
      <h3 className="sidebar-title">Order Summary</h3>
      <div className="sidebar-items">
        {cartItems.map((item) => (
          <div key={item._id ?? item.product._id} className="sidebar-item">
            <div className="sidebar-item__img-wrap">
              {item.product.image && (
                <img src={item.product.image} alt={item.product.title} className="sidebar-item__img" onError={(e) => e.target.style.display="none"} />
              )}
              <span className="sidebar-item__qty">{item.quantity}</span>
            </div>
            <div className="sidebar-item__info">
              <p className="sidebar-item__title">{item.product.title}</p>
              <p className="sidebar-item__price">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="sidebar-divider" />
      <div className="sidebar-rows">
        <div className="sidebar-row">
          <span>Subtotal</span>
          <span>₹{cartTotal.toLocaleString("en-IN")}</span>
        </div>
        <div className="sidebar-row">
          <span>Shipping</span>
          <span className={shipping === 0 ? "sidebar-row__free" : ""}>
            {shipping === 0 ? "Free" : `₹${shipping}`}
          </span>
        </div>
      </div>
      <div className="sidebar-divider" />
      <div className="sidebar-row sidebar-row--total">
        <span>Total</span>
        <span className="sidebar-row__total-val">₹{grand.toLocaleString("en-IN")}</span>
      </div>
      <div className="sidebar-secure">
        <LockIcon /> Secured by Razorpay
      </div>
    </aside>
  );
}

/* ── Step 1: Shipping Form ── */
function ShippingForm({ form, onChange, onNext, onAutofill }) {
  const { user } = useContext(AuthContext);
  const [savedAddresses, setSavedAddresses] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("shopnest-addresses") || "[]");
      setSavedAddresses(saved);
    } catch {}
  }, []);

  const isValid  =
    form.address.trim().length >= 5 &&
    form.city.trim().length >= 2 &&
    /^\d{6}$/.test(form.postalCode) &&
    form.country.trim().length >= 2;

  return (
    <div className="checkout-form-section">
      <div className="section-heading">
        <MapPinIcon />
        <h2>Shipping Information</h2>
      </div>

      {savedAddresses.length > 0 && (
        <div className="saved-addresses-selector" style={{ marginBottom: "var(--space-6)" }}>
          <label className="form-label" style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)", display: "block" }}>
            ⚡ Quick Fill from Saved Addresses
          </label>
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            {savedAddresses.map((addr) => (
              <button
                key={addr.id}
                type="button"
                className="btn btn-outline btn-sm"
                style={{ padding: "6px 12px", fontSize: "var(--text-xs)", borderRadius: "var(--radius-full)", background: "var(--color-surface-elevated)" }}
                onClick={() => {
                  onAutofill({
                    address: addr.address,
                    city: addr.city,
                    postalCode: addr.postalCode,
                    country: addr.country
                  });
                }}
              >
                {addr.label === "Home" ? "🏠 Home" : addr.label === "Office" ? "💼 Office" : `📍 ${addr.customLabel || "Other"}`}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="form-group">
        <label className="form-label"><UserIcon /> Contact name</label>
        <input className="form-input form-input--readonly" value={user?.name ?? ""} readOnly tabIndex={-1} />
      </div>

      <div className="form-group">
        <label htmlFor="co-address" className="form-label">
          <BuildingIcon /> Street address <span className="form-required">*</span>
        </label>
        <input id="co-address" type="text" className="form-input" placeholder="123 MG Road, Apt 4B"
          value={form.address} onChange={onChange("address")} autoComplete="street-address" required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="co-city" className="form-label">
            <MapPinIcon /> City <span className="form-required">*</span>
          </label>
          <input id="co-city" type="text" className="form-input" placeholder="Mumbai"
            value={form.city} onChange={onChange("city")} autoComplete="address-level2" required />
        </div>
        <div className="form-group">
          <label htmlFor="co-pin" className="form-label">
            <HashIcon /> Pin code <span className="form-required">*</span>
          </label>
          <input id="co-pin" type="text"
            className={`form-input${form.postalCode && !/^\d{6}$/.test(form.postalCode) ? " form-input--error" : ""}`}
            placeholder="400001" value={form.postalCode} onChange={onChange("postalCode")}
            autoComplete="postal-code" maxLength={6} required />
          {form.postalCode && !/^\d{6}$/.test(form.postalCode) && (
            <span className="form-error">Enter a valid 6-digit pin code</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="co-country" className="form-label">
          <GlobeIcon /> Country <span className="form-required">*</span>
        </label>
        <select id="co-country" className="form-input" value={form.country} onChange={onChange("country")} autoComplete="country">
          <option value="India">India</option>
          <option value="United States">United States</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Canada">Canada</option>
          <option value="Australia">Australia</option>
          <option value="UAE">UAE</option>
          <option value="Singapore">Singapore</option>
        </select>
      </div>

      <button className="btn btn-primary btn-lg checkout-next-btn" onClick={onNext} disabled={!isValid}>
        Continue to Review <ChevronRightIcon />
      </button>
      <Link to="/cart" className="btn btn-ghost checkout-back-link">
        <ArrowLeftIcon /> Back to Cart
      </Link>
    </div>
  );
}

/* ── Step 2: Review & Pay ── */
function ReviewAndPay({ form, cartItems, cartTotal, onBack, onPay, paying }) {
  const shipping = cartTotal >= 500 ? 0 : 50;
  const grand    = cartTotal + shipping;

  return (
    <div className="checkout-review-section">
      {/* Address */}
      <div className="review-block">
        <div className="section-heading">
          <MapPinIcon /><h2>Delivering to</h2>
          <button className="review-edit-btn" onClick={onBack}>Edit</button>
        </div>
        <div className="address-card">
          <p className="address-card__line">{form.address}</p>
          <p className="address-card__line">{form.city} — {form.postalCode}</p>
          <p className="address-card__line">{form.country}</p>
        </div>
      </div>

      {/* Items */}
      <div className="review-block">
        <div className="section-heading">
          <TruckIcon /><h2>Your Items ({cartItems.length})</h2>
        </div>
        <div className="review-items">
          {cartItems.map((item) => (
            <div key={item._id ?? item.product._id} className="review-item">
              <div className="review-item__img-wrap">
                {item.product.image && (
                  <img src={item.product.image} alt={item.product.title} className="review-item__img" onError={(e) => e.target.style.display="none"} />
                )}
              </div>
              <div className="review-item__info">
                <p className="review-item__title">{item.product.title}</p>
                <p className="review-item__meta">Qty: {item.quantity} × ₹{item.product.price.toLocaleString("en-IN")}</p>
              </div>
              <span className="review-item__total">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="review-block review-totals">
        <div className="totals-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString("en-IN")}</span></div>
        <div className="totals-row">
          <span>Shipping</span>
          <span className={shipping === 0 ? "totals-free" : ""}>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
        </div>
        <div className="totals-divider" />
        <div className="totals-row totals-row--grand">
          <span>Grand Total</span>
          <span>₹{grand.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Razorpay CTA */}
      <div className="review-actions">
        <button className="btn btn-primary btn-lg review-place-btn razorpay-btn" onClick={onPay} disabled={paying}>
          {paying ? (
            <><SpinIcon /> Opening Payment…</>
          ) : (
            <><RazorpayIcon /> Pay ₹{grand.toLocaleString("en-IN")} with Razorpay</>
          )}
        </button>
        <button className="btn btn-ghost" onClick={onBack}>
          <ArrowLeftIcon /> Edit Shipping
        </button>
      </div>

      <div className="razorpay-trust">
        <LockIcon />
        <span>Your payment is secured by <strong>Razorpay</strong> — 256-bit SSL encrypted</span>
      </div>

      <p className="review-disclaimer">
        By placing your order, you agree to our terms of service.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════ */
export default function CheckoutPage() {
  const navigate = useNavigate();

  const { user }                                              = useContext(AuthContext);
  const { cartItems, cartTotal, cartCount, clearCart, loading } = useContext(CartContext);
  const { showToast }                                         = useToastContext();

  const [step,   setStep]   = useState(1);
  const [paying, setPaying] = useState(false);
  const [form,   setForm]   = useState({ address: "", city: "", postalCode: "", country: "India" });

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  if (!loading && cartItems.length === 0) return <Navigate to="/cart" replace />;
  if (loading) return <div className="page-wrapper checkout-loading"><Spinner size="lg" /></div>;

  const shipping = cartTotal >= 500 ? 0 : 50;
  const grand    = cartTotal + shipping;

  /* ── Full Razorpay Payment Flow ── */
  const handlePay = async () => {
    setPaying(true);

    try {
      /* Step 1 — Load Razorpay script */
      const scriptLoaded = await loadRazorpay();
      if (!scriptLoaded) {
        showToast("Could not load payment gateway. Check your connection.", "error");
        return;
      }

      /* Step 2 — Create our Order in DB (COD, isPaid=false) */
      const { data: orderData } = await orderService.placeOrder({
        shippingAddress: {
          address:    form.address.trim(),
          city:       form.city.trim(),
          postalCode: form.postalCode.trim(),
          country:    form.country.trim(),
        },
      });
      const dbOrderId = orderData.order._id;

      /* Step 3 — Create Razorpay payment order */
      const { data: rzpData } = await orderService.createRazorpayOrder({
        amount:   grand,
        currency: "INR",
        orderId:  dbOrderId,
      });

      /* Step 4 — Open Razorpay modal */
      const options = {
        key:          rzpData.key,
        amount:       rzpData.amount,
        currency:     rzpData.currency,
        name:         "ShopNest",
        description:  `Order #${dbOrderId.slice(-8).toUpperCase()}`,
        order_id:     rzpData.razorpayOrderId,
        prefill: {
          name:  user?.name  ?? "",
          email: user?.email ?? "",
        },
        theme:        { color: "#6366f1" },

        /* Step 5 — On payment success, verify on backend */
        handler: async (response) => {
          try {
            const { data: verifyData } = await orderService.verifyPayment({
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId:           dbOrderId,
            });

            // Clear the cart & navigate to confirmation
            clearCart();
            showToast("🎉 Payment successful! Order confirmed.", "success");
            navigate("/order-confirmation", {
              state: {
                order:           verifyData.order,
                shippingAddress: form,
                items:           cartItems,
                total:           grand,
                paymentId:       response.razorpay_payment_id,
              },
              replace: true,
            });
          } catch (err) {
            showToast(err.response?.data?.message || "Payment verification failed. Contact support.", "error");
          } finally {
            setPaying(false);
          }
        },

        /* Step 6 — Modal closed without paying */
        modal: {
          ondismiss: () => {
            showToast("Payment was cancelled.", "info");
            setPaying(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        showToast(`Payment failed: ${response.error.description}`, "error");
        setPaying(false);
      });
      rzp.open();

    } catch (err) {
      showToast(err.response?.data?.message || "Failed to initiate payment. Try again.", "error");
      setPaying(false);
    }
  };

  return (
    <div className="page-wrapper checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1 className="checkout-header__title">Checkout</h1>
          <p className="checkout-header__sub">{cartCount} {cartCount === 1 ? "item" : "items"} in your order</p>
        </div>
        <Steps current={step} />
        <div className="checkout-layout">
          <div className="checkout-main">
            {step === 1 ? (
              <ShippingForm form={form} onChange={update} onNext={() => setStep(2)} onAutofill={(addr) => setForm(addr)} />
            ) : (
              <ReviewAndPay
                form={form}
                cartItems={cartItems}
                cartTotal={cartTotal}
                onBack={() => setStep(1)}
                onPay={handlePay}
                paying={paying}
              />
            )}
          </div>
          <OrderMini cartItems={cartItems} cartTotal={cartTotal} />
        </div>
      </div>
    </div>
  );
}
