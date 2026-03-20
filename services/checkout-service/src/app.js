const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");
const swaggerUi = require("swagger-ui-express");

const healthRoutes = require("./routes/health.routes");
const infoRoutes = require("./routes/info.routes");
const pedidoRoutes = require("./routes/pedido.routes");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const swaggerDoc = yaml.load(
  fs.readFileSync(path.join(__dirname, "../../../docs/openapi.yaml"), "utf8")
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

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
  console.log(`[checkout-service] Swagger em http://localhost:${PORT}/api-docs`); // ← atualizar
});