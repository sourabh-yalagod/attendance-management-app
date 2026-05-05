import axios from "axios";

const baseURL = import.meta.env.BASE_URL;
const API = axios.create({
  baseURL: `${baseURL}/api`,
});

// Attach Clerk token + role
API.interceptors.request.use(async (config) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (user) {
    config.headers["x-user"] = JSON.stringify({
      id: user.id,
      role: user.role,
    });
  }

  return config;
});

export default {
  // Batch
  createBatch: (data: any) => API.post("/batches", data),
  generateInvite: (id: string) => API.post(`/batches/${id}/invite`),
  joinBatch: (token: string) => API.post("/batches/join", { token }),

  // Session
  createSession: (data: any) => API.post("/sessions", data),
  getAttendance: (id: string) => API.get(`/sessions/${id}/attendance`),

  // Attendance
  markAttendance: (data: any) => API.post("/attendance/mark", data),

  // Summary
  batchSummary: (id: string) => API.get(`/batches/${id}/summary`),
  programmeSummary: () => API.get("/programme/summary"),
};
