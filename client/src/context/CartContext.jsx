import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { AuthContext } from "./AuthContext";
import * as cartService from "../services/cartService";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading,   setLoading]   = useState(false);

  const { user } = useContext(AuthContext);

  /* ── Derived state ── */
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
    0
  );

  /* ── Fetch cart from API ── */
  const fetchCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await cartService.fetchCart();
      // Filter out orphaned items (product deleted from DB after being added to cart)
      const validItems = (data?.items ?? []).filter((item) => item.product !== null);
      setCartItems(validItems);
    } catch {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /* ── Sync cart with auth state ── */
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user, fetchCart]);

  /* ── Add to cart ── */
  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      await cartService.addItemToCart(productId, quantity);
      await fetchCart(); // refetch to get populated product data
    },
    [fetchCart]
  );

  /* ── Remove item entirely ── */
  const removeFromCart = useCallback(
    async (productId) => {
      // Optimistic update for instant feedback
      setCartItems((prev) =>
        prev.filter((item) => item.product._id !== productId)
      );
      try {
        await cartService.removeFromCart(productId);
      } catch {
        await fetchCart(); // revert on error
      }
    },
    [fetchCart]
  );

  /* ── Update quantity — uses direct SET endpoint (no delete+re-add) ── */
  const updateItemQty = useCallback(
    async (productId, currentQty, delta) => {
      const newQty = currentQty + delta;

      if (newQty <= 0) {
        return removeFromCart(productId);
      }

      // Optimistic update
      setCartItems((prev) =>
        prev.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: newQty }
            : item
        )
      );

      try {
        await cartService.updateCartQty(productId, newQty); // atomic SET
      } catch {
        await fetchCart(); // revert on error
      }
    },
    [removeFromCart, fetchCart]
  );

  /* ── Clear cart (called after order placed) — clears both state & DB ── */
  const clearCart = useCallback(async () => {
    setCartItems([]); // instant local clear
    try {
      await cartService.clearCart(); // sync to backend
    } catch {
      // Non-critical — order is already placed
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        loading,
        fetchCart,
        addToCart,
        removeFromCart,
        updateItemQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
