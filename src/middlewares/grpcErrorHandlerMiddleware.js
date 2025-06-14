/**
 * Manejador global de errores gRPC: wrap de servicio
 */
function grpcErrorHandler(server) {
  process.on("uncaughtException", (err) => {
    console.error("Uncaught exception:", err);
    server.tryShutdown(() => process.exit(1));
  });
  process.on("unhandledRejection", (err) => {
    console.error("Unhandled rejection:", err);
    server.tryShutdown(() => process.exit(1));
  });
}

module.exports = { grpcErrorHandler };
