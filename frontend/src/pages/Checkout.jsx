import React, { useState } from "react";

let pedidoCounter = 1001;

function gerarPedidoMock(dados) {
  return {
    id: `PED-${pedidoCounter++}`,
    status: "criado_localmente",
    cliente: dados.nome,
    email: dados.email,
    criadoEm: new Date().toISOString(),
    total: (Math.random() * 800 + 100).toFixed(2),
    aviso: "Pedido gerado apenas no estado local do frontend. Nenhuma chamada ao checkout-service foi feita.",
  };
}

export default function Checkout() {
  const [form, setForm] = useState({ nome: "", email: "", endereco: "" });
  const [pedidos, setPedidos] = useState([]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit() {
    if (!form.nome || !form.email) return;
    const novoPedido = gerarPedidoMock(form);
    setPedidos((prev) => [novoPedido, ...prev]);
    setForm({ nome: "", email: "", endereco: "" });
  }

  return (
    <div>
      <div className="integration-warning">
        <span className="warn-icon">⚠️</span>
        <p>
          <strong>Sem integração:</strong> O formulário abaixo cria pedidos apenas no estado
          local do React. Nenhuma requisição é feita ao{" "}
          <code>checkout-service:3001</code>. A integração HTTP será implementada futuramente.
        </p>
      </div>

      <h1 className="page-title">Checkout</h1>
      <p className="page-subtitle">// simulação local — POST /pedidos não é chamado</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: "1.25rem" }}>Dados do Pedido</div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { label: "Nome completo", name: "nome", placeholder: "João Silva" },
              { label: "E-mail", name: "email", placeholder: "joao@email.com" },
              { label: "Endereço", name: "endereco", placeholder: "Rua das Flores, 123" },
            ].map((field) => (
              <label key={field.name} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {field.label}
                </span>
                <input
                  type="text"
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
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
            ))}

            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              style={{ marginTop: "0.5rem", justifyContent: "center" }}
            >
              Criar Pedido (local)
            </button>
          </div>
        </div>

        <div>
          <div className="section-header">
            <h2>Pedidos Criados</h2>
            <span className="badge badge-green">{pedidos.length}</span>
          </div>

          {pedidos.length === 0 ? (
            <div className="empty-state">Nenhum pedido ainda</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {pedidos.map((p) => (
                <div key={p.id} className="card" style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--accent)" }}>
                      {p.id}
                    </span>
                    <span className="badge badge-orange">{p.status}</span>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-dim)" }}>
                    {p.cliente} · {p.email}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
                    R$ {p.total} · {new Date(p.criadoEm).toLocaleTimeString("pt-BR")}
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
