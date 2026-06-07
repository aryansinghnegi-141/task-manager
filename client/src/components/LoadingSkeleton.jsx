/**
 * LoadingSkeleton
 * Displays placeholder skeleton cards while the initial data fetch is in progress.
 * Using a skeleton loader instead of a spinner gives the user a sense of the
 * upcoming layout and reduces perceived load time.
 *
 * Props:
 *   count — number of skeleton cards to render (defaults to 3)
 */
export default function LoadingSkeleton({ count = 3 }) {
  // Create an array of the desired length to map over
  // Array.from is cleaner than new Array(n).fill() for rendering purposes
  const skeletons = Array.from({ length: count });

  return (
    <div className="space-y-3">
      {skeletons.map((_, index) => (
        // Each skeleton card mimics the height and shape of a real TaskCard
        <div
          key={index} // index as key is fine here; the list is static
          className="bg-cream-50 border border-cream-200 rounded-2xl p-4
            flex gap-3 items-start animate-shimmer"
          // Stagger the animation delay so skeletons pulse in sequence
          style={{ animationDelay: `${index * 0.15}s` }}
        >
          {/* Placeholder for the drag handle */}
          <div className="w-4 h-4 bg-cream-200 rounded-full mt-1 flex-shrink-0" />

          {/* Placeholder for the completion checkbox */}
          <div className="w-5 h-5 bg-cream-200 rounded-full mt-0.5 flex-shrink-0" />

          {/* Placeholder for the task content area */}
          <div className="flex-1 space-y-2">
            {/* Title line — wider to represent a heading */}
            <div className="h-3.5 bg-cream-200 rounded-full w-3/4" />
            {/* Description line — shorter */}
            <div className="h-3 bg-cream-200 rounded-full w-1/2 opacity-60" />
            {/* Metadata row */}
            <div className="flex gap-2 mt-1">
              <div className="h-2.5 bg-cream-200 rounded-full w-24 opacity-50" />
              <div className="h-2.5 bg-cream-200 rounded-full w-16 opacity-50" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
