import React from "react";

const services = [
  { name: "checkout-service", port: 3001, status: "isolated" },
  { name: "estoque-service", port: 3002, status: "isolated" },
  { name: "pagamento-service", port: 3003, status: "isolated" },
  { name: "notificacao-service", port: 3004, status: "isolated" },
  { name: "rabbitmq", port: 5672, status: "provisioned" },
];

export default function StatusPanel() {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "1.25rem",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
          color: "var(--text-muted)",
          marginBottom: "1rem",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Status dos Serviços
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {services.map((svc) => (
          <div
            key={svc.name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span
                className={`dot ${svc.status === "provisioned" ? "dot-orange" : "dot-green"}`}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.78rem",
                  color: "var(--text-dim)",
                }}
              >
                {svc.name}
              </span>
            </div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                color: "var(--text-muted)",
              }}
            >
              :{svc.port}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "1rem",
          paddingTop: "1rem",
          borderTop: "1px solid var(--border)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          color: "var(--text-muted)",
          lineHeight: 1.6,
        }}
      >
        <span style={{ color: "var(--accent)" }}>●</span> Isolado — sem integrações
        <br />
        <span style={{ color: "var(--accent-2)" }}>●</span> Provisionado — sem uso no código
      </div>
    </div>
  );
}
