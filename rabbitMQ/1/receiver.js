const amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", (err0, connection) => {
  if (err0) throw err0;

  connection.createChannel((err1, channel) => {
    if (err1) throw err1;

    const queue = "hello";

    channel.assertQueue(queue, { durable: false });

    console.log(` [*] Waiting for messages in ${queue}. To exit press CTRL+C`);

    channel.consume(
      queue,
      (msg) => console.log(` [x] Received ${msg.content.toString()}`),
      { noAck: true }
    );
  });
});
