const amqp = require("amqplib");
const { rabbitUrl } = require("../config/env");

let channel;

async function connectRabbit() {
  if (channel) return channel;
  const conn = await amqp.connect(rabbitUrl);
  channel = await conn.createChannel();
  return channel;
}
module.exports = { connectRabbit };
