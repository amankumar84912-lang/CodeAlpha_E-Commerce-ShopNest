import { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const FooterLinks = {
  Shop: [
    { label: "All Products",  to: "/products" },
    { label: "Electronics",   to: "/products?category=electronics" },
    { label: "Smartphones",   to: "/products?category=smartphones" },
    { label: "Laptops",       to: "/products?category=laptops" },
    { label: "Fashion",       to: "/products?category=fashion" },
    { label: "Watches",       to: "/products?category=watches" },
  ],
  Account: [
    { label: "My Profile",  to: "/profile" },
    { label: "My Cart",     to: "/cart" },
    { label: "My Orders",   to: "/orders" },
    { label: "Sign In",     to: "/login" },
    { label: "Register",    to: "/register" },
  ],
  Company: [
    { label: "About Us",      to: "/" },
    { label: "Careers",       to: "/" },
    { label: "Press",         to: "/" },
    { label: "Privacy Policy",to: "/" },
    { label: "Terms of Use",  to: "/" },
  ],
};

const SocialLinks = [
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const [email,      setEmail]      = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="site-footer">
      <div className="container footer-inner">

        {/* ── Brand column ── */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            ShopNest<span className="footer-logo__dot">.</span>
          </Link>
          <p className="footer-brand__tagline">
            Your one-stop destination for premium products across every category.
            Quality guaranteed. Fast delivery. Hassle-free returns.
          </p>

          {/* Social icons */}
          <div className="footer-socials">
            {SocialLinks.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label={label}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── Link columns ── */}
        {Object.entries(FooterLinks).map(([heading, links]) => (
          <div key={heading} className="footer-col">
            <h4 className="footer-col__heading">{heading}</h4>
            <ul className="footer-col__list">
              {links.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="footer-col__link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* ── Newsletter ── */}
        <div className="footer-newsletter">
          <h4 className="footer-col__heading">Stay in the loop</h4>
          <p className="footer-newsletter__text">
            Get early access to new arrivals, exclusive deals, and weekly inspiration — right in your inbox.
          </p>
          {subscribed ? (
            <div className="footer-newsletter__success">
              🎉 You're subscribed! Welcome aboard.
            </div>
          ) : (
            <form className="footer-newsletter__form" onSubmit={handleSubscribe}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="footer-newsletter__input"
                required
              />
              <button type="submit" className="btn btn-primary footer-newsletter__btn">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <div className="container footer-bottom__inner">
          <p className="footer-bottom__copy">
            © {new Date().getFullYear()} ShopNest. All rights reserved.
          </p>
          <div className="footer-bottom__badges">
            {["Visa", "Mastercard", "UPI", "Razorpay"].map((b) => (
              <span key={b} className="payment-badge">{b}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
