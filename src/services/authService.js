import api from "./api";

export const register = (payload) => api.post("/auth/register", payload);
export const login = (payload) => api.post("/auth/login", payload);
export const getMe = () => api.get("/auth/me");

export const forgotPassword = (email) => {
    return api.post("/auth/forgot-password", {
        email,
    });
};

export const validateResetToken = (token) => {
    return api.post("/auth/reset-password/validate", {
        token,
    });
};

export const resetPassword = ({ token, password, confirmPassword }) => {
    return api.post(
        `/auth/reset-password/${encodeURIComponent(token)}`,
        {
            password,
            confirmPassword,
        }
    );
};
