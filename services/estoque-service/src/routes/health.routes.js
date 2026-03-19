const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    servico: "estoque-service",
    porta: 3002,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
