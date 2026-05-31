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
    integracoesAtivas: [
      "Consome fila 'pagamento.pedido_criado' do RabbitMQ (exchange pedido.criado)",
    ],
    integracoesFuturas: [
      "Publicar evento pagamento.aprovado ou pagamento.recusado para o notificacao-service",
      "Persistência em banco de dados",
    ],
  });
});

module.exports = router;
