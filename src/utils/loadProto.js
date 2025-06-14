const protoLoader = require("@grpc/proto-loader");
const { loadPackageDefinition } = require("@grpc/grpc-js");
const path = require("path");
function loadProto(name) {
  const def = protoLoader.loadSync(
    path.join(__dirname, "../protos", `${name}.proto`),
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    }
  );
  return loadPackageDefinition(def)[name];
}
module.exports = loadProto;
