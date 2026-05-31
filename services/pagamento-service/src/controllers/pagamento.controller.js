const pagamentosMock = require("../data/pagamentos.mock");

let contador = pagamentosMock.length + 1;

function simularPagamento(req, res) {
  const { pedidoId, valor, metodo } = req.body;

  if (!pedidoId) {
    return res.status(400).json({ erro: "Campo 'pedidoId' é obrigatório." });
  }
  const valorNumerico = parseFloat(valor);
  if (!valor || isNaN(valorNumerico) || valorNumerico <= 0) {
    return res.status(400).json({ erro: "Campo 'valor' deve ser um número positivo." });
  }

  console.log(`[pagamento] Simulando pagamento — pedidoId: ${pedidoId} | valor: R$ ${valorNumerico} | metodo: ${metodo || "nao_informado"}`);

  const aprovado = Math.random() > 0.2;

  const registro = {
    transacaoId: `TXN-${String(contador++).padStart(5, "0")}`,
    pedidoId,
    valor: valorNumerico,
    metodo: metodo || "nao_informado",
    status: aprovado ? "aprovado" : "recusado",
    mensagem: aprovado
      ? "Pagamento simulado e aprovado (mock)"
      : "Pagamento simulado e recusado (mock)",
    processadoEm: new Date().toISOString(),
    aviso: "Resultado gerado em memória. Sem integração com mensageria nesta fase.",
  };

  pagamentosMock.push(registro);
  console.log(`[pagamento] Transação ${registro.transacaoId} — pedido ${pedidoId}: ${registro.status}`);

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
