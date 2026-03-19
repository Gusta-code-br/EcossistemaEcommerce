const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const infoRoutes = require("./routes/info.routes");
const estoqueRoutes = require("./routes/estoque.routes");

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

app.use("/", healthRoutes);
app.use("/", infoRoutes);
app.use("/", estoqueRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada", servico: "estoque-service" });
});

app.listen(PORT, () => {
  console.log(`[estoque-service] Rodando na porta ${PORT}`);
  console.log(`[estoque-service] AVISO: Serviço isolado — sem integrações nesta fase`);
});
