/**
 * Notification
 * A brief auto-dismissing toast message shown at the bottom of the screen.
 * Appears when tasks are created, updated, or deleted.
 *
 * Props:
 *   message — the text to display (renders null when message is falsy)
 */
export default function Notification({ message }) {
  // Render nothing when there's no active message
  if (!message) return null;

  return (
    // Fixed positioning: bottom-centre of the viewport
    // z-60 keeps it above modals (z-50) if they're both present
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60]
        bg-charcoal-800 text-white text-sm font-medium
        px-5 py-3 rounded-full shadow-xl
        animate-slide-in whitespace-nowrap"
      role="status"        // accessibility: live region for screen readers
      aria-live="polite"   // screen reader announces this when content changes
    >
      {message}
    </div>
  );
}
