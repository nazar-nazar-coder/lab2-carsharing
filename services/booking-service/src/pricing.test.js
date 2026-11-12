const test = require("node:test");
const assert = require("node:assert");
const { calculateRentalCost } = require("./pricing");

const tariff = { pricePerHour: 100, pricePerDay: 1500, deposit: 2000 };

test("hourly rental: 3 hours = 300 + deposit", () => {
  const r = calculateRentalCost({
    ...tariff,
    start: "2026-06-01T10:00:00Z",
    end: "2026-06-01T13:00:00Z",
  });
  assert.deepStrictEqual(r, {
    hours: 3,
    rental: 300,
    deposit: 2000,
    total: 2300,
  });
});

test("partial hour is rounded up", () => {
  const r = calculateRentalCost({
    ...tariff,
    start: "2026-06-01T10:00:00Z",
    end: "2026-06-01T11:10:00Z",
  });
  assert.strictEqual(r.hours, 2);
  assert.strictEqual(r.rental, 200);
});

test("long hourly rental is capped by daily price", () => {
  const r = calculateRentalCost({
    ...tariff,
    start: "2026-06-01T08:00:00Z",
    end: "2026-06-02T06:00:00Z",
  });
  assert.strictEqual(r.hours, 22);
  assert.strictEqual(r.rental, 1500);
});

test("two days and 5 hours", () => {
  const r = calculateRentalCost({
    ...tariff,
    start: "2026-06-01T00:00:00Z",
    end: "2026-06-03T05:00:00Z",
  });
  assert.strictEqual(r.rental, 2 * 1500 + 500);
});

test("end before start throws RangeError", () => {
  assert.throws(
    () =>
      calculateRentalCost({
        ...tariff,
        start: "2026-06-01T12:00:00Z",
        end: "2026-06-01T10:00:00Z",
      }),
    RangeError,
  );
});
