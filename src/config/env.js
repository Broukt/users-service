require("dotenv").config();

module.exports = {
  port: process.env.PORT || 50051,
  serverUrl: process.env.SERVER_URL || "0.0.0.0",
  rabbitUrl: process.env.RABBITMQ_URL || "amqp://localhost",
  userCreatedQueue: process.env.USER_CREATED_QUEUE || "user.created",
  userUpdatedQueue: process.env.USER_UPDATED_QUEUE || "user.updated",
  userDeletedQueue: process.env.USER_DELETED_QUEUE || "user.deleted",
  roleCreatedQueue: process.env.ROLE_CREATED_QUEUE || "role.created",
  roleUpdatedQueue: process.env.ROLE_UPDATED_QUEUE || "role.updated",
  roleDeletedQueue: process.env.ROLE_DELETED_QUEUE || "role.deleted",
};
