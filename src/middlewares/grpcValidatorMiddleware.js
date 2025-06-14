const {
  updateUserSchema,
  validate,
} = require("../validators/userValidatorsSchemas");
function validateUpdateUser(call, callback, next) {
  try {
    validate(updateUserSchema, call.request);
    next();
  } catch (err) {
    callback(
      { code: grpc.status.INVALID_ARGUMENT, message: err.message },
      null
    );
  }
}
module.exports = { validateUpdateUser };
