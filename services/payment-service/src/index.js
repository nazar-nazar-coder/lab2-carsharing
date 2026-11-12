const { createHealthServer } = require("../../common/server");
const server = createHealthServer("payment-service");

if (require.main === module) {
  server.listen(3004, () => console.log("payment-service listening on 3004"));
}

module.exports = { server };
