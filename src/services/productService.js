import api from "./api";

const multipart = { headers: { "Content-Type": "multipart/form-data" } };
export const getProducts = (params) => api.get("/products", { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const getProductsByCategory = (categoryId, params = {}) => api.get(`/products/category/${categoryId}`, { params });
export const createProduct = (formData) => api.post("/products", formData, multipart);
export const updateProduct = (id, formData) => api.put(`/products/${id}`, formData, multipart);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
// services/productService.js