const { Server } = require("@grpc/grpc-js");
const initializeConsumers = require("./rabbitmq/initialize");
const {
  grpcErrorHandler,
} = require("./middlewares/grpcErrorHandlerMiddleware");
const loadProto = require("./utils/loadProto");
const userService = require("./services/userService");
const { validateUpdateUser } = require("./middlewares/grpcValidatorMiddleware");
const {
  grpcEnsureAdmin,
  grpcEnsureSelfOrAdmin,
} = require("./middlewares/grpcAuthMiddleware");

const server = new Server();
const proto = loadProto("users");
server.addService(proto.Users.service, {
  GetUser: grpcEnsureSelfOrAdmin(userService.GetUser),
  UpdateUser: validateUpdateUser(userService.UpdateUser),
  DeleteUser: grpcEnsureAdmin(userService.DeleteUser),
  ListUsers: grpcEnsureAdmin(userService.ListUsers),
});

// Inicializa manejo global de errores y consumidores de RabbitMQ
grpcErrorHandler(server);
initializeConsumers().then(() => console.log("🐇 Consumers ready"));

module.exports = server;
