import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Spinner from "../ui/Spinner";

/**
 * GuestRoute — prevents authenticated users from accessing /login and /register.
 * Redirects them to the page they came from, or the homepage.
 */
export default function GuestRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <Spinner fullPage />;

  if (user) {
    const destination = location.state?.from?.pathname || "/";
    return <Navigate to={destination} replace />;
  }

  return children;
}
