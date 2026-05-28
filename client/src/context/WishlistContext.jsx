import { createContext, useState, useContext, useCallback } from "react";

export const WishlistContext = createContext();

/**
 * WishlistContext — client-side only (localStorage).
 * Stores product IDs the user has hearted.
 * No backend needed — persists across sessions.
 */
export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("shopnest-wishlist") || "[]");
    } catch {
      return [];
    }
  });

  const save = (updated) => {
    setWishlist(updated);
    localStorage.setItem("shopnest-wishlist", JSON.stringify(updated));
  };

  const toggle = useCallback((productId) => {
    setWishlist((prev) => {
      const isIn   = prev.includes(productId);
      const updated = isIn
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem("shopnest-wishlist", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isWishlisted = useCallback(
    (productId) => wishlist.includes(productId),
    [wishlist]
  );

  const count = wishlist.length;

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, isWishlisted, count }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
