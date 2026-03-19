const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    servico: "notificacao-service",
    porta: 3004,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
