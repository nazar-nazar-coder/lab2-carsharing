const test = require("node:test");
const assert = require("node:assert");
const { canTransition } = require("./status");
const { server } = require("./index");

test("fleet-service: GET /health returns 200 and service name", async () => {
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const res = await fetch(`http://127.0.0.1:${port}/health`);
  const body = await res.json();
  server.close();
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(body, { status: "ok", service: "fleet-service" });
});

test("available car can be booked", () => {
  assert.strictEqual(canTransition("available", "booked"), true);
});

test("booked car can become rented", () => {
  assert.strictEqual(canTransition("booked", "rented"), true);
});

test("car under maintenance cannot be booked directly", () => {
  assert.strictEqual(canTransition("maintenance", "booked"), false);
});

test("unknown status is rejected", () => {
  assert.strictEqual(canTransition("unknown", "available"), false);
});
