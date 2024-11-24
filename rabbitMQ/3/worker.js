const amqp = require("amqplib");

async function worker() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "task_queue";
    await channel.assertQueue(queue, { durable: false });
    channel.prefetch(1);

    console.log(` [*] Waiting for messages in ${queue}. To exit press CTRL+C`);

    channel.consume(
      queue,
      (msg) => {
        const exit = process.argv.slice(2).join(" ") || "Hello World!";
        console.log(`exit ${exit}`);

        if (exit === "exit") {
          console.log(" [x] Exiting...");
          setTimeout(() => {
            connection.close();
            process.exit(0);
          }, 500);
        }

        const secs = msg.content.toString().split(".").length - 1;

        console.log(` [x] Received ${msg.content.toString()}`);
        setTimeout(() => {
          console.log(" [x] Done");
          channel.ack(msg);
        }, secs * 1000);
      },
      { noAck: false }
    );
  } catch (error) {
    console.error(error);
  }
}

worker();
