const express = require("express");
const router = express.Router();
const estoqueController = require("../controllers/estoque.controller");

router.get("/estoque", estoqueController.listarEstoque);
router.get("/estoque/:id", estoqueController.buscarPorId);
router.get("/produtos/:id/disponibilidade", estoqueController.verificarDisponibilidade);

module.exports = router;
