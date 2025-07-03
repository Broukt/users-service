require("dotenv").config();

module.exports = {
  port: process.env.PORT || 50051,
  serverUrl: process.env.SERVER_URL || "0.0.0.0",
  rabbitUrl: process.env.RABBITMQ_URL || "amqp://localhost",
  userCreatedQueueAuth:
    process.env.USER_CREATED_QUEUE_AUTH || "user.created.auth",
  userCreatedQueueBilling:
    process.env.USER_CREATED_QUEUE_BILLING || "user.created.billing",
  userUpdatedQueue: process.env.USER_UPDATED_QUEUE || "user.updated",
  userDeletedQueues: [
    process.env.USER_DELETED_QUEUE_AUTH || "user.deleted.auth",
    process.env.USER_DELETED_QUEUE_BILLING || "user.deleted.billing",
  ],
  exchangeUserDeleted:
    process.env.EXCHANGE_USER_DELETED || "exchange.user.deleted",
};
