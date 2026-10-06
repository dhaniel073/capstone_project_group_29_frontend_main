import api from "./api";

export const getCart = () => api.get("/cart");
export const addToCart = (productId, quantity) => api.post("/cart", { productId, quantity });
export const removeFromCart = (productId) => api.delete(`/cart/${productId}`);
export const removeOneFromCart = (productId) => api.post(`/cart/remove-one/${productId}`);
export const addOneToCart = (productId) => api.post(`/cart/add-one/${productId}`);
