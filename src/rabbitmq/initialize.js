const { consumeUserEvents, consumeRoleEvents } = require("./consumer");

async function initializeConsumers() {
  try {
    await consumeUserEvents();
    await consumeRoleEvents();
    console.log("RabbitMQ consumers initialized successfully.");
  } catch (error) {
    console.error("Error initializing RabbitMQ consumers:", error);
  }
}

module.exports = initializeConsumers;
