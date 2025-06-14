const { Server } = require("@grpc/grpc-js");
const initializeConsumers = require("./rabbitmq/initialize");
const { grpcErrorHandler } = require("./middlewares/grpcErrorHandlerMiddleware");
const loadProto = require("./utils/loadProto");
const userService = require("./services/userService");

const server = new Server();
const proto = loadProto("users");
server.addService(proto.Users.service, userService);

// Inicializa manejo global de errores y consumidores de RabbitMQ
grpcErrorHandler(server);
initializeConsumers().then(() => console.log("🐇 Consumers ready"));

module.exports = server;
