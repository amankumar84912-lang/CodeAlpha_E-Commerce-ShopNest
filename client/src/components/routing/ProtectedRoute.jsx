import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Spinner from "../ui/Spinner";

/**
 * ProtectedRoute — guards routes that require authentication.
 * Stores the intended path in location state so Login can redirect back after sign-in.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <Spinner fullPage />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
