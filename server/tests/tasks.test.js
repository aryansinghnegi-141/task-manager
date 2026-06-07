/**
 * Task API Integration Tests
 * Uses supertest to make real HTTP requests against the Express app
 * without binding to a port — fast, no port conflicts.
 */
const request = require("supertest");
const app = require("../src/index");

// ─────────────────────────────────────────────
// Task CRUD API
// ─────────────────────────────────────────────
describe("Task API", () => {
  // Shared ID so create → toggle → update → delete flows in order
  let createdTaskId;

  // ── CREATE ──────────────────────────────────
  describe("POST /api/tasks", () => {
    it("creates a task with valid title", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ title: "Test Task", description: "A description", dueDate: null });

      expect(res.statusCode).toBe(201);          // 201 Created
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("Test Task");
      expect(res.body.data.completed).toBe(false);  // all tasks start incomplete
      expect(typeof res.body.data.id).toBe("string"); // UUID assigned

      createdTaskId = res.body.data.id; // save for subsequent tests
    });

    it("rejects an empty title with 400", async () => {
      const res = await request(app).post("/api/tasks").send({ title: "" });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/title/i); // message mentions "title"
    });

    it("rejects a whitespace-only title", async () => {
      const res = await request(app).post("/api/tasks").send({ title: "   " });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("rejects an invalid dueDate", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ title: "Has bad date", dueDate: "not-a-date" });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/dueDate/i);
    });

    it("accepts a valid dueDate", async () => {
      const res = await request(app)
        .post("/api/tasks")
        .send({ title: "Has good date", dueDate: "2027-01-01" });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.dueDate).toBe("2027-01-01");

      // Clean up the extra task so it doesn't affect later tests
      await request(app).delete(`/api/tasks/${res.body.data.id}`);
    });
  });

  // ── READ ────────────────────────────────────
  describe("GET /api/tasks", () => {
    it("returns an array of tasks", async () => {
      const res = await request(app).get("/api/tasks");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  // ── TOGGLE ──────────────────────────────────
  describe("PATCH /api/tasks/:id/toggle", () => {
    it("flips completed from false to true", async () => {
      if (!createdTaskId) return;

      const res = await request(app).patch(`/api/tasks/${createdTaskId}/toggle`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.completed).toBe(true); // was false, now true
    });

    it("flips completed back to false on second toggle", async () => {
      if (!createdTaskId) return;

      const res = await request(app).patch(`/api/tasks/${createdTaskId}/toggle`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.completed).toBe(false); // toggled back
    });

    it("returns 404 for unknown id", async () => {
      const res = await request(app).patch("/api/tasks/ghost-id/toggle");

      expect(res.statusCode).toBe(404);
    });
  });

  // ── UPDATE ──────────────────────────────────
  describe("PUT /api/tasks/:id", () => {
    it("updates the title", async () => {
      if (!createdTaskId) return;

      const res = await request(app)
        .put(`/api/tasks/${createdTaskId}`)
        .send({ title: "Updated Title" });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.title).toBe("Updated Title");
    });

    it("returns 404 for non-existent task", async () => {
      const res = await request(app)
        .put("/api/tasks/does-not-exist")
        .send({ title: "Ghost Task" });

      expect(res.statusCode).toBe(404);
    });
  });

  // ── REORDER ─────────────────────────────────
  describe("PATCH /api/tasks/reorder", () => {
    it("accepts a valid reorder payload", async () => {
      if (!createdTaskId) return;

      const res = await request(app)
        .patch("/api/tasks/reorder")
        .send({ tasks: [{ id: createdTaskId, order: 0 }] });

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("rejects a non-array payload", async () => {
      const res = await request(app)
        .patch("/api/tasks/reorder")
        .send({ tasks: "not-an-array" });

      expect(res.statusCode).toBe(400);
    });
  });

  // ── DELETE ──────────────────────────────────
  describe("DELETE /api/tasks/:id", () => {
    it("deletes an existing task", async () => {
      if (!createdTaskId) return;

      const res = await request(app).delete(`/api/tasks/${createdTaskId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("returns 404 for already-deleted task", async () => {
      if (!createdTaskId) return;

      const res = await request(app).delete(`/api/tasks/${createdTaskId}`);

      expect(res.statusCode).toBe(404); // already gone
    });
  });
});

// ─────────────────────────────────────────────
// Validation utility unit tests
// ─────────────────────────────────────────────
const { isNonEmptyString, isValidDateString, validateTaskPayload } = require("../src/utils/validate");

describe("validate utils", () => {
  describe("isNonEmptyString", () => {
    it("returns true for a real string", () => expect(isNonEmptyString("hello")).toBe(true));
    it("returns false for empty string", () => expect(isNonEmptyString("")).toBe(false));
    it("returns false for whitespace", () => expect(isNonEmptyString("   ")).toBe(false));
    it("returns false for null", () => expect(isNonEmptyString(null)).toBe(false));
    it("returns false for number", () => expect(isNonEmptyString(42)).toBe(false));
  });

  describe("isValidDateString", () => {
    it("accepts ISO date", () => expect(isValidDateString("2024-12-31")).toBe(true));
    it("rejects garbage", () => expect(isValidDateString("not-a-date")).toBe(false));
    it("rejects null", () => expect(isValidDateString(null)).toBe(false));
    it("rejects empty string", () => expect(isValidDateString("")).toBe(false));
  });

  describe("validateTaskPayload", () => {
    it("returns no errors for a valid payload", () => {
      expect(validateTaskPayload({ title: "Buy milk" })).toHaveLength(0);
    });
    it("returns an error when title is missing", () => {
      expect(validateTaskPayload({ title: "" })).toHaveLength(1);
    });
    it("returns an error for a bad dueDate", () => {
      expect(validateTaskPayload({ title: "ok", dueDate: "bad" })).toHaveLength(1);
    });
    it("skips title check when requireTitle is false", () => {
      expect(validateTaskPayload({ dueDate: null }, { requireTitle: false })).toHaveLength(0);
    });
  });
});

// ─────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────
describe("Health endpoint", () => {
  it("GET /health returns 200", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
