import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useToastContext } from "../context/ToastContext";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import { uploadImage } from "../services/orderService";
import Spinner from "../components/ui/Spinner";
import "./AdminDashboard.css";

/* ─────────────────── Icons ─────────────────── */
const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);
const BoxIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const TagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);
const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const XCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);
const ImageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);
const SpinIcon = () => (
  <svg className="admin-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round"/>
  </svg>
);
const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/* ─────────────────── Constants ─────────────────── */
const EMPTY_FORM = { title: "", description: "", price: "", category: "", image: "", stock: "" };

/* ─────────────────── Sub-components ─────────────────── */

/* Stat Card */
function StatCard({ icon, label, value, sub, variant }) {
  return (
    <div className={`stat-card stat-card--${variant ?? "default"}`}>
      <div className="stat-card__icon">{icon}</div>
      <div>
        <p className="stat-card__value">{value}</p>
        <p className="stat-card__label">{label}</p>
        {sub && <p className="stat-card__sub">{sub}</p>}
      </div>
    </div>
  );
}

/* Sidebar */
function AdminSidebar({ section, onChange, onAdd }) {
  const nav = [
    { id: "overview",  icon: <GridIcon />, label: "Overview" },
    { id: "products",  icon: <BoxIcon />,  label: "Products" },
  ];
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <span className="admin-sidebar__dot" />
        Admin Panel
      </div>
      <nav className="admin-sidebar__nav">
        {nav.map((item) => (
          <button
            key={item.id}
            className={`admin-nav-item${section === item.id || (section === "form" && item.id === "products") ? " admin-nav-item--active" : ""}`}
            onClick={() => onChange(item.id)}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>
      <div className="admin-sidebar__footer">
        <button className="btn btn-primary w-full admin-add-btn" onClick={onAdd}>
          <PlusIcon /> Add Product
        </button>
      </div>
    </aside>
  );
}

/* ─── Overview Section ─── */
function OverviewSection({ products }) {
  const stats = useMemo(() => ({
    total:      products.length,
    inStock:    products.filter((p) => p.stock > 0).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
    categories: new Set(products.map((p) => p.category)).size,
  }), [products]);

  const lowStock   = products.filter((p) => p.stock > 0 && p.stock <= 5)
                             .sort((a, b) => a.stock - b.stock);

  const catCounts  = useMemo(() => {
    const map = {};
    products.forEach((p) => { map[p.category] = (map[p.category] ?? 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [products]);

  return (
    <div className="admin-section">
      <h2 className="admin-section__title">Overview</h2>

      {/* Stats */}
      <div className="stat-cards-grid">
        <StatCard icon={<BoxIcon />}         label="Total Products"  value={stats.total}      variant="accent" />
        <StatCard icon={<CheckCircleIcon />} label="In Stock"        value={stats.inStock}    variant="success" />
        <StatCard icon={<XCircleIcon />}     label="Out of Stock"    value={stats.outOfStock} variant="error" />
        <StatCard icon={<TagIcon />}         label="Categories"      value={stats.categories} variant="info" />
      </div>

      {/* Low stock alerts */}
      {lowStock.length > 0 && (
        <div className="admin-alert-block">
          <h3 className="admin-alert-block__title">
            <AlertIcon /> Low Stock Alerts ({lowStock.length})
          </h3>
          <div className="admin-alert-list">
            {lowStock.map((p) => (
              <div key={p._id} className="admin-alert-row">
                <div className="admin-alert-row__img-wrap">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="admin-alert-row__img" onError={(e) => e.target.style.display="none"} />
                  ) : <ImageIcon />}
                </div>
                <div className="admin-alert-row__info">
                  <p className="admin-alert-row__title">{p.title}</p>
                  <p className="admin-alert-row__cat">{p.category}</p>
                </div>
                <span className={`admin-stock-badge${p.stock === 1 ? " admin-stock-badge--critical" : ""}`}>
                  {p.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category breakdown */}
      {catCounts.length > 0 && (
        <div className="admin-cat-block">
          <h3 className="admin-cat-block__title">Category Breakdown</h3>
          <div className="admin-cat-list">
            {catCounts.map(([cat, count]) => {
              const pct = Math.round((count / stats.total) * 100);
              return (
                <div key={cat} className="admin-cat-row">
                  <span className="admin-cat-row__name">{cat}</span>
                  <div className="admin-cat-row__bar-wrap">
                    <div className="admin-cat-row__bar" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="admin-cat-row__count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Products Section ─── */
function ProductsSection({ products, onEdit, onDelete, deletingId, setDeletingId, onAdd }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [products, search]);

  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <h2 className="admin-section__title">Products ({products.length})</h2>
        <button className="btn btn-primary btn-sm" onClick={onAdd}>
          <PlusIcon /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="admin-search">
        <span className="admin-search__icon"><SearchIcon /></span>
        <input
          type="text"
          placeholder="Search by name or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search__input"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="admin-empty">
          <BoxIcon />
          <p>{search ? `No products matching "${search}"` : "No products yet."}</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} className="admin-table__row">
                  {/* Product */}
                  <td className="admin-table__product-cell">
                    <div className="admin-table__product">
                      <div className="admin-table__img-wrap">
                        {p.image ? (
                          <img src={p.image} alt={p.title} className="admin-table__img" onError={(e) => e.target.style.display="none"} />
                        ) : (
                          <div className="admin-table__img-ph"><ImageIcon /></div>
                        )}
                      </div>
                      <span className="admin-table__title">{p.title}</span>
                    </div>
                  </td>
                  {/* Category */}
                  <td>
                    <span className="badge badge-accent" style={{ textTransform: "capitalize" }}>{p.category}</span>
                  </td>
                  {/* Price */}
                  <td className="admin-table__price">₹{p.price.toLocaleString("en-IN")}</td>
                  {/* Stock */}
                  <td>
                    <span className={`admin-stock-pill${p.stock === 0 ? " admin-stock-pill--out" : p.stock <= 5 ? " admin-stock-pill--low" : " admin-stock-pill--in"}`}>
                      {p.stock === 0 ? "Out of Stock" : p.stock <= 5 ? `Low: ${p.stock}` : p.stock}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="admin-table__actions">
                    {deletingId === p._id ? (
                      <div className="admin-confirm-delete">
                        <span>Delete?</span>
                        <button className="admin-confirm-btn admin-confirm-btn--yes" onClick={() => onDelete(p._id)}>Yes</button>
                        <button className="admin-confirm-btn admin-confirm-btn--no"  onClick={() => setDeletingId(null)}>No</button>
                      </div>
                    ) : (
                      <>
                        <button className="admin-action-btn admin-action-btn--edit"  onClick={() => onEdit(p)} aria-label="Edit">
                          <EditIcon />
                        </button>
                        <button className="admin-action-btn admin-action-btn--del" onClick={() => setDeletingId(p._id)} aria-label="Delete">
                          <TrashIcon />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Product Form ─── */
function ProductForm({ initialData, isEdit, onSave, onCancel, saving }) {
  const [form,           setForm]           = useState(initialData ?? EMPTY_FORM);
  const [imgLoad,        setImgLoad]        = useState(false);
  const [imgErr,         setImgErr]         = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { showToast } = useToastContext();

  useEffect(() => {
    setForm(initialData ?? EMPTY_FORM);
    setImgErr(false);
  }, [initialData]);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleImageChange = (e) => {
    setImgErr(false);
    setImgLoad(true);
    setForm((prev) => ({ ...prev, image: e.target.value }));
  };

  /* ── Cloudinary file upload ── */
  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file.", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image must be smaller than 5MB.", "error");
      return;
    }
    setImageUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const { data } = await uploadImage(fd);
      setForm((prev) => ({ ...prev, image: data.imageUrl }));
      setImgErr(false);
      setImgLoad(false);
      showToast("Image uploaded to Cloudinary! ✓", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Upload failed. Try a URL instead.", "error");
    } finally {
      setImageUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const isValid =
    form.title.trim() &&
    form.description.trim() &&
    Number(form.price) > 0 &&
    form.category.trim() &&
    Number(form.stock) >= 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    onSave({
      title:       form.title.trim(),
      description: form.description.trim(),
      price:       parseFloat(form.price),
      category:    form.category.trim().toLowerCase(),
      image:       form.image.trim(),
      stock:       parseInt(form.stock, 10),
    });
  };

  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <h2 className="admin-section__title">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h2>
        <button className="btn btn-ghost btn-sm" onClick={onCancel}>
          <ArrowLeftIcon /> Cancel
        </button>
      </div>

      <form className="product-form" onSubmit={handleSubmit} noValidate>
        <div className="product-form__grid">

          {/* ── Left column ── */}
          <div className="product-form__col">
            {/* Title */}
            <div className="form-group">
              <label htmlFor="pf-title" className="form-label">
                Product Title <span className="form-required">*</span>
              </label>
              <input id="pf-title" type="text" className="form-input" placeholder="e.g. Sony WH-1000XM5 Headphones" value={form.title} onChange={update("title")} required />
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="pf-desc" className="form-label">
                Description <span className="form-required">*</span>
              </label>
              <textarea id="pf-desc" className="form-input form-textarea" placeholder="Describe the product…" value={form.description} onChange={update("description")} rows={4} required />
            </div>

            {/* Price + Category row */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pf-price" className="form-label">
                  Price (₹) <span className="form-required">*</span>
                </label>
                <input id="pf-price" type="number" className="form-input" placeholder="999" value={form.price} onChange={update("price")} min={0} step="0.01" required />
              </div>
              <div className="form-group">
                <label htmlFor="pf-category" className="form-label">
                  Category <span className="form-required">*</span>
                </label>
                <input id="pf-category" type="text" className="form-input" placeholder="electronics" value={form.category} onChange={update("category")} required />
              </div>
            </div>

            {/* Stock */}
            <div className="form-group">
              <label htmlFor="pf-stock" className="form-label">
                Stock Quantity <span className="form-required">*</span>
              </label>
              <input id="pf-stock" type="number" className="form-input" placeholder="100" value={form.stock} onChange={update("stock")} min={0} required />
            </div>
          </div>

          {/* ── Right column: image ── */}
          <div className="product-form__col">

            {/* Upload zone */}
            <div className="form-group">
              <label className="form-label">Product Image</label>

              {/* Drop / click zone */}
              <div
                className={`image-upload-zone${imageUploading ? " image-upload-zone--loading" : ""}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => !imageUploading && fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                aria-label="Upload image"
              >
                {imageUploading ? (
                  <><Spinner size="sm" /><span>Uploading to Cloudinary…</span></>
                ) : (
                  <><UploadIcon /><span>Drop image or <strong>click to upload</strong></span><span className="image-upload-zone__hint">JPG, PNG, WebP — max 5MB</span></>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="image-upload-hidden"
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
              />
            </div>

            {/* URL fallback */}
            <div className="form-group">
              <label htmlFor="pf-image" className="form-label">Or paste an Image URL</label>
              <div className="image-url-wrap">
                <input id="pf-image" type="url" className="form-input" placeholder="https://example.com/product.jpg"
                  value={form.image} onChange={handleImageChange} />
                {form.image && (
                  <button type="button" className="image-url-clear" onClick={() => { setForm((p) => ({ ...p, image: "" })); setImgErr(false); }} aria-label="Clear image">
                    <XIcon />
                  </button>
                )}
              </div>
              <span className="form-hint">Cloudinary URL or any public image URL</span>
            </div>

            {/* Preview */}
            <div className="product-form__preview">
              {form.image && !imgErr ? (
                <>
                  {imgLoad && <div className="product-form__preview-loading"><Spinner size="sm" /></div>}
                  <img
                    src={form.image}
                    alt="Preview"
                    className="product-form__preview-img"
                    onLoad={() => setImgLoad(false)}
                    onError={() => { setImgErr(true); setImgLoad(false); }}
                    style={{ display: imgLoad ? "none" : "block" }}
                  />
                  {!imgLoad && <span className="image-preview-label">✓ Cloudinary / URL preview</span>}
                </>
              ) : (
                <div className="product-form__preview-placeholder">
                  <ImageIcon />
                  <span>{imgErr ? "Invalid image URL" : "Image preview"}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="product-form__actions">
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={!isValid || saving}
          >
            {saving ? <><SpinIcon /> Saving…</> : (isEdit ? "Update Product" : "Create Product")}
          </button>
          <button type="button" className="btn btn-secondary btn-lg" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* ─────────────────── Main Dashboard ─────────────────── */
export default function AdminDashboard() {
  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [section,     setSection]     = useState("overview");   // "overview" | "products" | "form"
  const [editingProduct, setEditingProduct] = useState(null);   // null = create, object = edit
  const [deletingId,  setDeletingId]  = useState(null);
  const [saving,      setSaving]      = useState(false);

  const { showToast } = useToastContext();

  /* ── Fetch all products ── */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getProducts();
      setProducts(data);
    } catch {
      showToast("Failed to load products.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  /* ── Navigation helpers ── */
  const goAdd  = () => { setEditingProduct(null); setSection("form"); };
  const goEdit = (product) => { setEditingProduct(product); setSection("form"); };
  const goBack = (dest = "products") => { setEditingProduct(null); setSection(dest); };

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (editingProduct) {
        const { data } = await updateProduct(editingProduct._id, formData);
        setProducts((prev) =>
          prev.map((p) => (p._id === editingProduct._id ? data.product ?? { ...p, ...formData } : p))
        );
        showToast("Product updated!", "success");
      } else {
        const { data } = await createProduct(formData);
        setProducts((prev) => [data.product ?? { _id: Date.now(), ...formData }, ...prev]);
        showToast("Product created!", "success");
      }
      await fetchProducts(); // resync to get accurate server data
      goBack("products");
    } catch (err) {
      showToast(err.response?.data?.message || "Save failed.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      showToast("Product deleted.", "info");
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page-wrapper admin-page">
      <div className="admin-layout">

        {/* ── Sidebar ── */}
        <AdminSidebar
          section={section}
          onChange={(s) => { setSection(s); setDeletingId(null); }}
          onAdd={goAdd}
        />

        {/* ── Main content ── */}
        <main className="admin-main">

          {loading ? (
            <div className="admin-loading"><Spinner size="lg" /></div>
          ) : section === "overview" ? (
            <OverviewSection products={products} />
          ) : section === "form" ? (
            <ProductForm
              initialData={editingProduct}
              isEdit={!!editingProduct}
              onSave={handleSave}
              onCancel={() => goBack("products")}
              saving={saving}
            />
          ) : (
            <ProductsSection
              products={products}
              onEdit={goEdit}
              onDelete={handleDelete}
              deletingId={deletingId}
              setDeletingId={setDeletingId}
              onAdd={goAdd}
            />
          )}

          {/* Mobile bottom nav */}
          <nav className="admin-mobile-nav">
            <button
              className={`admin-mobile-nav__item${section === "overview" ? " active" : ""}`}
              onClick={() => setSection("overview")}
            ><GridIcon /> Overview</button>
            <button
              className={`admin-mobile-nav__item${section === "products" || section === "form" ? " active" : ""}`}
              onClick={() => setSection("products")}
            ><BoxIcon /> Products</button>
            <button
              className="admin-mobile-nav__item admin-mobile-nav__item--add"
              onClick={goAdd}
            ><PlusIcon /> Add</button>
          </nav>
        </main>
      </div>
    </div>
  );
}
