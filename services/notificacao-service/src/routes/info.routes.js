const express = require("express");
const router = express.Router();

router.get("/info", (req, res) => {
  res.json({
    servico: "notificacao-service",
    versao: "1.0.0",
    porta: 3004,
    descricao: "Responsável por enviar notificações aos usuários (e-mail, SMS, push, webhook).",
    rotas: [
      "GET  /health",
      "GET  /info",
      "POST /notificacoes/simular",
      "GET  /notificacoes",
    ],
    integracoesAtivas: [
      "Consome fila 'notificacao.pedido_criado' do RabbitMQ (exchange pedido.criado)",
      "Dead Letter Queue configurada (DLX: notificacao.dlx / DLQ: notificacao.dlq) com até 3 tentativas",
    ],
    integracoesFuturas: [
      "Consumir eventos de pagamento.aprovado para notificar confirmação ao cliente",
      "Integrar com provedores reais de e-mail (SendGrid, SES)",
    ],
  });
});

module.exports = router;
