import API from "./api";

export const placeOrder          = (orderData)    => API.post("/orders", orderData);
export const getMyOrders         = ()             => API.get("/orders/myorders");
export const getOrderById        = (id)           => API.get(`/orders/${id}`);

/* ── Razorpay Payment ── */
export const createRazorpayOrder = (payload)      => API.post("/payment/create-order", payload);
export const verifyPayment       = (payload)      => API.post("/payment/verify", payload);

/* ── Image Upload ── */
export const uploadImage = (formData) =>
  API.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
