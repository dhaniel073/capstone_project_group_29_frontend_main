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

//admin
export const forgotAdminPassword = (email) => {
    return api.post("/auth/admin/forgot-password", {
        email: email.trim().toLowerCase(),
    });
};

export const validateAdminResetToken = (token) => {
    return api.post("/auth/admin/reset-password/validate", { token });
}

export const sendAdminResetOtp = (token) => {
    return api.post("/auth/admin/reset-password/send-otp", { token });
}

export const verifyAdminResetOtp = (challengeId, otp) => {
    return api.post("/auth/admin/reset-password/verify-otp", {
        challengeId,
        otp,
    });
}

export const resendAdminResetOtp = (challengeId) => {
    return api.post("/auth/admin/reset-password/resend-otp", {
        challengeId,
    });
}

export const resetAdminPassword = (payload) => {
    return api.post("/auth/admin/reset-password", payload);
}