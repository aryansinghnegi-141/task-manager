// useEffect syncs form fields when task prop changes AND adds Escape key handler
// useState manages the local form field values
import { useState, useEffect } from "react";

/**
 * EditModal
 * A modal dialog for editing an existing task's title, description, and due date.
 * Pre-fills all fields with the current task values when opened.
 * Closes on Escape key press or backdrop click.
 *
 * Props:
 *   task      — the task object to edit (null = modal is closed)
 *   onSave    — async function called with (id, formData) on submit
 *   onClose   — function called when the user dismisses the modal
 */
export default function EditModal({ task, onSave, onClose }) {
  // Local controlled state for each editable field
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [titleError, setTitleError] = useState(""); // inline validation error
  const [saving, setSaving] = useState(false);       // loading state for save button

  // --- Sync form fields when the task prop changes ---
  // Runs when the modal opens (task goes from null → object) and on task switches
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      // Slice ISO timestamp to YYYY-MM-DD for <input type="date"> value
      setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
      setTitleError(""); // reset previous errors on open
    }
  }, [task]);

  // --- Escape key handler ---
  // Standard dialog pattern: pressing Escape = clicking Cancel
  useEffect(() => {
    if (!task) return; // only active while the modal is open

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !saving) {
        onClose(); // close without saving
      }
    };

    // Attach globally so it fires regardless of focused element
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup on modal close or unmount to avoid stale listeners
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [task, saving, onClose]);

  // If no task is selected, render nothing (modal is closed)
  if (!task) return null;

  /**
   * handleSubmit
   * Validates the form and calls the parent's onSave callback.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent default browser form submission

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError("Title cannot be empty.");
      return;
    }
    setTitleError("");

    try {
      setSaving(true); // show loading state on the button
      await onSave(task.id, {
        title: trimmedTitle,
        description: description.trim(),
        dueDate: dueDate || null, // null explicitly clears the due date
      });
      // onSave calls setEditingTask(null) internally, which closes the modal
    } finally {
      setSaving(false); // always re-enable whether save succeeded or failed
    }
  };

  /**
   * handleBackdropClick
   * Closes the modal when the user clicks the semi-transparent backdrop.
   * The inner panel calls stopPropagation to prevent accidental closure.
   */
  const handleBackdropClick = () => {
    if (!saving) onClose();
  };

  return (
    // Fixed overlay covering the entire viewport
    <div
      className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-sm z-50
        flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
    >
      {/* Modal panel — stop propagation so panel clicks don't close the modal */}
      <div
        className="bg-cream-50 rounded-2xl shadow-2xl w-full max-w-md
          animate-slide-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="px-6 pt-6 pb-4 border-b border-cream-200 flex items-center justify-between">
          <h2
            id="edit-modal-title"
            className="font-display text-xl text-charcoal-800 font-bold"
          >
            Edit Task
          </h2>
          {/* Close / X button */}
          <button
            onClick={onClose}
            disabled={saving}
            aria-label="Close edit modal"
            className="text-charcoal-700 opacity-40 hover:opacity-80 text-xl transition-opacity
              disabled:cursor-not-allowed"
          >
            ✕
          </button>
        </div>

        {/* Edit form */}
        <form onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-4">

          {/* Title field */}
          <div>
            <label
              htmlFor="edit-title"
              className="block text-sm font-medium text-charcoal-800 mb-1"
            >
              Title <span className="text-red-400">*</span>
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError(""); // clear error as user types
              }}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white
                focus:outline-none focus:ring-2 transition-all
                ${titleError
                  ? "border-red-400 focus:ring-red-200"
                  : "border-cream-200 focus:ring-sage-400/30 focus:border-sage-500"
                }`}
            />
            {titleError && (
              <p className="text-red-500 text-xs mt-1">{titleError}</p>
            )}
          </div>

          {/* Description textarea */}
          <div>
            <label
              htmlFor="edit-desc"
              className="block text-sm font-medium text-charcoal-800 mb-1"
            >
              Description{" "}
              <span className="text-charcoal-700 opacity-50 font-normal">(optional)</span>
            </label>
            <textarea
              id="edit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm
                bg-white focus:outline-none focus:ring-2 focus:ring-sage-400/30
                focus:border-sage-500 transition-all resize-none"
            />
          </div>

          {/* Due date picker */}
          <div>
            <label
              htmlFor="edit-due"
              className="block text-sm font-medium text-charcoal-800 mb-1"
            >
              Due Date{" "}
              <span className="text-charcoal-700 opacity-50 font-normal">(optional)</span>
            </label>
            <input
              id="edit-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm
                bg-white focus:outline-none focus:ring-2 focus:ring-sage-400/30
                focus:border-sage-500 transition-all"
            />
          </div>

          {/* Action row */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 py-2.5 border border-cream-200 text-charcoal-800
                rounded-xl text-sm font-medium hover:bg-cream-200 transition-all
                disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-sage-500 hover:bg-sage-600 text-white
                rounded-xl text-sm font-semibold transition-all
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
