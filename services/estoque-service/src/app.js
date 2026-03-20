const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");
const swaggerUi = require("swagger-ui-express");

const healthRoutes = require("./routes/health.routes");
const infoRoutes = require("./routes/info.routes");
const estoqueRoutes = require("./routes/estoque.routes");

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

const swaggerDoc = yaml.load(
  fs.readFileSync(path.join(__dirname, "../../../docs/openapi.yaml"), "utf8")
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use("/", healthRoutes);
app.use("/", infoRoutes);
app.use("/", estoqueRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada", servico: "estoque-service" });
});

app.listen(PORT, () => {
  console.log(`[estoque-service] Rodando na porta ${PORT}`);
  console.log(`[estoque-service] Swagger em http://localhost:${PORT}/api-docs`); // ← trocar o aviso por isso
});