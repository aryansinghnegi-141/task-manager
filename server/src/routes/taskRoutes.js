// Import Express to create a modular router instance
const express = require("express");

// Import all controller functions for task operations
const {
  getTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
  reorderTasks,
} = require("../controllers/taskController");

// Create a new Express Router — this is mounted at /api/tasks in index.js
const router = express.Router();

// --- Route Definitions ---
// ORDER MATTERS: the /reorder route must come BEFORE /:id routes
// to prevent Express from treating "reorder" as a dynamic :id segment

// GET /api/tasks — fetch all tasks (sorted by order column)
router.get("/", getTasks);

// POST /api/tasks — create a new task
router.post("/", createTask);

// PATCH /api/tasks/reorder — bulk-update task order (drag and drop)
// Defined before /:id so "reorder" isn't captured as an id parameter
router.patch("/reorder", reorderTasks);

// PUT /api/tasks/:id — update an existing task's title/description/dueDate
router.put("/:id", updateTask);

// PATCH /api/tasks/:id/toggle — flip the completed status of a task
router.patch("/:id/toggle", toggleTask);

// DELETE /api/tasks/:id — permanently remove a task
router.delete("/:id", deleteTask);

// Export the router to be used in index.js
module.exports = router;
