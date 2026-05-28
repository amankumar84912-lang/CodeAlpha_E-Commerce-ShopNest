import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useToastContext } from "../context/ToastContext";
import { getMyOrders } from "../services/orderService";
import "./ProfilePage.css";

/* ── Icons ── */
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const PackageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const CreditCardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);
const EyeIcon = ({ off }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    {off ? (
      <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
    ) : (
      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
    )}
  </svg>
);
const SpinIcon = () => (
  <svg className="profile-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round"/>
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

/* ── Avatar from initials with deterministic gradient ── */
function Avatar({ name, size = "xl" }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";
  const hash = [...(name ?? "")].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const gradients = [
    "linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)",
    "linear-gradient(135deg,#3b82f6 0%,#6366f1 100%)",
    "linear-gradient(135deg,#ec4899 0%,#8b5cf6 100%)",
    "linear-gradient(135deg,#10b981 0%,#3b82f6 100%)",
    "linear-gradient(135deg,#f59e0b 0%,#ef4444 100%)",
  ];
  return (
    <div
      className={`profile-avatar profile-avatar--${size}`}
      style={{ background: gradients[hash % gradients.length] }}
    >
      {initials}
    </div>
  );
}

/* ── Password field with show/hide toggle ── */
function PasswordInput({ id, label, value, onChange, placeholder, hint }) {
  const [show, setShow] = useState(false);
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">{label}</label>
      <div className="password-wrap">
        <input
          id={id}
          type={show ? "text" : "password"}
          className="form-input password-wrap__input"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="new-password"
        />
        <button
          type="button"
          className="password-wrap__toggle"
          onClick={() => setShow((v) => !v)}
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
        >
          <EyeIcon off={show} />
        </button>
      </div>
      {hint && <span className="form-hint">{hint}</span>}
    </div>
  );
}

