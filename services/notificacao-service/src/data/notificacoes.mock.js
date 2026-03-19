// Notificações mockadas em memória
// Sem banco de dados nesta fase

const notificacoesMock = [
  {
    notificacaoId: "NOT-00001",
    canal: "email",
    tipo: "pedido.criado",
    destinatario: "maria@exemplo.com",
    conteudo: "Seu pedido PED-0001 foi criado com sucesso!",
    status: "simulado",
    enviadoEm: "2024-01-15T10:31:30.000Z",
    aviso: "Dado mockado — sem integração nesta fase",
  },
  {
    notificacaoId: "NOT-00002",
    canal: "email",
    tipo: "pagamento.aprovado",
    destinatario: "carlos@exemplo.com",
    conteudo: "Seu pagamento de R$ 1249.70 foi aprovado!",
    status: "simulado",
    enviadoEm: "2024-01-15T11:03:00.000Z",
    aviso: "Dado mockado — sem integração nesta fase",
  },
];

module.exports = notificacoesMock;
