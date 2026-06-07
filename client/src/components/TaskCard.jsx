// Import date utilities for formatting and overdue detection
import { formatDate, formatCreatedAt, isOverdue } from "../utils/dateUtils";

/**
 * TaskCard
 * Renders a single task as a styled card.
 * Supports completion toggle, edit, and delete actions.
 *
 * Props:
 *   task        — the task object { id, title, description, dueDate, completed, createdAt, order }
 *   onToggle    — called with (id) when the checkbox is clicked
 *   onEdit      — called with (task) when the edit button is clicked
 *   onDelete    — called with (task) when the delete button is clicked
 *   isDragging  — boolean passed by DnD; applies dragging styles when true
 *   dragHandle  — ref or props spread onto the drag handle element
 */
export default function TaskCard({ task, onToggle, onEdit, onDelete, isDragging, dragHandle }) {
  // Determine if this task is overdue (past due date AND not completed)
  const overdue = isOverdue(task.dueDate, task.completed);

  return (
    // Outer card wrapper
    // - Red left border + subtle red tint for overdue tasks
    // - Strikethrough / muted styling for completed tasks
    // - Shadow increases when being dragged (isDragging)
    <div
      className={`
        group relative bg-cream-50 rounded-2xl border transition-all duration-200
        ${isDragging ? "shadow-2xl rotate-1" : "shadow-sm hover:shadow-md"}
        ${overdue ? "border-red-300 bg-red-50/30" : "border-cream-200"}
        ${task.completed ? "opacity-70" : ""}
        animate-slide-in
      `}
    >
      {/* Overdue warning badge — shown at the top-right corner */}
      {overdue && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold
          px-2 py-0.5 rounded-full shadow-sm z-10">
          ⚠ OVERDUE
        </div>
      )}

      <div className="p-4 flex gap-3 items-start">
        {/* --- Drag Handle --- */}
        {/* Spread the dragHandle props from @hello-pangea/dnd onto this element */}
        <button
          {...dragHandle} // DnD library attaches event listeners here
          className="mt-1 text-charcoal-700 opacity-20 hover:opacity-50 cursor-grab
            active:cursor-grabbing transition-opacity touch-none"
          aria-label="Drag to reorder"
          tabIndex={-1} // exclude from tab focus (not a true action button)
        >
          {/* Six-dot drag handle icon */}
          ⠿
        </button>

        {/* --- Checkbox --- */}
        <button
          onClick={() => onToggle(task.id)} // toggle complete/incomplete
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
          className={`
            flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center
            transition-all duration-200
            ${task.completed
              ? "bg-sage-500 border-sage-500"   // filled sage circle when done
              : "border-gray-300 hover:border-sage-500" // empty circle when not done
            }
          `}
        >
          {/* Checkmark tick — only shown when completed */}
          {task.completed && (
            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6l3 3 5-5"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        {/* --- Task Content --- */}
        <div className="flex-1 min-w-0">
          {/* Title — strike-through when completed */}
          <h3
            className={`
              font-semibold text-sm leading-snug break-words
              ${task.completed
                ? "line-through text-charcoal-700 opacity-50" // muted + strikethrough
                : "text-charcoal-800"
              }
            `}
          >
            {task.title}
          </h3>

          {/* Description — only rendered if the task has one */}
          {task.description && (
            <p className="text-xs text-charcoal-700 opacity-60 mt-1 break-words leading-relaxed">
              {task.description}
            </p>
          )}

          {/* --- Metadata Row --- */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {/* Creation date */}
            <span className="font-mono text-[10px] text-charcoal-700 opacity-40">
              Created {formatCreatedAt(task.createdAt)}
            </span>

            {/* Due date badge — conditionally styled red if overdue */}
            {task.dueDate && (
              <span
                className={`font-mono text-[10px] font-medium px-2 py-0.5 rounded-full
                  ${overdue
                    ? "bg-red-100 text-red-600"      // red for overdue
                    : "bg-cream-200 text-charcoal-700 opacity-70" // neutral otherwise
                  }`}
              >
                Due {formatDate(task.dueDate)}
              </span>
            )}

            {/* Completion status badge */}
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                ${task.completed
                  ? "bg-sage-400/20 text-sage-600"   // green tint when done
                  : "bg-amber-100 text-amber-700"     // amber when active
                }`}
            >
              {task.completed ? "Completed" : "Active"}
            </span>
          </div>
        </div>

        {/* --- Action Buttons (Edit / Delete) --- */}
        {/* Hidden by default, fade in on card hover using Tailwind group utilities */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          {/* Edit button */}
          <button
            onClick={() => onEdit(task)} // pass full task object so modal can pre-fill fields
            aria-label="Edit task"
            className="p-1.5 rounded-lg text-charcoal-700 opacity-60 hover:opacity-100
              hover:bg-sage-400/20 hover:text-sage-700 transition-all"
          >
            {/* Pencil icon */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>

          {/* Delete button */}
          <button
            onClick={() => onDelete(task)} // open the confirmation dialog for this task
            aria-label="Delete task"
            className="p-1.5 rounded-lg text-charcoal-700 opacity-60 hover:opacity-100
              hover:bg-red-100 hover:text-red-600 transition-all"
          >
            {/* Trash icon */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
