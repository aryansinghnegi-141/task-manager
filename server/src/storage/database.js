const fs = require("fs");
const path = require("path");

// Use TASKS_DB_PATH env var if set, otherwise always store next to this file.
// On Render free tier there is no persistent disk (/var/data doesn't exist),
// so we default to a path we know is writable: the project directory itself.
const DB_PATH =
  process.env.TASKS_DB_PATH ||
  path.join(__dirname, "tasks.json");

/**
 * initDatabase
 * Creates tasks.json with an empty array if it doesn't exist yet.
 */
function initDatabase() {
  // Ensure the parent directory exists (handles any custom TASKS_DB_PATH)
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2), "utf-8");
    console.log("✅ Created new tasks.json at", DB_PATH);
  } else {
    console.log("✅ Loaded existing tasks.json from", DB_PATH);
  }
}

/**
 * readTasks — reads and parses the JSON file.
 * @returns {Object[]}
 */
function readTasks() {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("⚠️  Failed to parse tasks.json:", err.message);
    return [];
  }
}

/**
 * writeTasks — serialises the tasks array back to disk.
 * @param {Object[]} tasks
 */
function writeTasks(tasks) {
  fs.writeFileSync(DB_PATH, JSON.stringify(tasks, null, 2), "utf-8");
}

module.exports = { initDatabase, readTasks, writeTasks };
