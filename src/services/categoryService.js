import api from "./api";

export const getCategoryById = (id) => api.get(`/categories/${id}`);
export const getCategories = () => api.get("/categories"); // keep your existing one as it is

export const createCategory = (data) => api.post("/categories", data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);