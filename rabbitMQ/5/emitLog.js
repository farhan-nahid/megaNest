const amqp = require("amqplib");

async function emitLog() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "direct_logs";
    const args = process.argv.slice(2);

    console.log("Args ", args);

    const msg = process.argv.slice(2).join(" ") || "Hello World!";
    const severity = args.length > 0 ? args[0] : "info";

    channel.assertExchange(exchange, "direct", { durable: false });
    channel.publish(exchange, severity, Buffer.from(msg));

    console.log(` [x] Sent ${msg}`);
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
  }
}
