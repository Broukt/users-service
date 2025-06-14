const prisma = require('../database/prisma');
const { connectRabbit } = require('./connection');
const {
  userCreatedQueue,
  roleCreatedQueue,
  roleUpdatedQueue,
  roleDeletedQueue
} = require('../config/env');

async function consumeUserEvents() {
  const ch = await connectRabbit();
  await ch.assertQueue(userCreatedQueue, { durable: true });
  ch.consume(userCreatedQueue, async msg => {
    const data = JSON.parse(msg.content.toString());
    const exists = await prisma.user.findUnique({ where: { id: data.id } });
    if (!exists) {
      await prisma.user.create({ data });
    }
    ch.ack(msg);
  });
}

async function consumeRoleEvents() {
  const ch = await connectRabbit();
  await ch.assertQueue(roleCreatedQueue, { durable: true });
  await ch.assertQueue(roleUpdatedQueue, { durable: true });
  await ch.assertQueue(roleDeletedQueue, { durable: true });

  ch.consume(roleCreatedQueue, async msg => {
    const { id, name } = JSON.parse(msg.content.toString());
    const exists = await prisma.role.findUnique({ where: { id } });
    if (!exists) await prisma.role.create({ data: { id, name } });
    ch.ack(msg);
  });

  ch.consume(roleUpdatedQueue, async msg => {
    const { id, name } = JSON.parse(msg.content.toString());
    await prisma.role.update({ where: { id }, data: { name } });
    ch.ack(msg);
  });

  ch.consume(roleDeletedQueue, async msg => {
    const { id } = JSON.parse(msg.content.toString());
    await prisma.role.update({ where: { id }, data: { deletedAt: new Date() } });
    ch.ack(msg);
  });
}

module.exports = { consumeUserEvents, consumeRoleEvents };