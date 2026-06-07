// TasksPage owns the two-column layout and wires all task UI together.
// App.jsx renders this page; if the app ever grows to multiple routes,
// each route would render its own page component from this pages/ directory.

// Import the central state hook
import { useTasks } from "../hooks/useTasks";

// Import all UI components used on this page
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import FilterBar from "../components/FilterBar";
import StatsBar from "../components/StatsBar";
import EditModal from "../components/EditModal";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import Notification from "../components/Notification";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ProgressBar from "../components/ProgressBar";

/**
 * TasksPage
 * The single page of this application.
 * Keeps App.jsx thin (just shell + header) by owning all task-related UI here.
 */
export default function TasksPage() {
  // Pull everything from the central hook — no prop drilling needed
  const {
    filteredTasks,   // tasks after filter + search
    tasks,           // unfiltered list (used to compute totals / empty state)
    loading,         // true during initial fetch
    error,           // error string or null
    filter,          // "all" | "active" | "completed"
    searchQuery,     // current search string
    editingTask,     // task open in EditModal (null = closed)
    deletingTask,    // task queued for deletion (null = closed)
    notification,    // success toast text (null = hidden)
    stats,           // { total, active, completed }
    setFilter,
    setSearchQuery,
    setEditingTask,
    setDeletingTask,
    setError,
    handleCreate,
    handleUpdate,
    handleToggle,
    handleDelete,
    handleReorder,
  } = useTasks();

  return (
    <>
      {/* ---- Error banner ---- */}
      {/* Full-width banner beneath the sticky header when an API error occurs */}
      {error && (
        <div
          role="alert" // accessibility: screen readers announce this immediately
          className="bg-red-50 border-b border-red-200 text-red-700 text-sm
            px-4 sm:px-6 py-3 flex items-center justify-between"
        >
          <span>⚠️ {error}</span>
          {/* Dismiss button clears the error from state */}
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 font-bold text-lg leading-none ml-4"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* ---- Completion progress bar ---- */}
      {/* Only shown when at least one task exists */}
      {tasks.length > 0 && (
        <ProgressBar completed={stats.completed} total={stats.total} />
      )}

      {/* ---- Main two-column grid ---- */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stacks on mobile, side-by-side on lg+ screens */}
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">

          {/* ---- Left sidebar: create form + statistics ---- */}
          <aside className="space-y-6">
            {/* Task creation form — calls handleCreate on submit */}
            <TaskForm onCreate={handleCreate} />

            {/* Live stat tiles: Total / Active / Completed */}
            <StatsBar stats={stats} />
          </aside>

          {/* ---- Right content: filter bar + task list ---- */}
          <section className="space-y-4" aria-label="Task list">
            {/* Filter tabs (All / Active / Completed) and search input */}
            <FilterBar
              filter={filter}
              onFilterChange={setFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* Loading state: skeleton cards while the first fetch is in flight */}
            {loading ? (
              <LoadingSkeleton count={3} />
            ) : (
              // Drag-and-drop enabled task list
              <TaskList
                tasks={filteredTasks}          // already filtered by tab + search
                allEmpty={tasks.length === 0}  // true → show the EmptyState illustration
                onToggle={handleToggle}
                onEdit={setEditingTask}        // opens EditModal with this task
                onDelete={setDeletingTask}     // opens DeleteConfirmDialog for this task
                onReorder={handleReorder}
                filter={filter}               // passed to "no results" message
              />
            )}
          </section>
        </div>
      </main>

      {/* ---- Modals (fixed-position, rendered over everything) ---- */}

      {/* Edit task modal — mounts when editingTask is set */}
      <EditModal
        task={editingTask}
        onSave={handleUpdate}
        onClose={() => setEditingTask(null)}
      />

      {/* Delete confirmation dialog — mounts when deletingTask is set */}
      <DeleteConfirmDialog
        task={deletingTask}
        onConfirm={handleDelete}
        onCancel={() => setDeletingTask(null)}
      />

      {/* Auto-dismissing success toast */}
      <Notification message={notification} />
    </>
  );
}
