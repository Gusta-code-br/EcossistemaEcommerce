// Pedidos mockados iniciais — armazenamento em memória
// Sem banco de dados nesta fase

const pedidosMock = [
  {
    id: "PED-0001",
    cliente: "Maria Souza",
    email: "maria@exemplo.com",
    itens: [
      { produtoId: "prod-001", nome: "Teclado Mecânico RGB Pro", quantidade: 1, preco: 459.9 },
    ],
    status: "criado",
    total: 459.9,
    criadoEm: "2024-01-15T10:30:00.000Z",
    aviso: "Dado mockado — sem integração nesta fase",
  },
  {
    id: "PED-0002",
    cliente: "Carlos Lima",
    email: "carlos@exemplo.com",
    itens: [
      { produtoId: "prod-003", nome: "Mouse Gamer Sem Fio", quantidade: 2, preco: 349.9 },
      { produtoId: "prod-005", nome: "SSD NVMe 1TB Gen4", quantidade: 1, preco: 549.9 },
    ],
    status: "criado",
    total: 1249.7,
    criadoEm: "2024-01-15T11:00:00.000Z",
    aviso: "Dado mockado — sem integração nesta fase",
  },
];

module.exports = pedidosMock;
