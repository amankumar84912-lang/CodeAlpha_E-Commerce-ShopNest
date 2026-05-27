import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useToastContext } from "../context/ToastContext";
import Spinner from "../components/ui/Spinner";
import "./Login.css";
import "./Register.css";

/* ── Icons ── */
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const BagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const PERKS = [
  "Free shipping on orders over ₹500",
  "30-day hassle-free returns",
  "Exclusive member discounts",
];

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading]     = useState(false);

  const { register }   = useContext(AuthContext);
  const { showToast }  = useToastContext();
  const navigate       = useNavigate();

  const passwordMatch = form.confirm === "" || form.password === form.confirm;
  const isValid = form.name.trim() && form.email.trim() && form.password.length >= 6 && form.password === form.confirm;

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    try {
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      showToast(`Welcome to ShopNest, ${form.name.trim()}!`, "success");
      navigate("/", { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page register-page">
      {/* Background blobs */}
      <div className="auth-blob auth-blob--1" />
      <div className="auth-blob auth-blob--2" />

      <div className="register-layout">
        {/* ── Left Panel (desktop only) ── */}
        <div className="register-hero">
          <div className="register-hero__content">
            <div className="auth-brand">
              <div className="auth-brand__icon"><BagIcon /></div>
              <span className="auth-brand__name">ShopNest</span>
            </div>
            <h2 className="register-hero__title">
              The future of shopping<br />
              <span className="gradient-text">starts here.</span>
            </h2>
            <p className="register-hero__subtitle">
              Join thousands of shoppers discovering premium products every day.
            </p>
            <ul className="register-perks">
              {PERKS.map((perk) => (
                <li key={perk} className="register-perk">
                  <span className="register-perk__icon"><CheckIcon /></span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Right Panel (form) ── */}
        <div className="auth-card register-card">
          <div className="auth-heading">
            <h2>Create your account</h2>
            <p>Get started — it takes less than a minute</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="form-group">
              <label htmlFor="reg-name" className="form-label">Full name</label>
              <div className="input-wrapper">
                <span className="input-icon"><UserIcon /></span>
                <input
                  id="reg-name"
                  type="text"
                  className="form-input"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={update("name")}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="reg-email" className="form-label">Email address</label>
              <div className="input-wrapper">
                <span className="input-icon"><EmailIcon /></span>
                <input
                  id="reg-email"
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={update("email")}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="reg-password" className="form-label">Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><LockIcon /></span>
                <input
                  id="reg-password"
                  type={showPass ? "text" : "password"}
                  className="form-input"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={update("password")}
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
                <button type="button" className="input-toggle" onClick={() => setShowPass((v) => !v)} aria-label="Toggle password">
                  {showPass ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Confirm */}
            <div className="form-group">
              <label htmlFor="reg-confirm" className="form-label">Confirm password</label>
              <div className="input-wrapper">
                <span className="input-icon"><LockIcon /></span>
                <input
                  id="reg-confirm"
                  type={showConfirm ? "text" : "password"}
                  className={`form-input${!passwordMatch ? " input-error" : ""}`}
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={update("confirm")}
                  autoComplete="new-password"
                  required
                />
                <button type="button" className="input-toggle" onClick={() => setShowConfirm((v) => !v)} aria-label="Toggle confirm password">
                  {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {!passwordMatch && (
                <span className="form-error">Passwords do not match</span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary btn-lg w-full auth-submit"
              disabled={loading || !isValid}
            >
              {loading ? <Spinner size="sm" /> : "Create Account"}
            </button>
          </form>

          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          <Link to="/login" className="btn btn-secondary btn-lg w-full">
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
}
