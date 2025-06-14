const { connectRabbit } = require("./connection");
const { userUpdatedQueue, userDeletedQueue } = require("../config/env");

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
 * Publica un evento user.deleted con la información del usuario.
 * @param id - ID del usuario eliminado.
 * @param deletedAt - Fecha de eliminación del usuario.
 */
async function publishUserDeleted({ id, deletedAt }) {
  const ch = await connectRabbit(); 
  await ch.assertQueue(userDeletedQueue, { durable: true });
  const payload = JSON.stringify({ id, deletedAt });
  ch.sendToQueue(userDeletedQueue, Buffer.from(payload), { persistent: true });
}

module.exports = {
  publishUserUpdated,
  publishUserDeleted,
};
