const express = require("express");
const router = express.Router();

router.get("/info", (req, res) => {
  res.json({
    servico: "checkout-service",
    versao: "1.0.0",
    porta: 3001,
    descricao: "Responsável por receber e registrar pedidos.",
    rotas: [
      "GET  /health",
      "GET  /info",
      "POST /pedidos",
      "GET  /pedidos",
      "GET  /circuit-breaker/status",
    ],
    integracoesAtivas: [
      "Consulta estoque-service via HTTP (com circuit breaker) antes de confirmar pedido",
      "Publica evento pedido.criado no RabbitMQ (exchange fanout, persistente)",
    ],
    integracoesFuturas: [
      "Publicar evento pagamento.recusado para compensação de estoque",
      "Persistência em banco de dados",
    ],
  });
});

module.exports = router;
