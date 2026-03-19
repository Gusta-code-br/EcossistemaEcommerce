const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const infoRoutes = require("./routes/info.routes");
const notificacaoRoutes = require("./routes/notificacao.routes");

const app = express();
const PORT = 3004;

app.use(cors());
app.use(express.json());

app.use("/", healthRoutes);
app.use("/", infoRoutes);
app.use("/", notificacaoRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada", servico: "notificacao-service" });
});

app.listen(PORT, () => {
  console.log(`[notificacao-service] Rodando na porta ${PORT}`);
  console.log(`[notificacao-service] AVISO: Serviço isolado — sem integrações nesta fase`);
});
