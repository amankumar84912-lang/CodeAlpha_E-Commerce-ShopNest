import "./Spinner.css";

/**
 * Spinner — displays a loading indicator.
 *
 * Props:
 *  size    — "sm" | "md" (default) | "lg"
 *  fullPage — if true, centers in the full viewport
 */
export default function Spinner({ size = "md", fullPage = false }) {
  if (fullPage) {
    return (
      <div className="spinner-page">
        <div className={`spinner spinner--${size}`} role="status" aria-label="Loading">
          <span className="sr-only">Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`spinner spinner--${size}`} role="status" aria-label="Loading">
      <span className="sr-only">Loading…</span>
    </div>
  );
}
