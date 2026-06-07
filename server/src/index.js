// Load environment variables from .env file before anything else
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");
const { initDatabase } = require("./storage/database");

const app = express();
const PORT = process.env.PORT || 3001;

// --- CORS ---
// Whitelist of origins allowed to call this API.
// Always includes localhost for local development.
// In production, CLIENT_URL must be set to the Vercel frontend URL.
const ALLOWED_ORIGINS = [
  "http://localhost:5173",                              // Vite dev server
  "http://localhost:3000",                              // fallback local port
  "https://task-manager-141.vercel.app",               // production Vercel frontend
  process.env.CLIENT_URL,                              // env override (optional)
].filter(Boolean); // remove undefined/null entries

app.use(
  cors({
    // Allow the request if its Origin header is in the whitelist
    origin: (origin, callback) => {
      // Allow requests with no Origin header (e.g. curl, Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);  // origin is allowed
      } else {
        // Log the blocked origin so it's visible in Render logs
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error(`CORS policy: origin ${origin} is not allowed`));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle preflight OPTIONS requests for all routes
app.options("*", cors());

// Parse incoming JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- Routes ---
app.use("/api/tasks", taskRoutes);

// Health check — lets you verify the backend is alive from the browser
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Task Manager API is running",
    allowedOrigins: ALLOWED_ORIGINS, // helpful for debugging CORS issues
  });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler — must be last, identified by 4 params
app.use(errorHandler);

// --- Bootstrap ---
initDatabase();

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Allowed origins: ${ALLOWED_ORIGINS.join(", ")}`);
});

module.exports = app;
