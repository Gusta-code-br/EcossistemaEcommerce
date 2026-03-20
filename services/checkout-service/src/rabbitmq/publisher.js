const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
const EXCHANGE = "pedido.criado";

let channel = null;

async function conectar() {
  try {
    const conn = await amqp.connect(RABBITMQ_URL);
    channel = await conn.createChannel();
    await channel.assertExchange(EXCHANGE, "fanout", { durable: true });
    console.log(`[checkout] RabbitMQ conectado — exchange: ${EXCHANGE}`);
  } catch (err) {
    console.error("[checkout] Falha ao conectar no RabbitMQ:", err.message);
    setTimeout(conectar, 5000);
  }
}

function publicarPedidoCriado(pedido) {
  if (!channel) {
    console.warn("[checkout] Canal RabbitMQ indisponível — evento não publicado");
    return;
  }
  channel.publish(EXCHANGE, "", Buffer.from(JSON.stringify(pedido)), { persistent: true });
  console.log(`[checkout] Evento publicado: pedido.criado — ${pedido.id}`);
}

module.exports = { conectar, publicarPedidoCriado };
