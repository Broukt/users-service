const grpc = require("@grpc/grpc-js");
function toGrpcError(err) {
  let code;
  switch (err.statusCode) {
    case 400:
      code = grpc.status.INVALID_ARGUMENT;
      break;
    case 401:
      code = grpc.status.UNAUTHENTICATED;
      break;
    case 403:
      code = grpc.status.PERMISSION_DENIED;
      break;
    case 404:
      code = grpc.status.NOT_FOUND;
      break;
    default:
      code = grpc.status.INTERNAL;
  }
  return { code, message: err.message };
}
module.exports = { toGrpcError };
