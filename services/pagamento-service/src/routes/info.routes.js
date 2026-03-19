const express = require("express");
const router = express.Router();

router.get("/info", (req, res) => {
  res.json({
    servico: "pagamento-service",
    versao: "1.0.0",
    porta: 3003,
    descricao: "Responsável por processar e simular pagamentos.",
    rotas: [
      "GET  /health",
      "GET  /info",
      "POST /pagamentos/simular",
      "GET  /pagamentos",
    ],
    aviso: "Serviço isolado. Nenhuma integração com outros serviços foi implementada nesta fase.",
    integracoesFuturas: [
      "Consumir fila 'pedidos' do RabbitMQ para processar pagamentos",
      "Publicar evento pagamento.aprovado ou pagamento.recusado",
    ],
  });
});

module.exports = router;
