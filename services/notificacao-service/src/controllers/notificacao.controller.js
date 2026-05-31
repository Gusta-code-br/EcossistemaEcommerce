const notificacoesMock = require("../data/notificacoes.mock");

let contador = notificacoesMock.length + 1;

function simularNotificacao(req, res) {
  const { canal, tipo, destinatario, conteudo } = req.body;

  if (!destinatario) {
    return res.status(400).json({ erro: "Campo 'destinatario' é obrigatório." });
  }

  console.log(`[notificacao] Simulando notificação — canal: ${canal || "email"} | tipo: ${tipo || "generica"} | destinatario: ${destinatario}`);

  const registro = {
    notificacaoId: `NOT-${String(contador++).padStart(5, "0")}`,
    canal: canal || "email",
    tipo: tipo || "generica",
    destinatario: destinatario || "destinatario@exemplo.com",
    conteudo: conteudo || `Notificação do tipo "${tipo || "generica"}" simulada.`,
    status: "simulado",
    enviadoEm: new Date().toISOString(),
    aviso: "Notificação registrada em memória. Sem provedor real ou fila nesta fase.",
  };

  notificacoesMock.push(registro);
  console.log(`[notificacao] Notificação ${registro.notificacaoId} registrada — destinatario: ${destinatario} | status: ${registro.status}`);

  return res.status(201).json(registro);
}

function listarNotificacoes(req, res) {
  return res.json({
    total: notificacoesMock.length,
    notificacoes: notificacoesMock,
    aviso: "Dados mockados em memória. Sem banco de dados nesta fase.",
  });
}

module.exports = { simularNotificacao, listarNotificacoes };
