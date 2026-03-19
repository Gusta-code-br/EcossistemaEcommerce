const express = require("express");
const router = express.Router();
const notificacaoController = require("../controllers/notificacao.controller");

router.post("/notificacoes/simular", notificacaoController.simularNotificacao);
router.get("/notificacoes", notificacaoController.listarNotificacoes);

module.exports = router;
