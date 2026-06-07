/**
 * FilterBar
 * Renders the All / Active / Completed filter tab buttons and the search input.
 * Filtering and searching are applied together in the parent's useTasks hook.
 *
 * Props:
 *   filter        — currently active filter: "all" | "active" | "completed"
 *   onFilterChange — called with the new filter string when a tab is clicked
 *   searchQuery   — current search string
 *   onSearchChange — called with the new search string as the user types
 */
export default function FilterBar({ filter, onFilterChange, searchQuery, onSearchChange }) {
  // The three filter options — defined as data so the JSX stays DRY
  const filters = [
    { value: "all",       label: "All" },
    { value: "active",    label: "Active" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* --- Filter Tabs --- */}
      <div className="flex gap-1 bg-cream-200 rounded-xl p-1 flex-shrink-0">
        {filters.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onFilterChange(value)} // notify parent of filter change
            className={`
              px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150
              ${filter === value
                // Active tab: white pill with shadow and sage text
                ? "bg-white shadow-sm text-sage-600 font-semibold"
                // Inactive tab: transparent, charcoal text
                : "text-charcoal-700 opacity-60 hover:opacity-100"
              }
            `}
            aria-pressed={filter === value} // accessibility: communicate current selection
          >
            {label}
          </button>
        ))}
      </div>

      {/* --- Search Input --- */}
      {/* Relative wrapper for positioning the search icon absolutely inside the input */}
      <div className="relative flex-1">
        {/* Search icon — decorative, not interactive */}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-700 opacity-30 text-sm">
          🔍
        </span>

        <input
          type="search"      // type="search" adds a native clear button on some browsers
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)} // update parent state on every keystroke
          placeholder="Search tasks…"
          aria-label="Search tasks by title"
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-cream-200 bg-cream-50
            text-sm text-charcoal-800 placeholder:text-charcoal-700 placeholder:opacity-30
            focus:outline-none focus:ring-2 focus:ring-sage-400/30 focus:border-sage-500
            transition-all"
        />
      </div>
    </div>
  );
}
