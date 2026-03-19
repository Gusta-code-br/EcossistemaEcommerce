import React from "react";
import { products } from "../data/products.js";

export default function Estoque() {
  return (
    <div>
      <div className="integration-warning">
        <span className="warn-icon">⚠️</span>
        <p>
          <strong>Sem integração:</strong> Os dados abaixo são os mesmos dados mockados locais
          do frontend. Nenhuma requisição é feita ao <code>estoque-service:3002</code>.
          Futuramente, esta página consumirá GET /estoque.
        </p>
      </div>

      <h1 className="page-title">Estoque</h1>
      <p className="page-subtitle">// representação visual — dados de src/data/products.js</p>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "var(--font-mono)",
            fontSize: "0.82rem",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid var(--border)" }}>
              {["ID", "Produto", "Categoria", "Preço", "Estoque", "Status"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "0.75rem 1rem",
                    textAlign: "left",
                    color: "var(--text-muted)",
                    fontWeight: 400,
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                style={{
                  borderBottom: "1px solid var(--border)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "0.75rem 1rem", color: "var(--accent)" }}>{p.id}</td>
                <td style={{ padding: "0.75rem 1rem", color: "var(--text)" }}>
                  {p.imagem} {p.nome}
                </td>
                <td style={{ padding: "0.75rem 1rem", color: "var(--text-muted)" }}>{p.categoria}</td>
                <td style={{ padding: "0.75rem 1rem", color: "var(--text)" }}>
                  R$ {p.preco.toFixed(2)}
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <span
                    style={{
                      display: "inline-block",
                      minWidth: "2.5rem",
                      textAlign: "center",
                      padding: "0.15rem 0.5rem",
                      borderRadius: "4px",
                      background: p.estoque > 10
                        ? "rgba(0,229,160,0.1)"
                        : p.estoque > 0
                        ? "rgba(255,200,60,0.1)"
                        : "rgba(255,107,53,0.1)",
                      color: p.estoque > 10
                        ? "var(--accent)"
                        : p.estoque > 0
                        ? "#ffc83c"
                        : "var(--accent-2)",
                    }}
                  >
                    {p.estoque}
                  </span>
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <span
                    className={`badge ${
                      p.estoque > 10 ? "badge-green" : p.estoque > 0 ? "badge-blue" : "badge-orange"
                    }`}
                  >
                    {p.estoque > 10 ? "OK" : p.estoque > 0 ? "Baixo" : "Esgotado"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
        }}
      >
        <strong style={{ color: "var(--text-dim)" }}>Rota futura:</strong>{" "}
        <span style={{ color: "var(--accent)" }}>GET http://localhost:3002/estoque</span>
        {" "}— será chamada quando a integração for implementada
      </div>
    </div>
  );
}
