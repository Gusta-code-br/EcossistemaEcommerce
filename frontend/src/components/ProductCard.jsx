import React from "react";

export default function ProductCard({ product, onAddToCart }) {
  const inStock = product.estoque > 0;

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        transition: "border-color 0.2s, transform 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ fontSize: "2.5rem", lineHeight: 1 }}>{product.imagem}</div>

      <div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            color: "var(--text-muted)",
            marginBottom: "0.25rem",
          }}
        >
          {product.categoria} · {product.id}
        </div>
        <div
          style={{
            fontWeight: 700,
            fontSize: "0.95rem",
            marginBottom: "0.35rem",
            color: "var(--text)",
          }}
        >
          {product.nome}
        </div>
        <div
          style={{
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            lineHeight: 1.5,
          }}
        >
          {product.descricao}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "auto",
          paddingTop: "0.75rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "1.15rem",
              fontWeight: 800,
              color: "var(--accent)",
              fontFamily: "var(--font-mono)",
            }}
          >
            R$ {product.preco.toFixed(2)}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: inStock ? "var(--accent)" : "var(--accent-2)",
            }}
          >
            {inStock ? `${product.estoque} em estoque` : "Sem estoque"}
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => onAddToCart && onAddToCart(product)}
          disabled={!inStock}
          style={{
            fontSize: "0.8rem",
            padding: "0.45rem 1rem",
            opacity: inStock ? 1 : 0.4,
            cursor: inStock ? "pointer" : "not-allowed",
          }}
        >
          + Carrinho
        </button>
      </div>
    </div>
  );
}
