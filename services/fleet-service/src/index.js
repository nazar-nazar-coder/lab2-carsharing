const { createHealthServer } = require("../../common/server");
const server = createHealthServer("fleet-service");

if (require.main === module) {
  server.listen(3002, () => console.log("fleet-service listening on 3002"));
}

module.exports = { server };
