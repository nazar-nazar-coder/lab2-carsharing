const PERMISSIONS = {
  client: ["create_booking", "cancel_own_booking", "view_cars"],
  admin: [
    "create_booking",
    "cancel_own_booking",
    "view_cars",
    "manage_cars",
    "manage_tariffs",
  ],
};

function hasPermission(role, permission) {
  return (
    Array.isArray(PERMISSIONS[role]) && PERMISSIONS[role].includes(permission)
  );
}

module.exports = { hasPermission, PERMISSIONS };
