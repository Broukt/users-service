const { catchGrpc } = require("../utils/catchGrpc");
const AppError = require("../utils/appError");
const prisma = require("../database/prisma");
const bcrypt = require("bcrypt");
const {
  publishUserCreatedAuth,
  publishUserCreatedBilling,
  publishUserUpdated,
  publishUserDeleted,
} = require("../rabbitmq/producer");
const { decodeJwt } = require("../utils/jwtUtils");

const CreateUser = catchGrpc(async (call, callback) => {
  const { name, lastName, email, password, role, token } = call.request;
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError("Email already in use", 400);
  }
  const existingRole = await prisma.role.findUnique({ where: { name: role } });
  if (!existingRole) {
    throw new AppError("Role not found", 404);
  }
  if (existingRole.name === "Administrador") {
    const requestorRole = decodeJwt(token).role;
    if (requestorRole !== "Administrador") {
      throw new AppError("Only admins can create admins", 403);
    }
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const createdUser = await prisma.user.create({
    data: {
      name,
      lastName,
      email,
      role: { connect: { id: existingRole.id } },
    },
    include: { role: true },
  });

  if (!createdUser) throw new AppError("User creation failed", 500);

  await publishUserCreatedAuth({
    id: createdUser.id,
    name,
    lastName,
    email,
    password: hashedPassword,
    roleId: existingRole.id,
  });
  await publishUserCreatedBilling({ id: createdUser.id, email});

  callback(null, {
    status: 201,
    data: createdUser,
  });
});

const GetUser = catchGrpc(async (call, callback) => {
  const { id, requestorId, requestorRole } = call.request;
  if (!id) throw new AppError("User ID required", 400);
  if (requestorRole !== "Administrador" && requestorId !== id) {
    throw new AppError("Unauthorized access", 403);
  }
  const user = await prisma.user.findUnique({
    where: { id },
    include: { role: true },
  });
  if (!user || user.deletedAt) throw new AppError("User not found", 404);
  callback(null, {
    status: 200,
    data: {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      role: user.role.name,
      createdAt: user.createdAt,
    },
  });
});
const UpdateUser = catchGrpc(async (call, callback) => {
  const { id, requestorRole, ...data } = call.request;
  if (requestorRole !== "Administrador") {
    throw new AppError("Only admins can update users", 403);
  }
  if (!id) throw new AppError("User ID required", 400);
  if (Object.keys(data).length === 0) {
    throw new AppError("No data provided for update", 400);
  }
  if (data.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser && existingUser.id !== id) {
      throw new AppError("Email already in use", 400);
    }
  }
  const updated = await prisma.user.update({
    where: { id, deletedAt: null },
    data,
    include: { role: true },
  });
  if (!updated) throw new AppError("User not found", 404);
  await publishUserUpdated({ email: updated.email });
  callback(null, {
    status: 200,
    data: {
      id: updated.id,
      name: updated.name,
      lastName: updated.lastName,
      email: updated.email,
      role: updated.role,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    },
  });
});
const DeleteUser = catchGrpc(async (call, callback) => {
  const { id, requestorRole } = call.request;
  if (requestorRole !== "Administrador") {
    throw new AppError("Only admins can delete users", 403);
  }
  if (!id) throw new AppError("User ID required", 400);
  await prisma.user.update({ where: { id }, data: { deletedAt: new Date() } });
  await publishUserDeleted({ id });
  callback(null, {
    status: 204,
  });
});
const ListUsers = catchGrpc(async (call, callback) => {
  const { emailFilter, nameFilter, lastNameFilter, requestorRole } =
    call.request;
  if (requestorRole !== "Administrador") {
    throw new AppError("Only admins can list users", 403);
  }
  const users = await prisma.user.findMany({
    where: {
      deletedAt: null,
      email: { contains: emailFilter || "" },
      name: { contains: nameFilter || "" },
      lastName: { contains: lastNameFilter || "" },
    },
    include: { role: true },
  });
  if (users.length === 0) throw new AppError("No users found", 404);
  callback(null, { status: 200, data: users });
});

module.exports = {
  CreateUser,
  GetUser,
  UpdateUser,
  DeleteUser,
  ListUsers,
};
