import amqp from "amqplib";

const sendToQueue = async (queue, message) => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const exchange = "order";

  await channel.assertExchange(exchange, "direct", { durable: false });

  channel.publish(exchange, queue, Buffer.from(JSON.stringify(message)));

  console.log(`Message sent to ${queue}`);

  setTimeout(() => {
    connection.close();
  }, 500);
};

export { sendToQueue };
