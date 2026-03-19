const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const infoRoutes = require("./routes/info.routes");
const pagamentoRoutes = require("./routes/pagamento.routes");

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

app.use("/", healthRoutes);
app.use("/", infoRoutes);
app.use("/", pagamentoRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada", servico: "pagamento-service" });
});

app.listen(PORT, () => {
  console.log(`[pagamento-service] Rodando na porta ${PORT}`);
  console.log(`[pagamento-service] AVISO: Serviço isolado — sem integrações nesta fase`);
});
