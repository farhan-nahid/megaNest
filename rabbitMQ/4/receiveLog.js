const amqp = require("amqplib");

async function receiveLog() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "logs";

    await channel.assertExchange(exchange, "fanout", { durable: false });
    const q = await channel.assertQueue("", { exclusive: true });

    channel.bindQueue(q.queue, exchange, "");

    console.log(` [*] Waiting for logs in ${exchange}. To exit press CTRL+C`);

    channel.consume(
      q.queue,
      (msg) => {
        console.log(` [x] ${msg.content.toString()}`);
      },
      { noAck: true }
    );
  } catch (error) {
    console.error(error);
  }
}

receiveLog();
