import { Link } from "react-router-dom";
import "./StubPage.css";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="page-wrapper not-found">
      <div className="container not-found__inner">
        <div className="not-found__number" aria-hidden="true">404</div>
        <h1 className="not-found__title">Page not found</h1>
        <p className="not-found__subtitle">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="not-found__actions">
          <Link to="/"        className="btn btn-primary btn-lg">Go Home</Link>
          <Link to="/products" className="btn btn-secondary btn-lg">Browse Products</Link>
        </div>
      </div>
    </div>
  );
}
