const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/ecommerce",
});

pool.on("connect", () => {
  console.log("[pagamento] Banco de dados conectado");
});

pool.on("error", (err) => {
  console.error("[pagamento] Erro no banco de dados:", err.message);
});

module.exports = pool;
