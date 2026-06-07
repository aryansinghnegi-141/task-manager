/**
 * Frontend Component Tests
 * Uses Vitest + @testing-library/react to render components in a jsdom environment
 * and assert on their rendered output and interactions.
 */
import { render, screen, fireEvent } from "@testing-library/react";

// ─────────────────────────────────────────────
// StatsBar
// ─────────────────────────────────────────────
import StatsBar from "../components/StatsBar";

describe("StatsBar", () => {
  it("shows the correct total count", () => {
    render(<StatsBar stats={{ total: 5, active: 3, completed: 2 }} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("shows the correct active count", () => {
    render(<StatsBar stats={{ total: 10, active: 7, completed: 3 }} />);
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("shows the correct completed count", () => {
    render(<StatsBar stats={{ total: 10, active: 7, completed: 3 }} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders all three labels", () => {
    render(<StatsBar stats={{ total: 0, active: 0, completed: 0 }} />);
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────
// FilterBar
// ─────────────────────────────────────────────
import FilterBar from "../components/FilterBar";

describe("FilterBar", () => {
  // Helper: render FilterBar with sensible defaults and an overrideable onFilterChange
  const renderFilter = (overrides = {}) =>
    render(
      <FilterBar
        filter="all"
        onFilterChange={vi.fn()}
        searchQuery=""
        onSearchChange={vi.fn()}
        {...overrides}
      />
    );

  it("renders All, Active, and Completed tabs", () => {
    renderFilter();
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("calls onFilterChange('completed') when Completed is clicked", () => {
    const spy = vi.fn();
    renderFilter({ onFilterChange: spy });
    fireEvent.click(screen.getByText("Completed"));
    expect(spy).toHaveBeenCalledWith("completed");
  });

  it("calls onFilterChange('active') when Active is clicked", () => {
    const spy = vi.fn();
    renderFilter({ onFilterChange: spy });
    fireEvent.click(screen.getByText("Active"));
    expect(spy).toHaveBeenCalledWith("active");
  });

  it("renders the search input with placeholder text", () => {
    renderFilter();
    expect(screen.getByPlaceholderText("Search tasks…")).toBeInTheDocument();
  });

  it("calls onSearchChange when user types in search box", () => {
    const spy = vi.fn();
    renderFilter({ onSearchChange: spy });
    fireEvent.change(screen.getByPlaceholderText("Search tasks…"), {
      target: { value: "grocery" },
    });
    expect(spy).toHaveBeenCalledWith("grocery");
  });
});

// ─────────────────────────────────────────────
// ProgressBar
// ─────────────────────────────────────────────
import ProgressBar from "../components/ProgressBar";

describe("ProgressBar", () => {
  it("renders a progressbar role", () => {
    render(<ProgressBar completed={2} total={4} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("sets aria-valuenow to the correct percentage", () => {
    render(<ProgressBar completed={1} total={4} />);
    // 1/4 = 25%
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "25");
  });

  it("shows 0 when total is 0 (no division by zero)", () => {
    render(<ProgressBar completed={0} total={0} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("shows 100 when all tasks are complete", () => {
    render(<ProgressBar completed={5} total={5} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });
});

// ─────────────────────────────────────────────
// EmptyState
// ─────────────────────────────────────────────
import EmptyState from "../components/EmptyState";

describe("EmptyState", () => {
  it("renders the heading text", () => {
    render(<EmptyState />);
    expect(screen.getByText("No Tasks Yet")).toBeInTheDocument();
  });

  it("renders the call-to-action copy", () => {
    render(<EmptyState />);
    expect(screen.getByText(/create your first task/i)).toBeInTheDocument();
  });
});

// ─────────────────────────────────────────────
// dateUtils unit tests
// ─────────────────────────────────────────────
import { formatDate, isOverdue } from "../utils/dateUtils";

describe("dateUtils", () => {
  describe("formatDate", () => {
    it("returns '—' for null", () => {
      expect(formatDate(null)).toBe("—");
    });
    it("returns a non-empty string for a valid date", () => {
      const result = formatDate("2024-06-15");
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
      expect(result).not.toBe("—");
    });
  });

  describe("isOverdue", () => {
    it("returns false when task is completed", () => {
      // Completed tasks are never considered overdue regardless of date
      expect(isOverdue("2020-01-01", true)).toBe(false);
    });
    it("returns false when no dueDate", () => {
      expect(isOverdue(null, false)).toBe(false);
    });
    it("returns true for a past due date on an incomplete task", () => {
      expect(isOverdue("2020-01-01", false)).toBe(true);
    });
    it("returns false for a future due date", () => {
      expect(isOverdue("2099-12-31", false)).toBe(false);
    });
  });
});
