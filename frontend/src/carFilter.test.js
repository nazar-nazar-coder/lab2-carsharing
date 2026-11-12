const test = require("node:test");
const assert = require("node:assert");
const { filterCars } = require("./carFilter");

const sample = [
  {
    id: 1,
    carClass: "economy",
    fuel: "petrol",
    transmission: "auto",
    pricePerHour: 100,
  },
  {
    id: 2,
    carClass: "suv",
    fuel: "diesel",
    transmission: "auto",
    pricePerHour: 250,
  },
  {
    id: 3,
    carClass: "economy",
    fuel: "electric",
    transmission: "auto",
    pricePerHour: 140,
  },
];

test("no filters returns all cars", () => {
  assert.strictEqual(filterCars(sample).length, 3);
});

test("filter by fuel", () => {
  assert.deepStrictEqual(
    filterCars(sample, { fuel: "diesel" }).map((c) => c.id),
    [2],
  );
});

test("filter by max price", () => {
  assert.deepStrictEqual(
    filterCars(sample, { maxPricePerHour: 150 }).map((c) => c.id),
    [1, 3],
  );
});

test("combined filters", () => {
  assert.deepStrictEqual(
    filterCars(sample, {
      carClass: "economy",
      fuel: "electric",
      maxPricePerHour: 150,
    }).map((c) => c.id),
    [3],
  );
});
