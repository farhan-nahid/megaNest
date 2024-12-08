import { updateInventoryService } from "@/services";
import amqp from "amqplib";

const receiveFromQueue = async (queue, callback) => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const exchange = "order";

  await channel.assertExchange(exchange, "direct", { durable: false });

  const q = await channel.assertQueue(queue, { exclusive: true });

  channel.bindQueue(q.queue, exchange, queue);

  channel.consume(
    q.queue,
    (message) => {
      const content = message ? JSON.parse(message?.content?.toString()) : null;
      callback(content);
    },
    { noAck: true }
  );

  console.log(`Listening to ${queue}`);

  process.on("exit", () => {
    connection.close();
  });
};

receiveFromQueue("update-inventory", async (message) => {
  const data = JSON.parse(message);

  const payload = {
    id: data?.inventoryId,
    quantity: data?.quantity,
    actionType: data?.actionType,
  };

  await updateInventoryService(payload);
});
