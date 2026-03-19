const express = require("express");
const router = express.Router();
const pagamentoController = require("../controllers/pagamento.controller");

router.post("/pagamentos/simular", pagamentoController.simularPagamento);
router.get("/pagamentos", pagamentoController.listarPagamentos);

module.exports = router;
