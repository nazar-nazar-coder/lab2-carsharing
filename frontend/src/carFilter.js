function filterCars(
  cars,
  { carClass, fuel, transmission, maxPricePerHour } = {},
) {
  return cars.filter((car) => {
    if (carClass && car.carClass !== carClass) return false;
    if (fuel && car.fuel !== fuel) return false;
    if (transmission && car.transmission !== transmission) return false;
    if (maxPricePerHour !== undefined && car.pricePerHour > maxPricePerHour)
      return false;
    return true;
  });
}

module.exports = { filterCars };
