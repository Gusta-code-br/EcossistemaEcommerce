import React, { useState } from "react";

const canais = ["E-mail", "SMS", "Push", "Webhook"];
const tipos = ["pedido.criado", "pagamento.aprovado", "pagamento.recusado", "estoque.baixo"];

function gerarNotificacaoMock(canal, tipo, destinatario) {
  return {
    notificacaoId: `NOT-${Date.now()}`,
    canal,
    tipo,
    destinatario,
    status: "simulado",
    mensagem: `[Mock] Notificação do tipo "${tipo}" enviada via ${canal} para ${destinatario}`,
    enviadoEm: new Date().toISOString(),
    aviso: "Gerado localmente. Nenhuma chamada ao notificacao-service foi feita.",
  };
}

export default function Notificacao() {
  const [form, setForm] = useState({ canal: "E-mail", tipo: "pedido.criado", destinatario: "" });
  const [historico, setHistorico] = useState([]);

  function handleSimular() {
    if (!form.destinatario) return;
    const notif = gerarNotificacaoMock(form.canal, form.tipo, form.destinatario);
    setHistorico((prev) => [notif, ...prev]);
  }

  return (
    <div>
      <div className="integration-warning">
        <span className="warn-icon">⚠️</span>
        <p>
          <strong>Sem integração:</strong> As notificações abaixo são simuladas localmente.
          Nenhuma requisição é feita ao <code>notificacao-service:3004</code> e nenhuma fila
          RabbitMQ é consumida. A integração será implementada futuramente.
        </p>
      </div>

      <h1 className="page-title">Notificações</h1>
      <p className="page-subtitle">// simulação local — POST /notificacoes/simular não é chamado</p>

      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "2rem", alignItems: "start" }}>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: "1.25rem" }}>Simular Notificação</div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { label: "Canal", field: "canal", options: canais },
              { label: "Tipo de Evento", field: "tipo", options: tipos },
            ].map(({ label, field, options }) => (
              <label key={field} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {label}
                </span>
                <select
                  value={form[field]}
                  onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "0.6rem 0.85rem",
                    color: "var(--text)",
                    fontFamily: "var(--font-display)",
                    fontSize: "0.88rem",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  {options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
            ))}

            <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Destinatário
              </span>
              <input
                type="text"
                value={form.destinatario}
                onChange={(e) => setForm((p) => ({ ...p, destinatario: e.target.value }))}
                placeholder="usuario@email.com"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "0.6rem 0.85rem",
                  color: "var(--text)",
                  fontFamily: "var(--font-display)",
                  fontSize: "0.88rem",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </label>

            <button
              className="btn btn-primary"
              onClick={handleSimular}
              style={{ justifyContent: "center", marginTop: "0.5rem" }}
            >
              Simular Envio
            </button>
          </div>
        </div>

        <div>
          <div className="section-header">
            <h2>Notificações Simuladas</h2>
            <span className="badge badge-green">{historico.length}</span>
          </div>

          {historico.length === 0 ? (
            <div className="empty-state">Nenhuma notificação ainda</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {historico.map((n) => (
                <div key={n.notificacaoId} className="card" style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {n.notificacaoId}
                    </span>
                    <span className="badge badge-blue">{n.canal}</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.4rem" }}>
                    <span className="badge badge-orange" style={{ fontSize: "0.7rem" }}>{n.tipo}</span>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-dim)", marginBottom: "0.35rem" }}>
                    → {n.destinatario}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    {new Date(n.enviadoEm).toLocaleTimeString("pt-BR")} · {n.mensagem}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
