// React hooks for state and side effects
import { useState, useEffect, useCallback, useMemo } from "react";

// Import all API service functions
import {
  fetchTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
  reorderTasks,
} from "../services/taskApi";

/**
 * useTasks
 * Central custom hook that manages all task state and API interactions.
 * Keeps the state management logic out of components, making them easier to test
 * and reason about (separation of concerns).
 *
 * Returns everything the UI needs: tasks, loading/error states, filter/search state,
 * and action functions that update state optimistically.
 */
export function useTasks() {
  // --- State ---

  // Master list of all tasks fetched from the backend — the single source of truth
  const [tasks, setTasks] = useState([]);

  // True while the initial page load fetch is in progress
  const [loading, setLoading] = useState(true);

  // Stores an error message string, or null when there is no error
  const [error, setError] = useState(null);

  // Currently active filter tab: "all" | "active" | "completed"
  const [filter, setFilter] = useState("all");

  // Free-text search string — filtered tasks update reactively as the user types
  const [searchQuery, setSearchQuery] = useState("");

  // Tracks which task is being edited in the modal (null = modal closed)
  const [editingTask, setEditingTask] = useState(null);

  // Tracks which task is waiting for delete confirmation (null = dialog closed)
  const [deletingTask, setDeletingTask] = useState(null);

  // Brief success notification text (e.g. "Task created!"), cleared after 2s
  const [notification, setNotification] = useState(null);

  // --- Initial Data Load ---

  // Load tasks once when the component mounts (empty dependency array)
  useEffect(() => {
    loadTasks();
  }, []);

  /**
   * loadTasks
   * Fetches all tasks from the API and replaces local state.
   * Also used to re-sync after operations that affect order (e.g. reorder).
   */
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);    // show loading skeleton
      setError(null);      // clear any previous errors
      const data = await fetchTasks(); // API call
      setTasks(data);      // replace state with fresh data
    } catch (err) {
      setError(err.message); // display the error banner
    } finally {
      setLoading(false);   // hide loading skeleton regardless of outcome
    }
  }, []);

  // --- Notification Helper ---

  /**
   * showNotification
   * Shows a brief success message then auto-clears it after 2 seconds.
   * @param {string} message
   */
  const showNotification = useCallback((message) => {
    setNotification(message); // show the notification
    // Auto-dismiss after 2 seconds — clears state without needing a close button
    setTimeout(() => setNotification(null), 2000);
  }, []);

  // --- Task Actions ---

  /**
   * handleCreate
   * Creates a new task and appends it to local state without a full re-fetch.
   * @param {{ title: string, description?: string, dueDate?: string|null }} formData
   */
  const handleCreate = useCallback(async (formData) => {
    try {
      const newTask = await createTask(formData); // POST to API
      // Append the new task — backend assigns the correct order value
      setTasks((prev) => [...prev, newTask]);
      showNotification("✅ Task created!");
    } catch (err) {
      setError(err.message);
    }
  }, [showNotification]);

  /**
   * handleUpdate
   * Updates an existing task's fields and merges the result into local state.
   * @param {string} id
   * @param {{ title?: string, description?: string, dueDate?: string|null }} formData
   */
  const handleUpdate = useCallback(async (id, formData) => {
    try {
      const updated = await updateTask(id, formData); // PUT to API
      // Replace only the updated task in the array — leave all others untouched
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setEditingTask(null); // close the edit modal
      showNotification("✅ Task updated!");
    } catch (err) {
      setError(err.message);
    }
  }, [showNotification]);

  /**
   * handleToggle
   * Optimistically flips the completed status in local state, then syncs with the backend.
   * Rolls back the optimistic update if the API call fails.
   * @param {string} id
   */
  const handleToggle = useCallback(async (id) => {
    // --- Optimistic Update ---
    // Immediately flip the UI so the interaction feels instant
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

    try {
      // Confirm with the backend and use its authoritative response
      const updated = await toggleTask(id); // PATCH to API
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      // --- Rollback ---
      // If the API call fails, flip the status back to its original value
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
      setError(err.message);
    }
  }, []);

  /**
   * handleDelete
   * Deletes the task stored in `deletingTask` (set by the confirmation dialog).
   */
  const handleDelete = useCallback(async () => {
    if (!deletingTask) return; // guard against accidental calls

    const id = deletingTask.id; // capture id before clearing state
    setDeletingTask(null);      // close the confirmation dialog immediately

    try {
      await deleteTask(id); // DELETE to API
      // Remove the task from local state — no re-fetch needed
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showNotification("🗑️ Task deleted.");
    } catch (err) {
      setError(err.message);
    }
  }, [deletingTask, showNotification]);

  /**
   * handleReorder
   * Called by the drag-and-drop handler after the user drops a card.
   * Immediately reorders local state for a smooth UI, then persists to the backend.
   * @param {string[]} orderedIds - Task IDs in their new order
   */
  const handleReorder = useCallback(async (orderedIds) => {
    // Build the new ordered tasks array in the client-specified sequence
    const reordered = orderedIds.map((id) => tasks.find((t) => t.id === id)).filter(Boolean);

    // Optimistically update local state so the drag animation settles smoothly
    setTasks(reordered);

    // Build the payload for the API: [{ id, order: 0 }, { id, order: 1 }, ...]
    const payload = reordered.map((t, index) => ({ id: t.id, order: index }));

    try {
      await reorderTasks(payload); // PATCH to API
    } catch (err) {
      // On failure, reload from server to restore the correct order
      loadTasks();
      setError(err.message);
    }
  }, [tasks, loadTasks]);

  // --- Derived / Computed State ---

  /**
   * filteredTasks
   * A memoised subset of tasks based on the active filter and search query.
   * Recalculates only when tasks, filter, or searchQuery changes.
   */
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Apply the filter tab (all/active/completed)
      const matchesFilter =
        filter === "all" ||                              // show every task
        (filter === "active" && !task.completed) ||     // only incomplete tasks
        (filter === "completed" && task.completed);     // only completed tasks

      // Apply the search query — case-insensitive substring match on the title
      const matchesSearch =
        searchQuery.trim() === "" || // no search = show all
        task.title.toLowerCase().includes(searchQuery.toLowerCase());

      // Task passes if it matches both the filter AND the search
      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, searchQuery]);

  /**
   * stats
   * Derived counts shown in the statistics bar.
   * Memoised to avoid re-counting on every render.
   */
  const stats = useMemo(() => ({
    total: tasks.length,                           // all tasks
    active: tasks.filter((t) => !t.completed).length,    // incomplete tasks
    completed: tasks.filter((t) => t.completed).length,  // completed tasks
  }), [tasks]);

  // Return everything the UI layer needs — clean public API for this hook
  return {
    // State
    tasks,
    filteredTasks,
    loading,
    error,
    filter,
    searchQuery,
    editingTask,
    deletingTask,
    notification,
    stats,

    // State setters (used by UI components to open modals, change filters, etc.)
    setFilter,
    setSearchQuery,
    setEditingTask,
    setDeletingTask,
    setError,

    // Action handlers
    handleCreate,
    handleUpdate,
    handleToggle,
    handleDelete,
    handleReorder,
  };
}
