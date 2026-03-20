const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
const EXCHANGE = "pedido.criado";
const QUEUE = "pagamento.pedido_criado";

async function iniciarConsumidor() {
  try {
    const conn = await amqp.connect(RABBITMQ_URL);
    const channel = await conn.createChannel();

    await channel.assertExchange(EXCHANGE, "fanout", { durable: true });
    await channel.assertQueue(QUEUE, { durable: true });
    await channel.bindQueue(QUEUE, EXCHANGE, "");

    console.log(`[pagamento] Aguardando eventos na fila: ${QUEUE}`);

    channel.consume(QUEUE, (msg) => {
      if (!msg) return;

      try {
        const pedido = JSON.parse(msg.content.toString());
        processarPagamento(pedido);
        channel.ack(msg);
      } catch (err) {
        console.error("[pagamento] Erro ao processar mensagem:", err.message);
        channel.nack(msg, false, false);
      }
    });
  } catch (err) {
    console.error("[pagamento] Falha ao conectar no RabbitMQ:", err.message);
    setTimeout(iniciarConsumidor, 5000);
  }
}

function processarPagamento(pedido) {
  const aprovado = Math.random() > 0.2;
  const status = aprovado ? "aprovado" : "recusado";
  console.log(`[pagamento] Pedido ${pedido.id} — pagamento ${status} (valor: R$ ${pedido.total})`);
}

module.exports = { iniciarConsumidor };
