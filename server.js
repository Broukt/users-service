require("dotenv").config();
const server = require("./src/app");
const { port, serverUrl } = require("./src/config/env");
const { ServerCredentials } = require("@grpc/grpc-js");

server.bindAsync(
  `${serverUrl}:${port}`,
  ServerCredentials.createInsecure(),
  (err, bindPort) => {
    if (err) {
      console.error("Error binding server:", err);
      process.exit(1);
    }
    console.log(`🚀 gRPC User Service listening at ${serverUrl}:${bindPort}`);
  }
);
