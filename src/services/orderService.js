import api from "./api";

export const checkout = (reference) => api.post("/checkout", { reference });
export const initializeCheckout = () => api.post(`/checkout/init`);
export const getMyOrders = () => api.get("/orders");
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const getAllOrders = (params) => api.get("/orders/admin/all", { params });
export const updateOrderStatus = (id, status) => api.put(`/orders/admin/${id}/status`, { status });

