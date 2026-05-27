import { useState, useEffect, useMemo, useRef } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "../components/product/ProductCard";
import SkeletonCard from "../components/ui/SkeletonCard";
import { useDebounce } from "../hooks/useDebounce";
import "./ProductsPage.css";

/* ── Icons ── */
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SortIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="9" y1="18" x2="15" y2="18" />
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
  </svg>
);

const BoxIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const SORT_OPTIONS = [
  { value: "default",    label: "Featured" },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name-asc",   label: "Name: A → Z" },
  { value: "stock-desc", label: "Most In Stock" },
];

function EmptyState({ search, category, onClear }) {
  return (
    <div className="products-empty">
      <div className="products-empty__icon"><BoxIcon /></div>
      <h3 className="products-empty__title">No products found</h3>
      <p className="products-empty__text">
        {search
          ? `No results for "${search}"${category !== "All" ? ` in ${category}` : ""}.`
          : `No products in "${category}" yet.`}
      </p>
      <button className="btn btn-outline" onClick={onClear}>Clear filters</button>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="products-error">
      <p className="products-error__text">{message}</p>
      <button className="btn btn-primary" onClick={onRetry}>
        <RefreshIcon /> Try Again
      </button>
    </div>
  );
}

export default function ProductsPage() {
  const [products,        setProducts]        = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);
  const [search,          setSearch]          = useState("");
  const [activeCategory,  setActiveCategory]  = useState("All");
  const [sort,            setSort]            = useState("default");

  const searchRef      = useRef(null);
  const categoryBarRef = useRef(null);

  /* ── Debounce search ── 300ms delay prevents filtering on every keystroke */
  const debouncedSearch = useDebounce(search, 300);

  /* ── Fetch products ── */
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  /* ── Derived categories ── */
  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))].sort();
    return ["All", ...cats];
  }, [products]);

  /* ── Filtered + sorted products ── uses debouncedSearch, not raw search */
  const filtered = useMemo(() => {
    let result = [...products];

    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "price-asc":  result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "name-asc":   result.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "stock-desc": result.sort((a, b) => b.stock - a.stock); break;
      default: break;
    }

    return result;
  }, [products, debouncedSearch, activeCategory, sort]);

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("All");
    setSort("default");
    searchRef.current?.focus();
  };

  /* ── Horizontal scroll for category pills ── */
  const scrollCategory = (dir) => {
    if (categoryBarRef.current) {
      categoryBarRef.current.scrollBy({ left: dir * 200, behavior: "smooth" });
    }
  };

  return (
    <div className="page-wrapper products-page">

      {/* ── Page Header ── */}
      <div className="products-header">
        <div className="container">
          <h1 className="products-header__title">Our Products</h1>
          <p className="products-header__sub">
            Discover our curated collection of premium products
          </p>
        </div>
      </div>

      <div className="container products-body">

        {/* ── Toolbar: Search + Sort ── */}
        <div className="products-toolbar">
          <div className="products-search" role="search">
            <span className="products-search__icon"><SearchIcon /></span>
            <input
              ref={searchRef}
              id="product-search"
              type="text"
              placeholder="Search products, categories…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search products"
            />
            {search && (
              <button
                className="products-search__clear"
                onClick={() => { setSearch(""); searchRef.current?.focus(); }}
                aria-label="Clear search"
              >
                <CloseIcon />
              </button>
            )}
          </div>

          <div className="products-sort">
            <span className="products-sort__icon"><SortIcon /></span>
            <select
              id="product-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Category Filter Pills ── */}
        {!loading && !error && categories.length > 2 && (
          <div className="category-bar">
            <button className="category-bar__arrow" onClick={() => scrollCategory(-1)} aria-label="Scroll left">‹</button>
            <div className="category-pills" ref={categoryBarRef} role="tablist">
              {categories.map((cat) => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={activeCategory === cat}
                  className={`category-pill${activeCategory === cat ? " category-pill--active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button className="category-bar__arrow" onClick={() => scrollCategory(1)} aria-label="Scroll right">›</button>
          </div>
        )}

        {/* ── Results count ── */}
        {!loading && !error && (
          <div className="products-count-bar">
            <p className="products-count">
              {loading ? "Loading…" : `${filtered.length} ${filtered.length === 1 ? "product" : "products"}`}
              {(search || activeCategory !== "All") && (
                <span className="products-count__filter">
                  {" "}— filtered
                </span>
              )}
            </p>
            {(search || activeCategory !== "All" || sort !== "default") && (
              <button className="products-count__clear btn btn-ghost btn-sm" onClick={clearFilters}>
                Clear all
              </button>
            )}
          </div>
        )}

        {/* ── Content States ── */}
        {loading ? (
          <div className="products-grid">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchProducts} />
        ) : filtered.length === 0 ? (
          <EmptyState search={search} category={activeCategory} onClear={clearFilters} />
        ) : (
          <div className="products-grid">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
