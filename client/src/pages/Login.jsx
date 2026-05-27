import { useState, useContext } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useToastContext } from "../context/ToastContext";
import API from "../services/api";
import Spinner from "../components/ui/Spinner";
import "./Login.css";

/* ── Icons ── */
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

const BagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

export default function Login() {
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [loading,     setLoading]     = useState(false);

  const { login }      = useContext(AuthContext);
  const { showToast }  = useToastContext();
  const navigate       = useNavigate();
  const location       = useLocation();
  const [searchParams] = useSearchParams();

  const sessionExpired = searchParams.get("session") === "expired";
  const redirectTo = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email: email.trim(), password });
      login(res.data.user, res.data.token);
      showToast(`Welcome back, ${res.data.user.name}!`, "success");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background blobs */}
      <div className="auth-blob auth-blob--1" />
      <div className="auth-blob auth-blob--2" />

      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-brand__icon">
            <BagIcon />
          </div>
          <h1 className="auth-brand__name">ShopNest</h1>
        </div>

        {/* Session expired banner */}
        {sessionExpired && (
          <div className="auth-session-banner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Your session has expired. Please sign in again.
          </div>
        )}

        {/* Heading */}
        <div className="auth-heading">
          <h2>Welcome back</h2>
          <p>Sign in to your account to continue</p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Email address</label>
            <div className="input-wrapper">
              <span className="input-icon"><EmailIcon /></span>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="login-password" className="form-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon"><LockIcon /></span>
              <input
                id="login-password"
                type={showPass ? "text" : "password"}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="input-toggle"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-lg w-full auth-submit"
            disabled={loading || !email || !password}
          >
            {loading ? <Spinner size="sm" /> : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>Don&apos;t have an account?</span>
        </div>

        <Link to="/register" className="btn btn-secondary btn-lg w-full">
          Create an account
        </Link>
      </div>
    </div>
  );
}