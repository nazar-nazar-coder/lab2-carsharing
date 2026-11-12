const TRANSITIONS = {
  available: ["booked", "maintenance"],
  booked: ["rented", "available"],
  rented: ["available", "maintenance"],
  maintenance: ["available"],
};

function canTransition(from, to) {
  return Array.isArray(TRANSITIONS[from]) && TRANSITIONS[from].includes(to);
}

module.exports = { canTransition, TRANSITIONS };
