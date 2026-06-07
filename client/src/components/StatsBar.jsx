/**
 * StatsBar
 * Displays aggregate counts: total tasks, active tasks, and completed tasks.
 * Updates automatically because it receives derived stats from the useTasks hook.
 *
 * Props:
 *   stats — { total: number, active: number, completed: number }
 */
export default function StatsBar({ stats }) {
  // Define each stat tile as data so the JSX stays DRY
  // emoji, label, value, colour class
  const tiles = [
    {
      emoji: "📋",
      label: "Total",
      value: stats.total,
      colour: "text-charcoal-800",     // neutral for total count
    },
    {
      emoji: "🔥",
      label: "Active",
      value: stats.active,
      colour: "text-amber-600",        // warm amber for active/in-progress
    },
    {
      emoji: "✅",
      label: "Completed",
      value: stats.completed,
      colour: "text-sage-600",         // sage green for completed
    },
  ];

  return (
    // Horizontal row of stat tiles
    <div className="grid grid-cols-3 gap-3">
      {tiles.map(({ emoji, label, value, colour }) => (
        <div
          key={label}
          className="bg-cream-50 border border-cream-200 rounded-2xl px-4 py-3
            text-center shadow-sm"
        >
          {/* Emoji icon */}
          <div className="text-xl mb-0.5">{emoji}</div>

          {/* Numeric count — large and bold for quick scanning */}
          <div className={`font-display text-2xl font-bold ${colour}`}>
            {value}
          </div>

          {/* Label */}
          <div className="text-xs text-charcoal-700 opacity-50 font-medium mt-0.5">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
