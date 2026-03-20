const http = require("http");
const pedidosMock = require("../data/pedidos.mock");
const { publicarPedidoCriado } = require("../rabbitmq/publisher");

let contador = pedidosMock.length + 1;

const ESTOQUE_HOST = "localhost";
const ESTOQUE_PORT = 3002;

function consultarDisponibilidade(produtoId, quantidade) {
  return new Promise((resolve, reject) => {
    const path = `/produtos/${produtoId}/disponibilidade?quantidade=${quantidade}`;
    const options = { hostname: ESTOQUE_HOST, port: ESTOQUE_PORT, path, method: "GET" };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });

    req.on("error", reject);
    req.end();
  });
}

async function criarPedido(req, res) {
  const { cliente, email, itens } = req.body;

  if (!itens || itens.length === 0) {
    return res.status(400).json({ erro: "Campo 'itens' é obrigatório." });
  }

  // Consulta o estoque para cada item antes de criar o pedido
  try {
    for (const item of itens) {
      const { status, body } = await consultarDisponibilidade(item.produtoId, item.quantidade);

      if (status === 404) {
        return res.status(422).json({
          erro: `Produto '${item.produtoId}' não encontrado no estoque.`,
        });
      }

      if (!body.disponivel) {
        return res.status(422).json({
          erro: `Estoque insuficiente para '${item.nome || item.produtoId}'.`,
          disponivel: body.quantidadeDisponivel,
          solicitado: item.quantidade,
        });
      }

      console.log(`[checkout] Estoque OK: ${item.produtoId} — ${body.quantidadeDisponivel} disponíveis`);
    }
  } catch (err) {
    console.error("[checkout] Falha ao consultar estoque:", err.message);
    return res.status(503).json({ erro: "Serviço de estoque indisponível." });
  }

  const novoPedido = {
    id: `PED-${String(contador++).padStart(4, "0")}`,
    cliente: cliente || "Cliente Anônimo",
    email: email || "sem@email.com",
    itens,
    status: "criado",
    total: itens.reduce((acc, i) => acc + (i.preco || 0) * (i.quantidade || 1), 0),
    criadoEm: new Date().toISOString(),
  };

  pedidosMock.push(novoPedido);
  console.log(`[checkout] Pedido criado: ${novoPedido.id}`);

  publicarPedidoCriado(novoPedido);

  return res.status(201).json(novoPedido);
}

function listarPedidos(req, res) {
  return res.json({
    total: pedidosMock.length,
    pedidos: pedidosMock,
  });
}

module.exports = { criarPedido, listarPedidos };