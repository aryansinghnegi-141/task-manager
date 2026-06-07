// useEffect adds an Escape key listener while the dialog is open
import { useEffect } from "react";

/**
 * DeleteConfirmDialog
 * A confirmation dialog displayed before permanently deleting a task.
 * Closes on Escape key press or backdrop click, in addition to the Cancel button.
 *
 * Props:
 *   task      — the task object pending deletion (null = dialog is closed)
 *   onConfirm — called when the user clicks "Delete"
 *   onCancel  — called when the user cancels (Cancel button, Escape, backdrop click)
 */
export default function DeleteConfirmDialog({ task, onConfirm, onCancel }) {
  // --- Escape key handler ---
  // Mirrors the EditModal pattern: Escape = Cancel in dialogs
  useEffect(() => {
    if (!task) return; // only register while the dialog is open

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", handleKeyDown);

    // Remove listener when dialog closes or component unmounts
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [task, onCancel]);

  // Render nothing when there's no task queued for deletion
  if (!task) return null;

  return (
    // Fixed overlay with the same visual treatment as EditModal for consistency
    <div
      className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-sm z-50
        flex items-center justify-center p-4"
      onClick={onCancel} // clicking outside = cancel
      role="alertdialog"       // alertdialog is more prominent than dialog for screen readers
      aria-modal="true"
      aria-labelledby="delete-title"
      aria-describedby="delete-desc"
    >
      {/* Dialog panel */}
      <div
        className="bg-cream-50 rounded-2xl shadow-2xl w-full max-w-sm p-6
          animate-slide-in text-center"
        onClick={(e) => e.stopPropagation()} // prevent backdrop click from propagating
      >
        {/* Warning icon */}
        <div className="text-5xl mb-4 select-none">🗑️</div>

        {/* Dialog title */}
        <h2
          id="delete-title"
          className="font-display text-xl font-bold text-charcoal-800 mb-2"
        >
          Delete Task?
        </h2>

        {/* Description with the task title — tells users exactly what they're deleting */}
        <p
          id="delete-desc"
          className="text-sm text-charcoal-700 opacity-60 mb-6 leading-relaxed"
        >
          Are you sure you want to delete{" "}
          {/* Truncate very long titles so the dialog doesn't overflow */}
          <strong className="text-charcoal-800 opacity-100 font-semibold">
            &ldquo;{task.title.length > 50 ? task.title.slice(0, 50) + "…" : task.title}&rdquo;
          </strong>
          ?{" "}
          <span className="block mt-1">This action cannot be undone.</span>
        </p>

        {/* Keyboard shortcut hint */}
        <p className="text-[11px] text-charcoal-700 opacity-30 font-mono mb-4">
          Press <kbd className="bg-cream-200 px-1 rounded">Esc</kbd> to cancel
        </p>

        {/* Action buttons */}
        <div className="flex gap-3">
          {/* Cancel — autoFocus puts keyboard focus on the safer option */}
          <button
            onClick={onCancel}
            autoFocus
            className="flex-1 py-2.5 border border-cream-200 text-charcoal-800 rounded-xl
              text-sm font-medium hover:bg-cream-200 transition-all"
          >
            Cancel
          </button>

          {/* Confirm delete — red to signal a destructive / irreversible action */}
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 active:scale-[0.97]
              text-white rounded-xl text-sm font-semibold transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
