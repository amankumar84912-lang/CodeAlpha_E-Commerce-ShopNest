import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { AuthProvider }     from "./context/AuthContext";
import { CartProvider }     from "./context/CartContext";
import { ToastProvider }    from "./context/ToastContext";
import { ThemeProvider }    from "./context/ThemeContext";
import { WishlistProvider } from "./context/WishlistContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);