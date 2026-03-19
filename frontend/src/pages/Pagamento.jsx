import React, { useState } from "react";

const metodos = ["Cartão de Crédito", "PIX", "Boleto"];

function gerarRespostaMock(valor, metodo) {
  const aprovado = Math.random() > 0.2;
  return {
    transacaoId: `TXN-${Date.now()}`,
    status: aprovado ? "aprovado" : "recusado",
    metodo,
    valor: parseFloat(valor).toFixed(2),
    mensagem: aprovado
      ? "Pagamento simulado com sucesso (mock local)"
      : "Simulação de recusa (mock local)",
    processadoEm: new Date().toISOString(),
    aviso: "Resultado gerado localmente. Nenhuma chamada ao pagamento-service foi feita.",
  };
}

export default function Pagamento() {
  const [form, setForm] = useState({ valor: "", metodo: "PIX" });
  const [historico, setHistorico] = useState([]);

  function handleSimular() {
    if (!form.valor || isNaN(form.valor)) return;
    const resultado = gerarRespostaMock(form.valor, form.metodo);
    setHistorico((prev) => [resultado, ...prev]);
  }

  return (
    <div>
      <div className="integration-warning">
        <span className="warn-icon">⚠️</span>
        <p>
          <strong>Sem integração:</strong> A simulação abaixo gera respostas mockadas localmente.
          Nenhuma requisição é feita ao <code>pagamento-service:3003</code>.
          Futuramente, esta página chamará POST /pagamentos/simular.
        </p>
      </div>

      <h1 className="page-title">Pagamento</h1>
      <p className="page-subtitle">// simulação local — POST /pagamentos/simular não é chamado</p>

      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "2rem", alignItems: "start" }}>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: "1.25rem" }}>Simular Pagamento</div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Valor (R$)
              </span>
              <input
                type="number"
                value={form.valor}
                onChange={(e) => setForm((p) => ({ ...p, valor: e.target.value }))}
                placeholder="150.00"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "0.6rem 0.85rem",
                  color: "var(--text)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.88rem",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Método
              </span>
              <select
                value={form.metodo}
                onChange={(e) => setForm((p) => ({ ...p, metodo: e.target.value }))}
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
                {metodos.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </label>

            <button
              className="btn btn-primary"
              onClick={handleSimular}
              style={{ justifyContent: "center", marginTop: "0.5rem" }}
            >
              Simular Pagamento
            </button>
          </div>
        </div>

        <div>
          <div className="section-header">
            <h2>Histórico de Simulações</h2>
            <span className="badge badge-green">{historico.length}</span>
          </div>

          {historico.length === 0 ? (
            <div className="empty-state">Nenhuma simulação ainda</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {historico.map((t) => (
                <div key={t.transacaoId} className="card" style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      {t.transacaoId}
                    </span>
                    <span className={`badge ${t.status === "aprovado" ? "badge-green" : "badge-orange"}`}>
                      {t.status}
                    </span>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", color: "var(--accent)", fontWeight: 700, marginBottom: "0.25rem" }}>
                    R$ {t.valor}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>
                    {t.metodo} · {new Date(t.processadoEm).toLocaleTimeString("pt-BR")}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
                    {t.mensagem}
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
