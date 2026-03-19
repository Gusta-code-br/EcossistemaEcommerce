// Pagamentos mockados em memória
// Sem banco de dados nesta fase

const pagamentosMock = [
  {
    transacaoId: "TXN-00001",
    pedidoId: "PED-0001",
    valor: 459.9,
    metodo: "cartao_credito",
    status: "aprovado",
    mensagem: "Pagamento simulado e aprovado (mock)",
    processadoEm: "2024-01-15T10:31:00.000Z",
    aviso: "Dado mockado — sem integração nesta fase",
  },
  {
    transacaoId: "TXN-00002",
    pedidoId: "PED-0002",
    valor: 1249.7,
    metodo: "pix",
    status: "aprovado",
    mensagem: "Pagamento simulado e aprovado (mock)",
    processadoEm: "2024-01-15T11:02:00.000Z",
    aviso: "Dado mockado — sem integração nesta fase",
  },
];

module.exports = pagamentosMock;
