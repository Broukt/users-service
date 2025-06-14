const grpc = require("@grpc/grpc-js");
const prisma = require("../database/prisma");

/**
 * Asegura que el rol sea Administrador
 */
function grpcEnsureAdmin(call, callback, next) {
  const roles = call.metadata.get("user-role");
  const role = Array.isArray(roles) ? roles[0] : null;
  if (!role) {
    return callback(
      { code: grpc.status.UNAUTHENTICATED, message: "User role not found" },
      null
    );
  }
  const exists = prisma.role.findUnique({
    where: { name: role },
  });
  if (!exists) {
    return callback(
      { code: grpc.status.UNAUTHENTICATED, message: "User role not found" },
      null
    );
  }
  if (role !== "Administrador") {
    return callback(
      { code: grpc.status.PERMISSION_DENIED, message: "Permission denied" },
      null
    );
  }
  next();
}

/**
 * Asegura que sea Admin o que el usuario sea el mismo (self)
 */
function grpcEnsureSelfOrAdmin(call, callback, next) {
  const roles = call.metadata.get("user-role");
  const role = Array.isArray(roles) ? roles[0] : null;
  const email = call.metadata.get("user-email");
  const requestedEmail = Array.isArray(email) ? email[0] : null;
  const targetId = call.request.id;
  if (!role || !requestedEmail || !targetId) {
    return callback(
      {
        code: grpc.status.UNAUTHENTICATED,
        message: "User role or ID not found",
      },
      null
    );
  }
  const existingRole = prisma.role.findUnique({
    where: { name: role },
  });
  if (!existingRole) {
    return callback(
      { code: grpc.status.UNAUTHENTICATED, message: "User role not found" },
      null
    );
  }
  const existingUser = prisma.user.findUnique({
    where: {},
  });
  if (!existingUser) {
    return callback(
      { code: grpc.status.UNAUTHENTICATED, message: "User not found" },
      null
    );
  }
  if (role === "Administrador" || existingUser.id === targetId) {
    return next();
  }
  callback(
    { code: grpc.status.PERMISSION_DENIED, message: "Permission denied" },
    null
  );
}

module.exports = { grpcEnsureAdmin, grpcEnsureSelfOrAdmin };
