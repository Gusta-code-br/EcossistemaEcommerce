// Estoque mockado em memória
// Sem banco de dados nesta fase

const estoqueMock = [
  { produtoId: "prod-001", nome: "Teclado Mecânico RGB Pro",    quantidade: 14, reservado: 0, disponivel: 14 },
  { produtoId: "prod-002", nome: "Monitor Ultrawide 34\"",       quantidade: 5,  reservado: 0, disponivel: 5  },
  { produtoId: "prod-003", nome: "Mouse Gamer Sem Fio",          quantidade: 22, reservado: 2, disponivel: 20 },
  { produtoId: "prod-004", nome: "Headset 7.1 Surround",         quantidade: 0,  reservado: 0, disponivel: 0  },
  { produtoId: "prod-005", nome: "SSD NVMe 1TB Gen4",            quantidade: 31, reservado: 1, disponivel: 30 },
  { produtoId: "prod-006", nome: "Webcam 4K Streaming",          quantidade: 8,  reservado: 0, disponivel: 8  },
];

module.exports = estoqueMock;
