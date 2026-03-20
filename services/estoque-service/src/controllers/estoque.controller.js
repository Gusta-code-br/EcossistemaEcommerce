const estoqueMock = require("../data/estoque.mock");

function listarEstoque(req, res) {
  return res.json({
    total: estoqueMock.length,
    itens: estoqueMock,
    aviso: "Dados mockados em memória. Sem banco de dados nesta fase.",
  });
}

function buscarPorId(req, res) {
  const { id } = req.params;
  const item = estoqueMock.find((i) => i.produtoId === id);

  if (!item) {
    return res.status(404).json({
      erro: "Produto não encontrado no estoque",
      produtoId: id,
      servico: "estoque-service",
    });
  }

  return res.json(item);
}
function verificarDisponibilidade(req, res) {
  const { id } = req.params;
  const quantidade = parseInt(req.query.quantidade, 10);

  if (isNaN(quantidade) || quantidade <= 0) {
    return res.status(400).json({
      erro: "Parâmetro 'quantidade' deve ser um inteiro positivo.",
    });
  }

  const item = estoqueMock.find((i) => i.produtoId === id);

  if (!item) {
    return res.status(404).json({
      disponivel: false,
      erro: "Produto não encontrado",
      produtoId: id,
    });
  }

  return res.status(200).json({
    produtoId: item.produtoId,
    nome: item.nome,
    quantidadeSolicitada: quantidade,
    quantidadeDisponivel: item.disponivel,
    disponivel: item.disponivel >= quantidade,
  });
}

module.exports = { listarEstoque, buscarPorId, verificarDisponibilidade };