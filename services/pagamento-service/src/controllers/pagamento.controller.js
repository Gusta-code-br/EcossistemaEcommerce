const pagamentosMock = require("../data/pagamentos.mock");

let contador = pagamentosMock.length + 1;

function simularPagamento(req, res) {
  const { pedidoId, valor, metodo } = req.body;

  // Simula aprovação com 80% de chance — sem consumir filas, sem chamar outros serviços
  const aprovado = Math.random() > 0.2;

  const registro = {
    transacaoId: `TXN-${String(contador++).padStart(5, "0")}`,
    pedidoId: pedidoId || "PED-DESCONHECIDO",
    valor: parseFloat(valor) || 0,
    metodo: metodo || "nao_informado",
    status: aprovado ? "aprovado" : "recusado",
    mensagem: aprovado
      ? "Pagamento simulado e aprovado (mock)"
      : "Pagamento simulado e recusado (mock)",
    processadoEm: new Date().toISOString(),
    aviso: "Resultado gerado em memória. Sem integração com mensageria nesta fase.",
  };

  pagamentosMock.push(registro);

  const statusHttp = aprovado ? 200 : 422;
  return res.status(statusHttp).json(registro);
}

function listarPagamentos(req, res) {
  return res.json({
    total: pagamentosMock.length,
    pagamentos: pagamentosMock,
    aviso: "Dados mockados em memória. Sem banco de dados nesta fase.",
  });
}

module.exports = { simularPagamento, listarPagamentos };
