const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const infoRoutes = require("./routes/info.routes");
const pedidoRoutes = require("./routes/pedido.routes");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Rotas
app.use("/", healthRoutes);
app.use("/", infoRoutes);
app.use("/", pedidoRoutes);

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada", servico: "checkout-service" });
});

app.listen(PORT, () => {
  console.log(`[checkout-service] Rodando na porta ${PORT}`);
  console.log(`[checkout-service] AVISO: Serviço isolado — sem integrações nesta fase`);
});