/* ── Stat chip ── */
function StatChip({ icon, label, value }) {
  return (
    <div className="profile-stat">
      <div className="profile-stat__icon">{icon}</div>
      <div>
        <p className="profile-stat__value">{value}</p>
        <p className="profile-stat__label">{label}</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════ */
export default function ProfilePage() {
  const { user, logout, updateProfile } = useContext(AuthContext);
  const { showToast }                   = useToastContext();

  const [orders,  setOrders]  = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  /* ── Edit states ── */
  const [editingInfo,     setEditingInfo]     = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [saving,          setSaving]          = useState(false);

  /* ── Info form ── */
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");

  /* ── Password form ── */
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* ── Saved Addresses states ── */
  const [addresses, setAddresses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("shopnest-addresses") || "[]");
    } catch {
      return [];
    }
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    label: "Home",
    address: "",
    city: "",
    postalCode: "",
    country: "India",
  });

  /* Init form from user */
  useEffect(() => {
    if (user) {
      setName(user.name  ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  /* Fetch orders for stats */
  useEffect(() => {
    getMyOrders()
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
  }, []);

  const totalSpend = orders.reduce((s, o) => s + (o.totalPrice ?? 0), 0);
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "Recently";

  /* ── Cancel info edit ── */
  const cancelInfo = () => {
    setName(user?.name  ?? "");
    setEmail(user?.email ?? "");
    setEditingInfo(false);
  };

  /* ── Cancel password edit ── */
  const cancelPassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setEditingPassword(false);
  };

  /* ── Save info ── */
  const handleSaveInfo = async (e) => {
    e.preventDefault();
    if (!name.trim()) { showToast("Name cannot be empty.", "error"); return; }
    if (!email.trim()) { showToast("Email cannot be empty.", "error"); return; }
    setSaving(true);
    try {
      await updateProfile({ name: name.trim(), email: email.trim() });
      showToast("Profile updated! 🎉", "success");
      setEditingInfo(false);
    } catch (err) {
      showToast(err.response?.data?.message || "Update failed.", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ── Save password ── */
  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) { showToast("Enter your current password.", "error"); return; }
    if (newPassword.length < 6) { showToast("New password must be at least 6 characters.", "error"); return; }
    if (newPassword !== confirmPassword) { showToast("Passwords don't match.", "error"); return; }
    setSaving(true);
    try {
      await updateProfile({ currentPassword, newPassword });
      showToast("Password changed successfully! 🔒", "success");
      cancelPassword();
    } catch (err) {
      showToast(err.response?.data?.message || "Password change failed.", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ── Address CRUD Operations ── */
  const saveAddresses = (newAddrs) => {
    setAddresses(newAddrs);
    localStorage.setItem("shopnest-addresses", JSON.stringify(newAddrs));
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressForm.address.trim()) { showToast("Address is required", "error"); return; }
    if (!addressForm.city.trim()) { showToast("City is required", "error"); return; }
    if (!/^\d{6}$/.test(addressForm.postalCode.trim())) { showToast("Postal Code must be a 6-digit number", "error"); return; }

    if (editingAddressId) {
      const updated = addresses.map((addr) =>
        addr.id === editingAddressId ? { ...addressForm, id: editingAddressId } : addr
      );
      saveAddresses(updated);
      showToast("Address updated successfully!", "success");
    } else {
      const newAddr = { ...addressForm, id: Date.now().toString() };
      saveAddresses([...addresses, newAddr]);
      showToast("Address saved successfully! 🏠", "success");
    }

    setAddressForm({ label: "Home", address: "", city: "", postalCode: "", country: "India" });
    setEditingAddressId(null);
    setShowAddressForm(false);
  };

  const handleDeleteAddress = (id) => {
    const updated = addresses.filter((addr) => addr.id !== id);
    saveAddresses(updated);
    showToast("Address deleted.", "info");
  };

  const handleStartEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      label: addr.label,
      address: addr.address,
      city: addr.city,
      postalCode: addr.postalCode,
      country: addr.country,
    });
    setShowAddressForm(true);
  };

  return (
    <div className="page-wrapper profile-page">
      <div className="container profile-container">

        {/* ══ Profile header card ══ */}
        <div className="profile-card">
          <div className="profile-card__cover" />
          <div className="profile-card__body">
            <Avatar name={user?.name} size="xl" />
            <div className="profile-card__info">
              <div className="profile-card__name-row">
                <h1 className="profile-card__name">{user?.name}</h1>
                <span className={`profile-role-badge${user?.role === "admin" ? " profile-role-badge--admin" : ""}`}>
                  {user?.role === "admin" && <ShieldIcon />}
                  {user?.role === "admin" ? "Admin" : "Customer"}
                </span>
              </div>
              <p className="profile-card__email"><MailIcon /> {user?.email}</p>
            </div>
            <div className="profile-card__actions">
              <Link to="/orders"   className="btn btn-primary">View Orders</Link>
              <button className="btn btn-secondary" onClick={logout}>Sign Out</button>
            </div>
          </div>

          {/* Stats */}
          <div className="profile-stats">
            <StatChip icon={<PackageIcon />}    label="Total Orders"  value={ordersLoading ? "—" : orders.length} />
            <StatChip icon={<CreditCardIcon />} label="Total Spent"   value={ordersLoading ? "—" : `₹${totalSpend.toLocaleString("en-IN")}`} />
            <StatChip icon={<CalendarIcon />}   label="Member Since"  value={memberSince} />
            <StatChip icon={<ShieldIcon />}     label="Account Type"  value={user?.role === "admin" ? "Administrator" : "Shopper"} />
          </div>
        </div>

        {/* ══ Edit cards ══ */}
        <div className="profile-grid">

          {/* ── Personal info ── */}
          <section className="profile-section">
            <div className="profile-section__head">
              <h2 className="profile-section__title">
                <UserIcon /> Personal Info
              </h2>
              {!editingInfo && (
                <button
                  className="btn btn-ghost btn-sm profile-edit-btn"
                  onClick={() => setEditingInfo(true)}
                >
                  <EditIcon /> Edit
                </button>
              )}
            </div>

            {editingInfo ? (
              <form className="profile-form" onSubmit={handleSaveInfo} noValidate>
                <div className="form-group">
                  <label htmlFor="prof-name" className="form-label">
                    Full Name <span className="form-required">*</span>
                  </label>
                  <input
                    id="prof-name"
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="prof-email" className="form-label">
                    Email Address <span className="form-required">*</span>
                  </label>
                  <input
                    id="prof-email"
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="profile-form__actions">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <><SpinIcon /> Saving…</> : <><CheckIcon /> Save Changes</>}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={cancelInfo} disabled={saving}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-fields">
                <div className="profile-field">
                  <span className="profile-field__label">Full Name</span>
                  <div className="profile-field__value">{user?.name}</div>
                </div>
                <div className="profile-field">
                  <span className="profile-field__label">Email Address</span>
                  <div className="profile-field__value">{user?.email}</div>
                </div>
                <div className="profile-field">
                  <span className="profile-field__label">Account Role</span>
                  <div className="profile-field__value" style={{ textTransform: "capitalize" }}>
                    {user?.role ?? "customer"}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* ── Change password ── */}
          <section className="profile-section">
            <div className="profile-section__head">
              <h2 className="profile-section__title">
                <LockIcon /> Change Password
              </h2>
              {!editingPassword && (
                <button
                  className="btn btn-ghost btn-sm profile-edit-btn"
                  onClick={() => setEditingPassword(true)}
                >
                  <EditIcon /> Change
                </button>
              )}
            </div>

            {editingPassword ? (
              <form className="profile-form" onSubmit={handleSavePassword} noValidate>
                <PasswordInput
                  id="prof-cur-pw"
                  label="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Your current password"
                />
                <PasswordInput
                  id="prof-new-pw"
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  hint="Must be at least 6 characters"
                />
                <PasswordInput
                  id="prof-conf-pw"
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                />

                {/* Password strength bar */}
                {newPassword && (
                  <div className="pw-strength">
                    <div className="pw-strength__bar">
                      {[1,2,3,4].map((lvl) => {
                        const score =
                          (newPassword.length >= 6  ? 1 : 0) +
                          (newPassword.length >= 10 ? 1 : 0) +
                          (/[A-Z]/.test(newPassword) ? 1 : 0) +
                          (/[^A-Za-z0-9]/.test(newPassword) ? 1 : 0);
                        return (
                          <div
                            key={lvl}
                            className={`pw-strength__seg${lvl <= score ? ` pw-strength__seg--${score >= 4 ? "strong" : score >= 3 ? "good" : score >= 2 ? "fair" : "weak"}` : ""}`}
                          />
                        );
                      })}
                    </div>
                    <span className="pw-strength__label">
                      {(() => {
                        const s = (newPassword.length >= 6 ? 1:0) + (newPassword.length >= 10 ? 1:0) + (/[A-Z]/.test(newPassword) ? 1:0) + (/[^A-Za-z0-9]/.test(newPassword) ? 1:0);
                        return ["","Weak","Fair","Good","Strong"][s] || "";
                      })()}
                    </span>
                  </div>
                )}

                <div className="profile-form__actions">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <><SpinIcon /> Saving…</> : <><LockIcon /> Update Password</>}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={cancelPassword} disabled={saving}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-fields">
                <div className="profile-field">
                  <span className="profile-field__label">Password</span>
                  <div className="profile-field__value profile-field__value--masked">
                    ●●●●●●●●●●●●
                  </div>
                </div>
                <p className="profile-section__note">
                  Use a strong password with uppercase letters, numbers, and symbols. We recommend changing it every 3 months.
                </p>
              </div>
            )}
          </section>

        </div>

        {/* ── Saved Addresses Section (Full-Width card) ── */}
        <section className="profile-section profile-addresses" style={{ marginTop: "var(--space-6)" }}>
          <div className="profile-section__head" style={{ marginBottom: "var(--space-4)" }}>
            <h2 className="profile-section__title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              Saved Addresses
            </h2>
            {!showAddressForm && (
              <button
                className="btn btn-ghost btn-sm profile-edit-btn"
                onClick={() => {
                  setEditingAddressId(null);
                  setAddressForm({ label: "Home", address: "", city: "", postalCode: "", country: "India" });
                  setShowAddressForm(true);
                }}
              >
                + Add Address
              </button>
            )}
          </div>

          {showAddressForm ? (
            <form className="profile-form" onSubmit={handleSaveAddress} noValidate style={{ maxWidth: "600px" }}>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="addr-label" className="form-label">Address Label</label>
                  <select
                    id="addr-label"
                    className="form-input"
                    style={{ width: "100%" }}
                    value={addressForm.label}
                    onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {addressForm.label === "Other" && (
                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="addr-custom-label" className="form-label">Custom Tag Name</label>
                    <input
                      id="addr-custom-label"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Vacation"
                      value={addressForm.customLabel || ""}
                      onChange={(e) => setAddressForm({ ...addressForm, customLabel: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="addr-street" className="form-label">Street Address *</label>
                <input
                  id="addr-street"
                  type="text"
                  className="form-input"
                  placeholder="123 Main St, Apartment 4B"
                  value={addressForm.address}
                  onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="addr-city" className="form-label">City *</label>
                  <input
                    id="addr-city"
                    type="text"
                    className="form-input"
                    placeholder="Mumbai"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="addr-zip" className="form-label">Pin Code *</label>
                  <input
                    id="addr-zip"
                    type="text"
                    className="form-input"
                    placeholder="400001"
                    maxLength={6}
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="addr-country" className="form-label">Country *</label>
                <select
                  id="addr-country"
                  className="form-input"
                  value={addressForm.country}
                  onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="UAE">UAE</option>
                  <option value="Singapore">Singapore</option>
                </select>
              </div>

              <div className="profile-form__actions">
                <button type="submit" className="btn btn-primary">
                  {editingAddressId ? "Update Address" : "Save Address"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddressForm(false);
                    setEditingAddressId(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : addresses.length === 0 ? (
            <div className="profile-addresses__empty" style={{ textAlign: "center", padding: "var(--space-6) 0", color: "var(--color-text-secondary)" }}>
              <p>You haven't saved any shipping addresses yet.</p>
              <button
                className="btn btn-outline btn-sm"
                style={{ marginTop: "var(--space-3)" }}
                onClick={() => setShowAddressForm(true)}
              >
                Add Your First Address
              </button>
            </div>
          ) : (
            <div className="profile-addresses__grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "var(--space-4)", marginTop: "var(--space-2)" }}>
              {addresses.map((addr) => (
                <div key={addr.id} className="address-card" style={{ position: "relative", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "var(--space-4)", background: "var(--color-surface)", display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
                    <span className="badge badge-accent" style={{ fontSize: "var(--text-xs)", textTransform: "uppercase" }}>
                      {addr.label === "Home" ? "🏠 Home" : addr.label === "Office" ? "💼 Office" : `📍 ${addr.customLabel || "Other"}`}
                    </span>
                    <div style={{ display: "flex", gap: "var(--space-2)" }}>
                      <button
                        title="Edit address"
                        style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-xs)", padding: "4px" }}
                        onClick={() => handleStartEditAddress(addr)}
                      >
                        ✏️
                      </button>
                      <button
                        title="Delete address"
                        style={{ color: "var(--color-error)", fontSize: "var(--text-xs)", padding: "4px" }}
                        onClick={() => handleDeleteAddress(addr.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-heading)", fontWeight: 500 }}>{addr.address}</p>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>{addr.city} — {addr.postalCode}</p>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{addr.country}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ══ Recent orders preview ══ */}
        {!ordersLoading && orders.length > 0 && (
          <section className="profile-section profile-recent">
            <div className="profile-recent__header">
              <h2 className="profile-section__title" style={{ marginBottom: 0 }}>Recent Orders</h2>
              <Link to="/orders" className="btn btn-ghost btn-sm">View All →</Link>
            </div>
            <div className="profile-orders-list">
              {orders.slice(0, 3).map((order) => {
                const shortId = order._id.slice(-8).toUpperCase();
                const date    = new Date(
                  order.createdAt ?? parseInt(order._id.substring(0, 8), 16) * 1000
                ).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                return (
                  <div key={order._id} className="profile-order-row">
                    <div className="profile-order-row__thumb-stack">
                      {(order.orderItems ?? []).slice(0, 3).map((item, i) => (
                        <div key={i} className="profile-order-row__thumb" style={{ zIndex: 3 - i }}>
                          {item.image && <img src={item.image} alt={item.title} onError={(e) => e.target.style.display="none"} />}
                        </div>
                      ))}
                    </div>
                    <div className="profile-order-row__info">
                      <p className="profile-order-row__id">#{shortId}</p>
                      <p className="profile-order-row__date">{date} · {order.orderItems?.length ?? 0} items</p>
                    </div>
                    <p className="profile-order-row__total">₹{order.totalPrice?.toLocaleString("en-IN")}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
