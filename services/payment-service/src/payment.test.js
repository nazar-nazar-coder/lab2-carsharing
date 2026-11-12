const test = require("node:test");
const assert = require("node:assert");
const { server } = require("./index");

test("payment-service: GET /health returns 200 and service name", async () => {
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const res = await fetch(`http://127.0.0.1:${port}/health`);
  const body = await res.json();
  server.close();
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(body, { status: "ok", service: "payment-service" });
});
