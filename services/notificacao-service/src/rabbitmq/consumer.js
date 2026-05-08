const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";

const EXCHANGE     = "pedido.criado";
const QUEUE        = "notificacao.pedido_criado";
const DLX          = "notificacao.dlx";
const DLQ          = "notificacao.dlq";
const MAX_RETRIES  = parseInt(process.env.NOTIFICACAO_MAX_RETRIES || "3", 10);

// Contador de tentativas por mensagem (chave = conteúdo JSON do pedido)
const tentativas = new Map();

async function iniciarConsumidor() {
  try {
    const conn = await amqp.connect(RABBITMQ_URL);
    const channel = await conn.createChannel();

    // 1. DLX e DLQ — mensagens que esgotaram tentativas chegam aqui
    await channel.assertExchange(DLX, "fanout", { durable: true });
    await channel.assertQueue(DLQ, { durable: true });
    await channel.bindQueue(DLQ, DLX, "");

    // 2. Exchange principal e fila principal com DLX configurado
    await channel.assertExchange(EXCHANGE, "fanout", { durable: true });
    await channel.assertQueue(QUEUE, {
      durable: true,
      arguments: { "x-dead-letter-exchange": DLX },
    });
    await channel.bindQueue(QUEUE, EXCHANGE, "");

    // Processa uma mensagem por vez — facilita o controle de retries
    channel.prefetch(1);

    console.log(`[notificacao] Aguardando eventos — fila: ${QUEUE} | DLQ: ${DLQ} | MAX_RETRIES: ${MAX_RETRIES}`);

    channel.consume(QUEUE, async (msg) => {
      if (!msg) return;

      const chave = msg.content.toString();
      const tentativa = (tentativas.get(chave) || 0) + 1;
      tentativas.set(chave, tentativa);

      let pedido;
      try {
        pedido = JSON.parse(chave);
      } catch {
        console.error("[notificacao] Mensagem malformada — enviando para DLQ imediatamente");
        tentativas.delete(chave);
        channel.nack(msg, false, false);
        return;
      }

      console.log(`[notificacao] Processando pedido ${pedido.id} — tentativa ${tentativa}/${MAX_RETRIES}`);

      try {
        await enviarNotificacao(pedido, tentativa);
        tentativas.delete(chave);
        channel.ack(msg);
      } catch (err) {
        console.error(`[notificacao] Falha na tentativa ${tentativa}/${MAX_RETRIES}:`, err.message);

        if (tentativa >= MAX_RETRIES) {
          console.warn(`[notificacao] MAX_RETRIES atingido para pedido ${pedido.id} — movendo para DLQ`);
          tentativas.delete(chave);
          channel.nack(msg, false, false); // rejeita sem requeue → vai para DLX → DLQ
        } else {
          channel.nack(msg, false, true); // rejeita e recoloca na fila para nova tentativa
        }
      }
    });
  } catch (err) {
    console.error("[notificacao] Falha ao conectar no RabbitMQ:", err.message);
    setTimeout(iniciarConsumidor, 5000);
  }
}

async function enviarNotificacao(pedido, tentativa) {
  // Simula falha aleatória com 40% de chance — para demonstrar o DLQ
  if (Math.random() < 0.4) {
    throw new Error(`Falha simulada ao enviar notificação (tentativa ${tentativa})`);
  }

  console.log(`[notificacao] E-mail enviado para ${pedido.email || pedido.cliente}:`);
  console.log(`  Pedido: ${pedido.id} | Total: R$ ${pedido.total} | Itens: ${pedido.itens?.length || 0}`);
}

module.exports = { iniciarConsumidor };
