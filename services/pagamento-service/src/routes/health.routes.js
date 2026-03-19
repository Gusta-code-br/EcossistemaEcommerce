const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    servico: "pagamento-service",
    porta: 3003,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
