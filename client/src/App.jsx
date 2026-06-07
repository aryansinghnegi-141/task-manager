// App.jsx is the application shell — it renders the sticky header and
// delegates all page content to TasksPage, keeping this file thin.
// If more routes are ever added, a router would live here.

// Import the main page component from the pages/ directory
import TasksPage from "./pages/TasksPage";

/**
 * App
 * Top-level shell: sticky header + the TasksPage content area.
 * All task state and UI logic lives inside TasksPage and its children.
 */
export default function App() {
  return (
    // Root wrapper — full viewport height, cream background, body font applied globally
    <div className="min-h-screen bg-cream-100 font-body">

      {/* ====== STICKY HEADER ====== */}
      {/* Stays at the top while the user scrolls the task list */}
      <header className="bg-cream-50 border-b border-cream-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

          {/* Brand mark */}
          <div>
            {/* App name in the display (serif) font for personality */}
            <h1 className="font-display text-2xl font-bold text-charcoal-800 leading-none">
              Taskr
            </h1>
            {/* Sub-label in mono font for a developer-friendly aesthetic */}
            <p className="text-[10px] text-charcoal-700 opacity-40 font-mono tracking-widest uppercase mt-0.5">
              Personal Task Manager
            </p>
          </div>

          {/* Right-side header controls */}
          <div className="flex items-center gap-3">
            {/* Keyboard shortcut hint — hidden on very small screens */}
            <span className="hidden sm:inline text-[11px] text-charcoal-700 opacity-30 font-mono">
              Press <kbd className="bg-cream-200 px-1 py-0.5 rounded text-[10px]">Esc</kbd> to close modals
            </span>

            {/* Decorative brand pill */}
            <div className="bg-sage-400/20 text-sage-700 text-xs font-semibold px-3 py-1.5 rounded-full select-none">
              ✦ Taskr
            </div>
          </div>
        </div>
      </header>

      {/* ====== PAGE CONTENT ====== */}
      {/* TasksPage owns the error banner, progress bar, layout grid, modals and toast */}
      <TasksPage />
    </div>
  );
}
