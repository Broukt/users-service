const { catchGrpc } = require("../utils/catchGrpc");
const AppError = require("../utils/appError");
const prisma = require("../database/prisma");
const {
  publishUserUpdated,
  publishUserDeleted,
} = require("../rabbitmq/publisher");
const { validate } = require("../validators/userValidatorsSchemas");

const GetUser = catchGrpc(async (call, callback) => {
  const { id } = call.request;
  if (!id) throw new AppError("User ID required", 400);
  const user = await prisma.user.findUnique({
    where: { id },
    include: { role: true },
  });
  if (!user || user.deletedAt) throw new AppError("User not found", 404);
  callback(null, { user });
});
const UpdateUser = catchGrpc(async (call, callback) => {
  const { id, ...data } = call.request;
  const updated = await prisma.user.update({
    where: { id },
    data,
    include: { role: true },
  });
  await publishUserUpdated({ email: updated.email });
  callback(null, { user: updated });
});
const DeleteUser = catchGrpc(async (call, callback) => {
  const { id } = call.request;
  if (!id) throw new AppError("User ID required", 400);
  await prisma.user.update({ where: { id }, data: { deletedAt: new Date() } });
  await publishUserDeleted({ id, deletedAt: new Date() });
  callback(null, {});
});
const ListUsers = catchGrpc(async (call, callback) => {
  const { emailFilter, nameFilter, lastNameFilter } = call.request;
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
  callback(null, { users });
});

module.exports = {
  GetUser,
  UpdateUser,
  DeleteUser,
  ListUsers,
};
