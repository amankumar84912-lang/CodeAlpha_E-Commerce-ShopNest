import API from "./api";

export const fetchCart       = ()                       => API.get("/cart");
export const addItemToCart   = (productId, quantity)    => API.post("/cart", { productId, quantity });
export const updateCartQty   = (productId, quantity)    => API.put(`/cart/${productId}`, { quantity });
export const removeFromCart  = (productId)              => API.delete(`/cart/${productId}`);
export const clearCart       = ()                       => API.delete("/cart");
