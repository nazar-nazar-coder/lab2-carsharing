const test = require("node:test");
const assert = require("node:assert");
const { hasPermission } = require("./roles");
const { server } = require("./index");

test("identity-service: GET /health returns 200 and service name", async () => {
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const res = await fetch(`http://127.0.0.1:${port}/health`);
  const body = await res.json();
  server.close();
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(body, { status: "ok", service: "identity-service" });
});

test("client can create bookings", () => {
  assert.strictEqual(hasPermission("client", "create_booking"), true);
});

test("client cannot manage cars", () => {
  assert.strictEqual(hasPermission("client", "manage_cars"), false);
});

test("admin can manage tariffs", () => {
  assert.strictEqual(hasPermission("admin", "manage_tariffs"), true);
});

test("unknown role has no permissions", () => {
  assert.strictEqual(hasPermission("guest", "view_cars"), false);
});
