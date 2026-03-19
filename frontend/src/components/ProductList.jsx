import React, { useState } from "react";
import { products, categorias } from "../data/products.js";
import ProductCard from "./ProductCard.jsx";

export default function ProductList({ onAddToCart }) {
  const [filtro, setFiltro] = useState("Todos");

  const filtrados =
    filtro === "Todos"
      ? products
      : products.filter((p) => p.categoria === filtro);

  return (
    <div>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {["Todos", ...categorias].map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltro(cat)}
            style={{
              padding: "0.3rem 0.9rem",
              borderRadius: "999px",
              border: "1px solid",
              borderColor: filtro === cat ? "var(--accent)" : "var(--border)",
              background: filtro === cat ? "var(--accent-dim)" : "transparent",
              color: filtro === cat ? "var(--accent)" : "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid-3">
        {filtrados.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
