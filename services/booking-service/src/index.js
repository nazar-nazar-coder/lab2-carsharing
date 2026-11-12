const { createHealthServer } = require("../../common/server");
const server = createHealthServer("booking-service");

if (require.main === module) {
  server.listen(3001, () => console.log("booking-service listening on 3001"));
}

module.exports = { server };
