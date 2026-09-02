// Service layer: one function per backend endpoint used by the admin panel.
import api from "./client";

// ---------- Auth ----------
export const authApi = {
    login: (email, password) =>
        api.post("/auth/login", { email, password }, { auth: false }),
    forgotPassword: (email) =>
        api.post("/auth/forgot-password", { email }, { auth: false }),
    me: () => api.get("/auth/me"),
};

// ---------- Users / Technicians ----------
export const usersApi = {
    getTechnicians: () => api.get("/users/technicians"),
    getTechnician: (id) => api.get(`/users/${id}`),
    updateTechnician: (id, data) => api.put(`/users/${id}`, data),
    deleteTechnician: (id) => api.delete(`/users/${id}`),
    getProfile: () => api.get("/users/profile"),
    updateProfile: (data) => api.put("/users/profile", data),
    changePassword: (currentPassword, newPassword) =>
        api.put("/users/password", { currentPassword, newPassword }),
    deleteAccount: () => api.delete("/users/account"),
};

// ---------- Technicians (trust score) ----------
export const technicianApi = {
    getTrustScore: (technicianId) =>
        api.get(`/technicians/${technicianId}/trust-score`),
};

// ---------- Tasks ----------
export const tasksApi = {
    list: () => api.get("/tasks"),
    get: (id) => api.get(`/tasks/${id}`),
    create: (data) => api.post("/tasks", data),
    update: (id, data) => api.put(`/tasks/${id}`, data),
    assign: (id, assignedTo) => api.put(`/tasks/${id}/assign`, { assignedTo }),
    setStatus: (id, status) => api.put(`/tasks/${id}/status`, { status }),
    verify: (id, code) => api.put(`/tasks/${id}/verify`, { code }),
    dispute: (id, disputeReason) =>
        api.put(`/tasks/${id}/dispute`, { disputeReason }),
    override: (id) => api.put(`/tasks/${id}/override`, {}),
    remove: (id) => api.delete(`/tasks/${id}`),
    stats: () => api.get("/tasks/stats"),
    monthlyStats: () => api.get("/tasks/stats/monthly"),
};

// ---------- Customers ----------
export const customersApi = {
    list: () => api.get("/customers"),
    get: (id) => api.get(`/customers/${id}`),
    create: (data) => api.post("/customers", data),
    update: (id, data) => api.put(`/customers/${id}`, data),
    remove: (id) => api.delete(`/customers/${id}`),
};

// ---------- Notifications ----------
export const notificationsApi = {
    list: () => api.get("/notifications"),
    unread: () => api.get("/notifications/unread"),
    markRead: (id) => api.put(`/notifications/${id}/read`),
    markAllRead: () => api.put("/notifications/read-all"),
};

// ---------- Chats ----------
export const chatsApi = {
    list: () => api.get("/chats"),
    createOrGet: (participantId) => api.post("/chats", { participantId }),
    messages: (chatId) => api.get(`/chats/${chatId}/messages`),
    send: (chatId, content) =>
        api.post(`/chats/${chatId}/messages`, { content }),
};

// ---------- Shared helpers ----------
export const fullName = (u) =>
    u ? `${u.firstName || ""} ${u.lastName || ""}`.trim() : "";

// Backend task status → labels used across the admin UI
export const STATUS_LABELS = {
    available: "Pending", // not yet started
    pending: "In Progress", // accepted / being worked
    awaiting_verification: "Awaiting Code",
    disputed: "Disputed",
    completed: "Completed",
};

export const statusLabel = (status) => STATUS_LABELS[status] || status;

export const capitalize = (s) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
