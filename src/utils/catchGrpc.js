const grpc = require("@grpc/grpc-js");
const { toGrpcError } = require("./grpcUtils");
function catchGrpc(fn) {
  return async (call, callback) => {
    try {
      await fn(call, callback);
    } catch (err) {
      const errObj = err.isOperational
        ? toGrpcError(err)
        : { code: grpc.status.INTERNAL, message: "Internal server error" };
      callback(errObj, null);
    }
  };
}
module.exports = { catchGrpc };
