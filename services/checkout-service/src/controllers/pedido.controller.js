const http = require("http");
const pedidosMock = require("../data/pedidos.mock");
const { publicarPedidoCriado } = require("../rabbitmq/publisher");
const CircuitBreaker = require("../circuit-breaker");

let contador = pedidosMock.length + 1;

const ESTOQUE_HOST = process.env.ESTOQUE_HOST || "estoque-service";
const ESTOQUE_PORT = 3002;

const estoqueBreaker = new CircuitBreaker({ threshold: 3, timeout: 10000 });

function consultarDisponibilidade(produtoId, quantidade) {
  return new Promise((resolve, reject) => {
    const path = `/produtos/${produtoId}/disponibilidade?quantidade=${quantidade}`;
    const options = { hostname: ESTOQUE_HOST, port: ESTOQUE_PORT, path, method: "GET" };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          reject(new Error("Resposta inválida do estoque-service"));
        }
      });
    });

    req.setTimeout(3000, () => {
      req.destroy();
      reject(new Error("Timeout ao consultar estoque-service"));
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

  try {
    for (const item of itens) {
      const { status, body } = await estoqueBreaker.execute(() =>
        consultarDisponibilidade(item.produtoId, item.quantidade)
      );

      if (status === 404) {
        return res.status(422).json({ erro: `Produto '${item.produtoId}' não encontrado no estoque.` });
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
    const status = estoqueBreaker.getStatus();
    const aberto = status.state === "OPEN";
    console.error(`[checkout] Falha ao consultar estoque (circuit: ${status.state}):`, err.message);
    return res.status(503).json({
      erro: aberto
        ? "Circuit Breaker ABERTO — estoque-service indisponível. Tente novamente em breve."
        : "Serviço de estoque indisponível.",
      circuitBreaker: status,
    });
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
  return res.json({ total: pedidosMock.length, pedidos: pedidosMock });
}

function statusCircuitBreaker(req, res) {
  return res.json({ circuitBreaker: estoqueBreaker.getStatus() });
}

module.exports = { criarPedido, listarPedidos, statusCircuitBreaker };
