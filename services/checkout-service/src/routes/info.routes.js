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
    ],
    aviso: "Serviço isolado. Nenhuma integração com outros serviços foi implementada nesta fase.",
    integracoesFuturas: [
      "Consultar estoque-service antes de confirmar pedido",
      "Publicar evento pedido.criado no RabbitMQ",
    ],
  });
});

module.exports = router;
