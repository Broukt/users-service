const grpc = require("@grpc/grpc-js");
const { updateUserSchema } = require("../validators/userValidatorsSchemas");

/**
 * Wraps a service method with Zod validation.
 * @param {Function} handler (call, callback) => void
 */
function validateUpdateUser(handler) {
  return (call, callback) => {
    const result = updateUserSchema.safeParse(call.request);
    if (!result.success) {
      const messages = result.error.errors.map(e => e.message).join("; ");
      return callback(
        { code: grpc.status.INVALID_ARGUMENT, message: messages },
        null
      );
    }
    return handler(call, callback);
  };
}

module.exports = { validateUpdateUser };