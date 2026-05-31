const express = require("express");
const router = express.Router();

router.get("/info", (req, res) => {
  res.json({
    servico: "estoque-service",
    versao: "1.0.0",
    porta: 3002,
    descricao: "Responsável por controlar a disponibilidade de produtos em estoque.",
    rotas: [
      "GET /health",
      "GET /info",
      "GET /estoque",
      "GET /estoque/:id",
      "GET /produtos/:id/disponibilidade",
    ],
    integracoesAtivas: [
      "Responde consultas de disponibilidade do checkout-service via HTTP",
    ],
    integracoesFuturas: [
      "Consumir eventos de pedidos para baixar estoque automaticamente",
      "Persistência em banco de dados",
    ],
  });
});

module.exports = router;
