const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/pedido.controller");

router.post("/pedidos", pedidoController.criarPedido);
router.get("/pedidos", pedidoController.listarPedidos);

module.exports = router;
