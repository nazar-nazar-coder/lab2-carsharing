const ACTIVE_STATUSES = ["pending_payment", "confirmed", "active"];

function periodsOverlap(a, b) {
  return (
    new Date(a.start) < new Date(b.end) && new Date(b.start) < new Date(a.end)
  );
}

function hasConflict(existingBookings, period) {
  return existingBookings.some(
    (b) => ACTIVE_STATUSES.includes(b.status) && periodsOverlap(b, period),
  );
}

module.exports = { periodsOverlap, hasConflict, ACTIVE_STATUSES };
