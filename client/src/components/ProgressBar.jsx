/**
 * ProgressBar
 * Displays a thin animated bar showing what percentage of tasks are complete.
 * Positioned just below the sticky header so it's always visible.
 *
 * Props:
 *   completed — number of completed tasks
 *   total     — total number of tasks
 */
export default function ProgressBar({ completed, total }) {
  // Avoid division by zero; clamp between 0 and 100 for safety
  const percentage = total === 0 ? 0 : Math.min(100, Math.round((completed / total) * 100));

  // When everything is done, use a celebratory gold colour instead of sage
  const allDone = percentage === 100;

  return (
    // Wrapper bar: full width, subtle background, sits flush under the header border
    <div
      className="w-full bg-cream-200 h-1.5"
      role="progressbar"               // accessibility: identifies this as a progress indicator
      aria-valuenow={percentage}       // current value for screen readers
      aria-valuemin={0}                // minimum possible value
      aria-valuemax={100}              // maximum possible value
      aria-label={`${percentage}% of tasks completed`} // human-readable label
    >
      {/* Filled portion — width driven by the computed percentage */}
      <div
        className={`
          h-full rounded-r-full transition-all duration-700 ease-out
          ${allDone
            ? "bg-amber-400"   // gold when 100% complete — rewarding visual feedback
            : "bg-sage-500"    // sage green during normal progress
          }
        `}
        style={{ width: `${percentage}%` }} // inline style for precise percentage width
      />
    </div>
  );
}
