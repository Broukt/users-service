const { connectRabbit } = require("./connection");
const {
  userCreatedQueueAuth,
  userCreatedQueueBilling,
  userUpdatedQueue,
  userDeletedQueues,
  exchangeUserDeleted,
} = require("../config/env");

/**
 * Publica un evento user.created.auth con la información del usuario para el sistema de autenticación.
 * @param id - ID del usuario creado.
 * @param name - Nombre del usuario creado.
 * @param lastName - Apellido del usuario creado.
 * @param email - Email del usuario creado.
 * @param password - Contraseña del usuario creado (encriptada).
 * @param roleId - ID del rol del usuario creado.
 */

async function publishUserCreatedAuth({
  id,
  name,
  lastName,
  email,
  password,
  roleId,
}) {
  const ch = await connectRabbit();
  await ch.assertQueue(userCreatedQueueAuth, { durable: true });
  const payload = JSON.stringify({
    id,
    name,
    lastName,
    email,
    password,
    roleId,
  });
  ch.sendToQueue(userCreatedQueueAuth, Buffer.from(payload), {
    persistent: true,
  });
}

/**
 * Publica un evento user.created.billing con la información del usuario para el sistema de facturación.
 * @param id - ID del usuario creado.
 * @param email - Email del usuario creado.
 */
async function publishUserCreatedBilling({ id, email }) {
  const ch = await connectRabbit();
  await ch.assertQueue(userCreatedQueueBilling, { durable: true });
  const payload = JSON.stringify({ id, email });
  ch.sendToQueue(userCreatedQueueBilling, Buffer.from(payload), {
    persistent: true,
  });
}

/**
 * Publica un evento user.updated con la información actualizada de perfil del usuario.
 * @param email - Email actualizado del usuario.
 */
async function publishUserUpdated({ email }) {
  const ch = await connectRabbit();
  await ch.assertQueue(userUpdatedQueue, { durable: true });
  const payload = JSON.stringify({ email });
  ch.sendToQueue(userUpdatedQueue, Buffer.from(payload), { persistent: true });
}

/**
 * Publica un evento user.deleted en las colas correspondientes para notificar que un usuario ha sido eliminado.
 * Utiliza un exchange fanout para enviar el mensaje a todas las colas suscritas
 * @param id - ID del usuario eliminado.
 */
async function publishUserDeleted({ id }) {
  const ch = await connectRabbit();
  ch.assertExchange(exchangeUserDeleted, "fanout", { durable: true });
  userDeletedQueues.forEach((queue) => {
    ch.assertQueue(queue, { durable: true });
    ch.bindQueue(queue, exchangeUserDeleted, "");
  });
  const payload = Buffer.from(JSON.stringify({ id }));
  ch.publish(exchangeUserDeleted, "", payload, {
    persistent: true,
  });
}

module.exports = {
  publishUserCreatedAuth,
  publishUserCreatedBilling,
  publishUserUpdated,
  publishUserDeleted,
};
