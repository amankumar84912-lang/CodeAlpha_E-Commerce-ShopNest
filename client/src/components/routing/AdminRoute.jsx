import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useToastContext } from "../../context/ToastContext";
import Spinner from "../ui/Spinner";

/**
 * AdminRoute — guards routes that require the admin role.
 * Non-admin authenticated users are redirected to the homepage with a toast.
 */
export default function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useContext(AuthContext);
  const { showToast } = useToastContext();

  if (loading) return <Spinner fullPage />;

  if (!user) return <Navigate to="/login" replace />;

  if (!isAdmin) {
    showToast("Admin access only.", "error");
    return <Navigate to="/" replace />;
  }

  return children;
}
