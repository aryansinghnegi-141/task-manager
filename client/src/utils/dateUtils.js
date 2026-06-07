/**
 * formatDate
 * Formats an ISO date string into a human-readable format.
 * Uses the user's locale for natural presentation.
 *
 * @param {string|null} dateString - ISO date string, e.g. "2024-12-31T00:00:00.000Z"
 * @returns {string} Formatted date like "Dec 31, 2024" or "—" if no date
 */
export function formatDate(dateString) {
  if (!dateString) return "—"; // display a dash when no date is set

  const date = new Date(dateString);

  // Check for invalid dates (e.g. if the stored string is malformed)
  if (isNaN(date.getTime())) return "Invalid date";

  // Use the Intl API for locale-aware formatting
  // undefined locale = use the user's browser/OS locale automatically
  return date.toLocaleDateString(undefined, {
    year: "numeric",  // e.g. "2024"
    month: "short",   // e.g. "Dec"
    day: "numeric",   // e.g. "31"
  });
}

/**
 * formatRelativeDate
 * Returns a friendly relative time string for dates close to today.
 * Falls back to formatDate for dates further in the future.
 *
 * @param {string|null} dateString
 * @returns {string} e.g. "Today", "Tomorrow", "In 3 days", "Dec 31, 2024"
 */
export function formatRelativeDate(dateString) {
  if (!dateString) return "—";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date";

  // Compare using date-only values (strip the time component for a fair comparison)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // midnight today

  const target = new Date(date);
  target.setHours(0, 0, 0, 0); // midnight of the target date

  // Difference in whole days
  const diffMs = target.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  // Return friendly labels for nearby dates
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;

  // Fall back to absolute date for anything further away
  return formatDate(dateString);
}

/**
 * isOverdue
 * Determines if a task is overdue: has a due date in the past AND is not completed.
 *
 * @param {string|null} dueDate - ISO date string
 * @param {boolean} completed - Whether the task is already done
 * @returns {boolean}
 */
export function isOverdue(dueDate, completed) {
  if (!dueDate || completed) return false; // no due date or already done = not overdue

  const due = new Date(dueDate);
  due.setHours(23, 59, 59, 999); // treat the entire due-date day as valid

  // Overdue if the deadline has passed
  return due < new Date();
}

/**
 * formatCreatedAt
 * Formats the createdAt timestamp into a concise, readable string.
 *
 * @param {string} isoString - ISO 8601 timestamp
 * @returns {string} e.g. "Jun 5, 2024 at 14:32"
 */
export function formatCreatedAt(isoString) {
  if (!isoString) return "—";

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "—";

  // Format: "Jun 5, 2024"
  const datePart = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Format: "14:32" (24h) or "2:32 PM" depending on locale
  const timePart = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${datePart} at ${timePart}`;
}
