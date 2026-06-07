// Import Axios — a promise-based HTTP client with a cleaner API than fetch
import axios from "axios";

// Create a pre-configured Axios instance so all requests share the same baseURL
// In development, Vite's proxy forwards /api/* to http://localhost:3001
// In production (Vercel), set VITE_API_URL to the Render backend URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api", // reads from .env.local or falls back to proxy
  headers: {
    "Content-Type": "application/json", // tell the server we're sending JSON
  },
  timeout: 10000, // 10-second timeout — prevents hanging requests on slow networks
});

// --- Request Interceptor ---
// Runs before every outgoing request; useful for adding auth headers later
api.interceptors.request.use(
  (config) => config,       // pass the config through unchanged for now
  (error) => Promise.reject(error) // forward request-setup errors
);

// --- Response Interceptor ---
// Normalises API errors so the rest of the app never has to check status codes
api.interceptors.response.use(
  (response) => response, // successful responses pass through unchanged
  (error) => {
    // Extract a human-readable message from the server's error envelope
    // Falls back to the network error message if the server didn't respond at all
    const message =
      error.response?.data?.message || // server returned { success: false, message: "..." }
      error.message ||                  // network error (e.g. ECONNREFUSED)
      "An unknown error occurred";

    // Re-throw as a plain Error so callers can catch(err) and read err.message
    return Promise.reject(new Error(message));
  }
);

// --- Task API Functions ---
// Each function wraps an Axios call and returns the unwrapped data field

/**
 * fetchTasks — GET /api/tasks
 * Retrieves all tasks ordered by their drag-and-drop position.
 */
export const fetchTasks = async () => {
  const { data } = await api.get("/tasks"); // data = { success, data: Task[] }
  return data.data;                          // return just the array
};

/**
 * createTask — POST /api/tasks
 * @param {{ title: string, description?: string, dueDate?: string|null }} payload
 */
export const createTask = async (payload) => {
  const { data } = await api.post("/tasks", payload);
  return data.data; // return the newly created task object
};

/**
 * updateTask — PUT /api/tasks/:id
 * @param {string} id - Task UUID
 * @param {{ title?: string, description?: string, dueDate?: string|null }} payload
 */
export const updateTask = async (id, payload) => {
  const { data } = await api.put(`/tasks/${id}`, payload);
  return data.data; // return the updated task object
};

/**
 * toggleTask — PATCH /api/tasks/:id/toggle
 * Flips the completed status without requiring the caller to know the current state.
 * @param {string} id - Task UUID
 */
export const toggleTask = async (id) => {
  const { data } = await api.patch(`/tasks/${id}/toggle`);
  return data.data; // return the task with its new completed value
};

/**
 * deleteTask — DELETE /api/tasks/:id
 * @param {string} id - Task UUID
 */
export const deleteTask = async (id) => {
  const { data } = await api.delete(`/tasks/${id}`);
  return data; // return the { success, message } confirmation
};

/**
 * reorderTasks — PATCH /api/tasks/reorder
 * Saves the new drag-and-drop order to the backend.
 * @param {Array<{ id: string, order: number }>} orderedTasks
 */
export const reorderTasks = async (orderedTasks) => {
  const { data } = await api.patch("/tasks/reorder", { tasks: orderedTasks });
  return data.data; // return the freshly ordered task list
};
