import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar  from "./components/layout/Navbar";
import Footer  from "./components/layout/Footer";
import PageLoader from "./components/ui/PageLoader";
import RenderWakeup from "./components/ui/RenderWakeup";

import ProtectedRoute from "./components/routing/ProtectedRoute";
import AdminRoute     from "./components/routing/AdminRoute";
import GuestRoute     from "./components/routing/GuestRoute";

/* ── Lazy-loaded pages — each becomes its own JS chunk ── */
const HomePage            = lazy(() => import("./pages/HomePage"));
const Login               = lazy(() => import("./pages/Login"));
const Register            = lazy(() => import("./pages/Register"));
const ProductsPage        = lazy(() => import("./pages/ProductsPage"));
const ProductDetailPage   = lazy(() => import("./pages/ProductDetailPage"));
const CartPage            = lazy(() => import("./pages/CartPage"));
const CheckoutPage        = lazy(() => import("./pages/CheckoutPage"));
const OrderConfirmationPage = lazy(() => import("./pages/OrderConfirmationPage"));
const OrdersPage          = lazy(() => import("./pages/OrdersPage"));
const ProfilePage         = lazy(() => import("./pages/ProfilePage"));
const WishlistPage        = lazy(() => import("./pages/WishlistPage"));
const AdminDashboard      = lazy(() => import("./pages/AdminDashboard"));
const NotFound            = lazy(() => import("./pages/NotFound"));

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public ── */}
          <Route path="/"           element={<HomePage />} />
          <Route path="/products"   element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          {/* ── Guest-only ── */}
          <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

          {/* ── Protected ── */}
          <Route path="/cart"               element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/checkout"           element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
          <Route path="/orders"             element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/profile"            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/wishlist"           element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />

          {/* ── Admin ── */}
          <Route path="/admin"   element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* ── 404 ── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Footer />
      <RenderWakeup />
    </BrowserRouter>
  );
}