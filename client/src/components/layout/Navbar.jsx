import { useState, useEffect, useRef, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { useToastContext } from "../../context/ToastContext";
import "./Navbar.css";

/* ── SVG Icons ── */
const BagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const CartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6" />
  </svg>
);

const OrdersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="2" />
    <path d="M9 12h6M9 16h4" />
  </svg>
);

const AdminIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate    = useNavigate();

  const { user, isAdmin, logout }  = useContext(AuthContext);
  const { cartCount }              = useContext(CartContext);
  const { showToast }              = useToastContext();

  /* ── Scroll listener ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  /* ── Prevent body scroll when mobile menu is open ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully.", "success");
    navigate("/login");
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  const navLinkClass = ({ isActive }) =>
    isActive ? "nav__link nav__link--active" : "nav__link";

  return (
    <>
      <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`} role="navigation">
        <div className="navbar__inner">

          {/* ── Logo ── */}
          <Link to="/" className="navbar__logo" onClick={closeMenu}>
            <span className="navbar__logo-icon"><BagIcon /></span>
            <span className="navbar__logo-text">Shop<span className="navbar__logo-accent">Nest</span></span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <ul className="navbar__nav" role="list">
            <li><NavLink to="/" end className={navLinkClass}>Home</NavLink></li>
            <li><NavLink to="/products" className={navLinkClass}>Products</NavLink></li>
          </ul>

          {/* ── Desktop Right Section ── */}
          <div className="navbar__actions">
            {user ? (
              <>
                {/* Cart */}
                <Link to="/cart" className="navbar__cart-btn" aria-label="Shopping cart">
                  <CartIcon />
                  {cartCount > 0 && (
                    <span className="navbar__cart-badge">{cartCount > 99 ? "99+" : cartCount}</span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="navbar__user" ref={dropdownRef}>
                  <button
                    className="navbar__avatar-btn"
                    onClick={() => setDropdownOpen((v) => !v)}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="menu"
                  >
                    <span className="navbar__avatar-letter">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                    <span className="navbar__avatar-chevron">
                      <ChevronDown />
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div className="navbar__dropdown" role="menu">
                      {/* Header */}
                      <div className="dropdown__header">
                        <p className="dropdown__name">{user.name}</p>
                        <p className="dropdown__email">{user.email}</p>
                      </div>
                      <div className="dropdown__divider" />

                      {/* Items */}
                      <Link
                        to="/profile"
                        className="dropdown__item"
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <ProfileIcon /> My Profile
                      </Link>

                      <Link
                        to="/orders"
                        className="dropdown__item"
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <OrdersIcon /> My Orders
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="dropdown__item dropdown__item--admin"
                          role="menuitem"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <AdminIcon /> Admin Dashboard
                        </Link>
                      )}

                      <div className="dropdown__divider" />
                      <button
                        className="dropdown__item dropdown__item--logout"
                        role="menuitem"
                        onClick={handleLogout}
                      >
                        <LogoutIcon /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="navbar__guest">
                <Link to="/login"    className="btn btn-ghost">Sign In</Link>
                <Link to="/register" className="btn btn-primary">Get Started</Link>
              </div>
            )}
          </div>

          {/* ── Hamburger ── */}
          <button
            className={`navbar__hamburger${menuOpen ? " navbar__hamburger--open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── Mobile Overlay ── */}
      {menuOpen && <div className="navbar__overlay" onClick={closeMenu} />}

      {/* ── Mobile Drawer ── */}
      <div className={`navbar__drawer${menuOpen ? " navbar__drawer--open" : ""}`} role="dialog" aria-label="Navigation menu">
        <div className="drawer__header">
          <span className="navbar__logo">
            <span className="navbar__logo-icon"><BagIcon /></span>
            <span className="navbar__logo-text">Shop<span className="navbar__logo-accent">Nest</span></span>
          </span>
        </div>

        {user && (
          <div className="drawer__user">
            <div className="drawer__avatar">{user.name?.charAt(0).toUpperCase()}</div>
            <div>
              <p className="drawer__user-name">{user.name}</p>
              <p className="drawer__user-email">{user.email}</p>
            </div>
          </div>
        )}

        <nav className="drawer__nav">
          <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>Home</NavLink>
          <NavLink to="/products" className={navLinkClass} onClick={closeMenu}>Products</NavLink>
          {user && (
            <>
              <NavLink to="/cart" className={navLinkClass} onClick={closeMenu}>
                Cart {cartCount > 0 && <span className="drawer__badge">{cartCount}</span>}
              </NavLink>
              <NavLink to="/profile" className={navLinkClass} onClick={closeMenu}>My Profile</NavLink>
              <NavLink to="/orders"  className={navLinkClass} onClick={closeMenu}>My Orders</NavLink>
              {isAdmin && (
                <NavLink to="/admin" className={navLinkClass} onClick={closeMenu}>Admin Dashboard</NavLink>
              )}
            </>
          )}
        </nav>

        <div className="drawer__footer">
          {user ? (
            <button className="btn btn-outline w-full" onClick={handleLogout}>
              <LogoutIcon /> Logout
            </button>
          ) : (
            <>
              <Link to="/login"    className="btn btn-ghost w-full" onClick={closeMenu}>Sign In</Link>
              <Link to="/register" className="btn btn-primary w-full" onClick={closeMenu}>Get Started</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
