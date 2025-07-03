const { Server } = require("@grpc/grpc-js");
const {
  grpcErrorHandler,
} = require("./middlewares/grpcErrorHandlerMiddleware");
const loadProto = require("./utils/loadProto");
const userService = require("./services/userService");
const { validateUpdateUser } = require("./middlewares/grpcValidatorMiddleware");

const server = new Server();
const proto = loadProto("users");
server.addService(proto.Users.service, {
  CreateUser: userService.CreateUser,
  GetUser: userService.GetUser,
  UpdateUser: validateUpdateUser(userService.UpdateUser),
  DeleteUser: userService.DeleteUser,
  ListUsers: userService.ListUsers,
});

// Inicializa manejo global de errores y consumidores de RabbitMQ
grpcErrorHandler(server);

module.exports = server;
