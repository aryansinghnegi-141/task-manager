// useState manages the local form field values
import { useState } from "react";

/**
 * TaskForm
 * A form card for creating new tasks.
 * Handles its own local validation and calls the parent's onCreate callback on submit.
 *
 * Props:
 *   onCreate — async function called with { title, description, dueDate }
 */
export default function TaskForm({ onCreate }) {
  // Local state for each form field — controlled inputs
  const [title, setTitle] = useState("");         // required field
  const [description, setDescription] = useState(""); // optional
  const [dueDate, setDueDate] = useState("");     // optional date string
  const [titleError, setTitleError] = useState(""); // validation error message
  const [submitting, setSubmitting] = useState(false); // disables button during API call
  const [expanded, setExpanded] = useState(false); // show/hide description+date fields

  /**
   * handleSubmit
   * Validates the form, calls onCreate, and resets fields on success.
   * @param {React.FormEvent} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent the default browser form submission / page reload

    // --- Frontend Validation ---
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      // Show an inline error under the title field
      setTitleError("Title cannot be empty.");
      return; // stop execution — do not call the API
    }
    setTitleError(""); // clear any previous error

    try {
      setSubmitting(true); // disable the button to prevent duplicate submissions
      // Call the parent's create handler — it will POST to the API
      await onCreate({
        title: trimmedTitle,
        description: description.trim(),
        dueDate: dueDate || null, // send null when the field is empty
      });
      // Reset all fields on success
      setTitle("");
      setDescription("");
      setDueDate("");
      setExpanded(false); // collapse the optional fields after submission
    } finally {
      setSubmitting(false); // always re-enable the button
    }
  };

  return (
    // Outer card — warm white with a subtle sage left accent border
    <div className="bg-cream-50 border border-cream-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="px-6 pt-5 pb-3">
        <h2 className="font-display text-xl text-charcoal-800 font-bold">
          Add a New Task
        </h2>
        <p className="text-sm text-charcoal-700 opacity-60 mt-0.5">
          What needs to get done?
        </p>
      </div>

      {/* Form — uses onSubmit handler, no action attribute needed */}
      <form onSubmit={handleSubmit} noValidate className="px-6 pb-6 space-y-4">
        {/* Title field */}
        <div>
          <label
            htmlFor="task-title"
            className="block text-sm font-medium text-charcoal-800 mb-1"
          >
            Title <span className="text-red-400">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              // Clear the error as soon as the user starts typing
              if (titleError) setTitleError("");
            }}
            placeholder="e.g. Write the project proposal…"
            // Red border when there's a validation error, sage border otherwise
            className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white
              focus:outline-none focus:ring-2 transition-all
              ${titleError
                ? "border-red-400 focus:ring-red-200"        // error state
                : "border-cream-200 focus:ring-sage-400/30 focus:border-sage-500" // normal state
              }`}
          />
          {/* Inline validation message — only renders when there's an error */}
          {titleError && (
            <p className="text-red-500 text-xs mt-1">{titleError}</p>
          )}
        </div>

        {/* Toggle button to reveal optional fields */}
        <button
          type="button" // type="button" prevents accidental form submission
          onClick={() => setExpanded((prev) => !prev)}
          className="text-sm text-sage-600 hover:text-sage-700 font-medium flex items-center gap-1"
        >
          {/* Rotate the chevron icon to indicate expanded/collapsed state */}
          <span
            className={`inline-block transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
          {expanded ? "Hide details" : "Add description & due date"}
        </button>

        {/* Collapsible optional fields */}
        {expanded && (
          <div className="space-y-4 animate-slide-in">
            {/* Description textarea */}
            <div>
              <label
                htmlFor="task-desc"
                className="block text-sm font-medium text-charcoal-800 mb-1"
              >
                Description <span className="text-charcoal-700 opacity-50 font-normal">(optional)</span>
              </label>
              <textarea
                id="task-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details…"
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm
                  bg-white focus:outline-none focus:ring-2 focus:ring-sage-400/30
                  focus:border-sage-500 transition-all resize-none"
              />
            </div>

            {/* Due date picker */}
            <div>
              <label
                htmlFor="task-due"
                className="block text-sm font-medium text-charcoal-800 mb-1"
              >
                Due Date <span className="text-charcoal-700 opacity-50 font-normal">(optional)</span>
              </label>
              <input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm
                  bg-white focus:outline-none focus:ring-2 focus:ring-sage-400/30
                  focus:border-sage-500 transition-all"
              />
            </div>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting} // prevent double-clicking
          className="w-full py-2.5 bg-sage-500 hover:bg-sage-600 active:scale-[0.98]
            text-white font-semibold rounded-xl text-sm transition-all
            disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Adding…" : "Add Task"} {/* show loading text while submitting */}
        </button>
      </form>
    </div>
  );
}
