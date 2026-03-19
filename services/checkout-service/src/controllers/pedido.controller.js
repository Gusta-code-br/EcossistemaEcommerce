const pedidosMock = require("../data/pedidos.mock");

// Contador simples em memória
let contador = pedidosMock.length + 1;

function criarPedido(req, res) {
  const { cliente, email, itens } = req.body;

  // Retorna resposta mockada — sem chamar estoque, sem publicar eventos
  const novoPedido = {
    id: `PED-${String(contador++).padStart(4, "0")}`,
    cliente: cliente || "Cliente Anônimo",
    email: email || "sem@email.com",
    itens: itens || [],
    status: "criado",
    total: itens
      ? itens.reduce((acc, i) => acc + (i.preco || 0) * (i.quantidade || 1), 0)
      : 0,
    criadoEm: new Date().toISOString(),
    aviso: "Pedido registrado em memória. Sem integração com estoque ou mensageria nesta fase.",
  };

  pedidosMock.push(novoPedido);

  return res.status(201).json(novoPedido);
}

function listarPedidos(req, res) {
  return res.json({
    total: pedidosMock.length,
    pedidos: pedidosMock,
    aviso: "Dados mockados em memória. Sem banco de dados nesta fase.",
  });
}

module.exports = { criarPedido, listarPedidos };
