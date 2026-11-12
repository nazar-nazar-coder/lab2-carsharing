const test = require("node:test");
const assert = require("node:assert");
const { periodsOverlap, hasConflict } = require("./overlap");
const { server } = require("./index");

test("booking-service: GET /health returns 200 and service name", async () => {
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const res = await fetch(`http://127.0.0.1:${port}/health`);
  const body = await res.json();
  server.close();
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(body, { status: "ok", service: "booking-service" });
});

test("overlapping periods are detected", () => {
  assert.strictEqual(
    periodsOverlap(
      { start: "2026-06-01T10:00:00Z", end: "2026-06-01T14:00:00Z" },
      { start: "2026-06-01T12:00:00Z", end: "2026-06-01T16:00:00Z" },
    ),
    true,
  );
});

test("adjacent periods do not overlap", () => {
  assert.strictEqual(
    periodsOverlap(
      { start: "2026-06-01T10:00:00Z", end: "2026-06-01T12:00:00Z" },
      { start: "2026-06-01T12:00:00Z", end: "2026-06-01T14:00:00Z" },
    ),
    false,
  );
});

test("conflict with an active booking is detected", () => {
  const existing = [
    {
      status: "confirmed",
      start: "2026-06-01T10:00:00Z",
      end: "2026-06-01T14:00:00Z",
    },
  ];
  assert.strictEqual(
    hasConflict(existing, {
      start: "2026-06-01T13:00:00Z",
      end: "2026-06-01T15:00:00Z",
    }),
    true,
  );
});

test("cancelled booking does not block the car", () => {
  const existing = [
    {
      status: "cancelled",
      start: "2026-06-01T10:00:00Z",
      end: "2026-06-01T14:00:00Z",
    },
  ];
  assert.strictEqual(
    hasConflict(existing, {
      start: "2026-06-01T11:00:00Z",
      end: "2026-06-01T13:00:00Z",
    }),
    false,
  );
});
