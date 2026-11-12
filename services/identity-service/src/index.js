const { createHealthServer } = require("../../common/server");
const server = createHealthServer("identity-service");

if (require.main === module) {
  server.listen(3003, () => console.log("identity-service listening on 3003"));
}

module.exports = { server };
