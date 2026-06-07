// Import the built-in fs module for reading/writing the JSON file
const fs = require("fs");

// Import path for resolving an absolute file path
const path = require("path");

// Choose the storage location:
//   - In production on Render, use the persistent disk mount path (/var/data)
//     so the data survives service rebuilds and restarts
//   - In development, store it next to this file for convenience
// The TASKS_DB_PATH env var lets operators override the path without code changes
const DB_PATH =
  process.env.TASKS_DB_PATH ||                                  // explicit override
  (process.env.NODE_ENV === "production"
    ? "/var/data/tasks.json"                                    // Render persistent disk
    : path.join(__dirname, "tasks.json"));                      // local dev fallback

/**
 * initDatabase
 * Creates the tasks.json file with an empty array if it does not already exist.
 * Called once at server startup before any routes are registered.
 */
function initDatabase() {
  // Ensure the directory exists (important for the /var/data path on Render)
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    // Recursive: creates /var/data if it doesn't exist
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    // First run: seed an empty task list
    fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2), "utf-8");
    console.log("✅ Created new tasks.json at", DB_PATH);
  } else {
    console.log("✅ Loaded existing tasks.json from", DB_PATH);
  }
}

/**
 * readTasks
 * Reads and parses the JSON file, returning the tasks array.
 * On parse failure (corrupted file), logs and returns an empty array.
 *
 * @returns {Object[]}
 */
function readTasks() {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8"); // synchronous read — safe at this scale
    return JSON.parse(raw);
  } catch (err) {
    // Corrupted file: log a warning and recover gracefully with an empty list
    console.error("⚠️  Failed to parse tasks.json:", err.message);
    return [];
  }
}

/**
 * writeTasks
 * Serialises the tasks array to the JSON file with 2-space indentation.
 * Writes are atomic enough for a single-user app; for higher concurrency
 * a write-queue or SQLite would be preferable.
 *
 * @param {Object[]} tasks
 */
function writeTasks(tasks) {
  // JSON.stringify with indent makes the file human-readable for debugging
  fs.writeFileSync(DB_PATH, JSON.stringify(tasks, null, 2), "utf-8");
}

module.exports = { initDatabase, readTasks, writeTasks };
