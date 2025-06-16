const grpc = require("@grpc/grpc-js");
const prisma = require("../database/prisma");

/**
 * Asegura que el rol sea Administrador
 */
function grpcEnsureAdmin(handler) {
  return async (call, callback) => {
    console.log("Metadata:", call.metadata.getMap());
    const roles = call.metadata.get("x-user-role");
    const role = Array.isArray(roles) ? roles[0] : null;
    if (!role) {
      return callback(
        { code: grpc.status.UNAUTHENTICATED, message: "User role not found" },
        null
      );
    }

    const exists = await prisma.role.findUnique({
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

    // passed auth, call real handler
    return handler(call, callback);
  };
}

/**
 * Asegura que sea Admin o que el usuario sea el mismo (self)
 */
function grpcEnsureSelfOrAdmin(handler) {
  return async (call, callback) => {
    const roles = call.metadata.get("x-user-role");
    console.log("Roles:", roles);
    const role = Array.isArray(roles) ? roles[0] : null;
    const emails = call.metadata.get("x-user-email");
    console.log("Emails:", emails);
    const email = Array.isArray(emails) ? emails[0] : null;
    const ids = call.metadata.get("x-user-id");
    console.log("IDs:", ids);
    const id = Array.isArray(ids) ? ids[0] : null;
    const targetId = call.request.id;
    console.log("Target ID:", targetId);

    console.log("Metadata:", {
      role,
      email,
      id,
      targetId,
    });

    if (!role || !email || !id || !targetId) {
      return callback(
        {
          code: grpc.status.UNAUTHENTICATED,
          message: "User unauthenticated or missing metadata",
        },
        null
      );
    }

    const existingRole = await prisma.role.findUnique({
      where: { name: role },
    });
    if (!existingRole) {
      return callback(
        { code: grpc.status.UNAUTHENTICATED, message: "User role not found" },
        null
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email, id: id },
    });
    if (!existingUser) {
      return callback(
        { code: grpc.status.UNAUTHENTICATED, message: "User not found" },
        null
      );
    }

    const isSelf = existingUser.id === targetId;
    if (role === "Administrador" || isSelf) {
      return handler(call, callback);
    }

    return callback(
      { code: grpc.status.PERMISSION_DENIED, message: "Permission denied" },
      null
    );
  };
}

module.exports = { grpcEnsureAdmin, grpcEnsureSelfOrAdmin };
