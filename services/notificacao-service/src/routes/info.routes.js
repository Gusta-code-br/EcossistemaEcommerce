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
    aviso: "Serviço isolado. Nenhuma integração com outros serviços foi implementada nesta fase.",
    integracoesFuturas: [
      "Consumir fila 'notificacoes' do RabbitMQ",
      "Implementar Dead Letter Queue (DLQ) para reprocessamento de falhas",
      "Integrar com provedores reais de e-mail (SendGrid, SES)",
    ],
  });
});

module.exports = router;
