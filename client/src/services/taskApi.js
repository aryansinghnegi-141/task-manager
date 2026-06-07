// Import Axios — a promise-based HTTP client
import axios from "axios";

// The backend URL:
//   - In production (Vercel): VITE_API_URL is set to the Render backend URL
//   - In development: falls back to /api which Vite proxies to localhost:3001
const BASE_URL =
  import.meta.env.VITE_API_URL ||   // set this on Vercel: https://task-manager-1-5tcs.onrender.com/api
  "/api";                            // dev fallback — Vite proxy handles this

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15s — Render free tier can be slow to wake up after inactivity
});

// --- Request interceptor ---
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// --- Response interceptor ---
// Normalise API errors into plain Error objects so callers just catch(err) and read err.message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unknown error occurred";
    return Promise.reject(new Error(message));
  }
);

// --- Task API functions ---

/** GET /api/tasks — fetch all tasks sorted by order */
export const fetchTasks = async () => {
  const { data } = await api.get("/tasks");
  return data.data;
};

/** POST /api/tasks — create a new task */
export const createTask = async (payload) => {
  const { data } = await api.post("/tasks", payload);
  return data.data;
};

/** PUT /api/tasks/:id — update title / description / dueDate */
export const updateTask = async (id, payload) => {
  const { data } = await api.put(`/tasks/${id}`, payload);
  return data.data;
};

/** PATCH /api/tasks/:id/toggle — flip completed status */
export const toggleTask = async (id) => {
  const { data } = await api.patch(`/tasks/${id}/toggle`);
  return data.data;
};

/** DELETE /api/tasks/:id — permanently delete a task */
export const deleteTask = async (id) => {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
};

/** PATCH /api/tasks/reorder — save drag-and-drop order */
export const reorderTasks = async (orderedTasks) => {
  const { data } = await api.patch("/tasks/reorder", { tasks: orderedTasks });
  return data.data;
};
