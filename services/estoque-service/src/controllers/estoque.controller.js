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

module.exports = { listarEstoque, buscarPorId };
