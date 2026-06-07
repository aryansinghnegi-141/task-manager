// Import the JSON-file persistence helpers
const { readTasks, writeTasks } = require("../storage/database");

// Import uuid v4 for generating unique, collision-resistant task IDs
const { v4: uuidv4 } = require("uuid");

/**
 * getAllTasks
 * Returns all tasks sorted by the `order` field (drag-and-drop position).
 * Falls back to sorting by createdAt descending within the same order value.
 *
 * @returns {Object[]} Sorted task array
 */
function getAllTasks() {
  const tasks = readTasks(); // read the JSON file
  // Sort by order ascending; within the same order value, newer tasks first
  return tasks.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order; // primary: order field
    return new Date(b.createdAt) - new Date(a.createdAt); // secondary: creation time
  });
}

/**
 * getTaskById
 * Finds a single task by its UUID.
 *
 * @param {string} id
 * @returns {Object|undefined}
 */
function getTaskById(id) {
  const tasks = readTasks();
  // Array.find returns the first match or undefined
  return tasks.find((t) => t.id === id);
}

/**
 * createTask
 * Appends a new task to the JSON file.
 *
 * @param {{ title, description?, dueDate? }} data
 * @returns {Object} The created task
 */
function createTask({ title, description = "", dueDate = null }) {
  const tasks = readTasks(); // load current tasks

  // Determine the next order value (new tasks go to the bottom of the list)
  const maxOrder = tasks.reduce((max, t) => Math.max(max, t.order ?? 0), -1);

  // Build the new task object matching the Task Model spec
  const newTask = {
    id: uuidv4(),                   // universally unique identifier
    title,                           // already trimmed by the controller
    description: description || "",  // default to empty string
    dueDate: dueDate || null,        // null when not provided
    completed: false,                // all new tasks start as incomplete
    createdAt: new Date().toISOString(), // ISO 8601 timestamp (UTC)
    order: maxOrder + 1,             // place after all existing tasks
  };

  tasks.push(newTask);   // append to the array
  writeTasks(tasks);     // persist back to disk

  return newTask;
}

/**
 * updateTask
 * Merges updated fields into an existing task.
 *
 * @param {string} id
 * @param {{ title?, description?, dueDate? }} data
 * @returns {Object|undefined} Updated task or undefined if not found
 */
function updateTask(id, { title, description, dueDate }) {
  const tasks = readTasks();

  // Find the index of the task to update
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return undefined; // task not found

  // Merge only the provided fields — leave others unchanged
  const updated = {
    ...tasks[index],                                   // spread existing fields
    title: title !== undefined ? title : tasks[index].title, // update if provided
    description: description !== undefined ? description : tasks[index].description,
    dueDate: dueDate !== undefined ? dueDate : tasks[index].dueDate, // null clears the date
  };

  tasks[index] = updated; // replace the task in place
  writeTasks(tasks);       // persist

  return updated;
}

/**
 * toggleTask
 * Flips the completed boolean of a task.
 *
 * @param {string} id
 * @returns {Object|undefined}
 */
function toggleTask(id) {
  const tasks = readTasks();

  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return undefined;

  // Flip the boolean
  tasks[index] = { ...tasks[index], completed: !tasks[index].completed };
  writeTasks(tasks);

  return tasks[index];
}

/**
 * deleteTask
 * Removes a task from the JSON file.
 *
 * @param {string} id
 * @returns {boolean} true if deleted, false if not found
 */
function deleteTask(id) {
  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false; // not found

  tasks.splice(index, 1); // remove one element at index
  writeTasks(tasks);       // persist

  return true;
}

/**
 * reorderTasks
 * Bulk-updates the order field for multiple tasks.
 *
 * @param {Array<{ id: string, order: number }>} orderedItems
 */
function reorderTasks(orderedItems) {
  const tasks = readTasks();

  // Build a lookup map: id → new order value for O(1) access inside the loop
  const orderMap = {};
  for (const item of orderedItems) {
    orderMap[item.id] = item.order; // e.g. { "uuid-1": 0, "uuid-2": 1 }
  }

  // Update the order field on each matching task
  const updated = tasks.map((task) => {
    if (orderMap[task.id] !== undefined) {
      return { ...task, order: orderMap[task.id] }; // apply new order
    }
    return task; // leave tasks not in the payload unchanged
  });

  writeTasks(updated); // persist all changes in one write
}

// Export all service functions
module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
  reorderTasks,
};
