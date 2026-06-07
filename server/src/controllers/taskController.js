// Import the service layer — controllers never touch storage directly
const taskService = require("../services/taskService");

// Import the shared validation helpers from the utils module
const { validateTaskPayload } = require("../utils/validate");

/**
 * getTasks
 * GET /api/tasks
 * Returns all tasks ordered by their drag-and-drop position.
 */
function getTasks(req, res, next) {
  try {
    const tasks = taskService.getAllTasks(); // fetch sorted tasks from JSON file
    res.json({ success: true, data: tasks });
  } catch (err) {
    next(err); // forward to global error handler
  }
}

/**
 * createTask
 * POST /api/tasks
 * Validates the request body and creates a new task.
 * Expected body: { title, description?, dueDate? }
 */
function createTask(req, res, next) {
  try {
    const { title, description, dueDate } = req.body;

    // Run shared validation — requireTitle defaults to true for creation
    const errors = validateTaskPayload({ title, dueDate });
    if (errors.length > 0) {
      // Return the first error message with a 400 Bad Request status
      return res.status(400).json({ success: false, message: errors[0] });
    }

    // Create the task; trim strings and normalise missing optionals to safe defaults
    const task = taskService.createTask({
      title: title.trim(),
      description: description?.trim() || "", // default to empty string
      dueDate: dueDate || null,               // null when not provided
    });

    // 201 Created — the new resource is returned in the response body
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

/**
 * updateTask
 * PUT /api/tasks/:id
 * Updates an existing task's title, description, and/or dueDate.
 */
function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;

    // Validate the provided fields; title is optional on update (partial update support)
    const errors = validateTaskPayload({ title, dueDate }, { requireTitle: false });
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors[0] });
    }

    // Delegate to the service; undefined values are handled as "leave unchanged"
    const updated = taskService.updateTask(id, {
      title: title?.trim(),
      description: description?.trim(),
      dueDate: dueDate !== undefined ? dueDate || null : undefined,
    });

    // 404 when the task ID doesn't exist
    if (!updated) {
      return res.status(404).json({ success: false, message: "Task not found." });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

/**
 * toggleTask
 * PATCH /api/tasks/:id/toggle
 * Flips the completed status between true and false.
 */
function toggleTask(req, res, next) {
  try {
    const { id } = req.params;
    const updated = taskService.toggleTask(id); // service handles the flip

    if (!updated) {
      return res.status(404).json({ success: false, message: "Task not found." });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

/**
 * deleteTask
 * DELETE /api/tasks/:id
 * Permanently removes a task by ID.
 */
function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = taskService.deleteTask(id); // returns true if row existed

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Task not found." });
    }

    res.json({ success: true, message: "Task deleted successfully." });
  } catch (err) {
    next(err);
  }
}

/**
 * reorderTasks
 * PATCH /api/tasks/reorder
 * Persists a new drag-and-drop order for all tasks.
 * Expected body: { tasks: [{ id, order }, ...] }
 */
function reorderTasks(req, res, next) {
  try {
    const { tasks } = req.body;

    // Validate the payload — must be a non-empty array
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "tasks must be a non-empty array of { id, order } objects.",
      });
    }

    // Each item must have id and a numeric order
    const malformed = tasks.find(
      (t) => typeof t.id !== "string" || typeof t.order !== "number"
    );
    if (malformed) {
      return res.status(400).json({
        success: false,
        message: "Each task in the array must have a string id and a numeric order.",
      });
    }

    taskService.reorderTasks(tasks); // bulk update order values

    // Return the full freshly-ordered list so the frontend can sync
    const allTasks = taskService.getAllTasks();
    res.json({ success: true, data: allTasks });
  } catch (err) {
    next(err);
  }
}

module.exports = { getTasks, createTask, updateTask, toggleTask, deleteTask, reorderTasks };
