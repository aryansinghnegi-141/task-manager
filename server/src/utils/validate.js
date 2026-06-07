/**
 * server/src/utils/validate.js
 *
 * Reusable pure-function validators shared across controllers.
 * Keeping validation logic here avoids duplicating it in every controller
 * and makes it trivial to unit test in isolation.
 */

/**
 * isNonEmptyString
 * Returns true only when the value is a string with at least one non-whitespace character.
 * Used to validate required text fields like `title`.
 *
 * @param {*} value - The value to check
 * @returns {boolean}
 *
 * @example
 * isNonEmptyString("Buy milk")  // true
 * isNonEmptyString("")          // false
 * isNonEmptyString("   ")      // false (whitespace only)
 * isNonEmptyString(null)        // false
 * isNonEmptyString(123)         // false (not a string)
 */
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * isValidDateString
 * Returns true when the value is a parseable date string.
 * Accepts ISO format (2024-12-31), datetime (2024-12-31T00:00:00Z), and most
 * formats understood by the Date constructor.
 *
 * Intentionally lenient — we trust the frontend's <input type="date"> to
 * produce well-formatted strings; this guards against truly malformed values.
 *
 * @param {*} value - The value to check
 * @returns {boolean}
 *
 * @example
 * isValidDateString("2024-12-31")       // true
 * isValidDateString("not-a-date")       // false
 * isValidDateString(null)               // false  ← null is explicitly invalid
 * isValidDateString(undefined)          // false
 * isValidDateString("")                 // false
 */
function isValidDateString(value) {
  if (!value || typeof value !== "string") return false; // rule out null/undefined/numbers
  const timestamp = Date.parse(value);                   // returns NaN for invalid strings
  return !isNaN(timestamp);                              // NaN → false, valid number → true
}

/**
 * validateTaskPayload
 * Validates the body of a create-task or update-task request.
 * Returns an array of human-readable error strings (empty = valid).
 *
 * @param {{ title?: any, description?: any, dueDate?: any }} body
 * @param {{ requireTitle?: boolean }} [options]
 *   requireTitle — set false for partial PUT updates where title is optional
 * @returns {string[]} Array of error messages; empty means no errors
 *
 * @example
 * validateTaskPayload({ title: "" })
 * // → ["Title is required and must be a non-empty string."]
 *
 * validateTaskPayload({ title: "Buy milk", dueDate: "bad" })
 * // → ["dueDate must be a valid date string (e.g. 2024-12-31)."]
 *
 * validateTaskPayload({ title: "Buy milk", dueDate: "2024-12-31" })
 * // → []
 */
function validateTaskPayload(body, { requireTitle = true } = {}) {
  const errors = []; // collect all validation errors before returning

  const { title, dueDate } = body;

  // --- Title ---
  if (requireTitle) {
    // Title is required on create; must be a non-empty string
    if (!isNonEmptyString(title)) {
      errors.push("Title is required and must be a non-empty string.");
    }
  } else if (title !== undefined) {
    // Title was provided in a partial update — it still can't be empty if present
    if (!isNonEmptyString(title)) {
      errors.push("Title must be a non-empty string.");
    }
  }

  // --- Due Date ---
  // The field is optional; only validate when it is explicitly provided and non-null/non-empty
  if (dueDate !== undefined && dueDate !== null && dueDate !== "") {
    if (!isValidDateString(dueDate)) {
      errors.push("dueDate must be a valid date string (e.g. 2024-12-31).");
    }
  }

  return errors; // empty array → payload is valid
}

// Export individual helpers for use in tests; export the combined validator for controllers
module.exports = { isNonEmptyString, isValidDateString, validateTaskPayload };
