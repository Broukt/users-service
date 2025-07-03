function catchGrpc(fn) {
  return async (call, callback) => {
    try {
      await fn(call, callback);
    } catch (err) {
      const errObj = err.isOperational
        ? { code: err.statusCode, details: err.message }
        : { code: 500, details: "Internal server error" };
      callback(errObj, null);
    }
  };
}
module.exports = { catchGrpc };
