// Load environment variables from .env file before anything else
require("dotenv").config();

// Import the Express framework for building the HTTP server
const express = require("express");

// Import CORS middleware to allow cross-origin requests from the frontend
const cors = require("cors");

// Import our task routes module that defines all /api/tasks endpoints
const taskRoutes = require("./routes/taskRoutes");

// Import the error-handling middleware for centralised error responses
const errorHandler = require("./middleware/errorHandler");

// Import the database initialisation function to set up SQLite on startup
const { initDatabase } = require("./storage/database");

// Create the Express application instance
const app = express();

// Read the port from the environment variable, defaulting to 3001 if not set
const PORT = process.env.PORT || 3001;

// --- Middleware Setup ---

// Enable CORS so the React dev server (localhost:5173) can call this API
// In production, restrict the origin to your deployed frontend URL
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // allowed origin
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],        // allowed HTTP methods
    credentials: true,                                          // allow cookies if needed later
  })
);

// Parse incoming JSON request bodies so req.body is available
app.use(express.json());

// Parse URL-encoded bodies (form submissions), extended=false uses the native querystring library
app.use(express.urlencoded({ extended: false }));

// --- Routes ---

// Mount all task-related routes under the /api/tasks prefix
app.use("/api/tasks", taskRoutes);

// Simple health-check route so deployment platforms can verify the server is alive
app.get("/health", (req, res) => {
  res.json({ success: true, message: "Task Manager API is running" });
});

// Catch-all route for any unmatched paths — returns a 404 JSON response
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Mount the global error handler LAST — Express identifies it by its 4-parameter signature
app.use(errorHandler);

// --- Bootstrap ---

// Initialise the database (creates tables if they don't exist) then start listening
initDatabase();

// Start the HTTP server and log the port for developer convenience
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// Export the app for use in automated tests (supertest imports this)
module.exports = app;
