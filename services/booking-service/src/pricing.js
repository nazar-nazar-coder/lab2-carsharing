function calculateRentalCost({
  pricePerHour,
  pricePerDay,
  start,
  end,
  deposit = 0,
}) {
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  if (!(endMs > startMs)) {
    throw new RangeError("End of rental must be later than start");
  }
  const hours = Math.ceil((endMs - startMs) / 3600000);
  const days = Math.floor(hours / 24);
  const restHours = hours - days * 24;
  const restCost = Math.min(restHours * pricePerHour, pricePerDay);
  const rental = days * pricePerDay + (restHours > 0 ? restCost : 0);
  return { hours, rental, deposit, total: rental + deposit };
}

module.exports = { calculateRentalCost };
