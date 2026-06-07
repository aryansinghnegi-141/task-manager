/**
 * EmptyState
 * Displayed when the user has no tasks at all.
 * Provides an encouraging call-to-action pointing to the create form.
 * No props required — it's a purely presentational component.
 */
export default function EmptyState() {
  return (
    // Vertically centred content with generous padding
    <div className="text-center py-20 px-6">
      {/* Large clipboard emoji as the focal illustration */}
      <div className="text-7xl mb-5 animate-shimmer">📋</div>

      {/* Primary message in the display font for visual hierarchy */}
      <h3 className="font-display text-2xl font-bold text-charcoal-800 mb-2">
        No Tasks Yet
      </h3>

      {/* Secondary message with lighter weight */}
      <p className="text-sm text-charcoal-700 opacity-50 max-w-xs mx-auto leading-relaxed">
        Create your first task to get started. Use the form on the left to add
        something to your list.
      </p>

      {/* Decorative divider */}
      <div className="mt-8 flex items-center justify-center gap-2 text-charcoal-700 opacity-20">
        <span className="w-16 h-px bg-current block" />
        <span className="text-xs font-mono">START HERE</span>
        <span className="w-16 h-px bg-current block" />
      </div>
    </div>
  );
}
