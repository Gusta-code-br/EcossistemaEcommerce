const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    servico: "checkout-service",
    porta: 3001,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
