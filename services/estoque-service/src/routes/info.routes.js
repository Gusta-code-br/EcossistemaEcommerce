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
    ],
    aviso: "Serviço isolado. Nenhuma integração com outros serviços foi implementada nesta fase.",
    integracoesFuturas: [
      "Receber chamadas do checkout-service para verificar disponibilidade",
      "Consumir eventos de pedidos para baixar estoque automaticamente",
    ],
  });
});

module.exports = router;
