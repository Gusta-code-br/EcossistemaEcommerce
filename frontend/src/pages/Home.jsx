import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductList from "../components/ProductList.jsx";
import StatusPanel from "../components/StatusPanel.jsx";

export default function Home() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  function handleAddToCart(product) {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }

  const totalItems = cart.reduce((acc, i) => acc + i.qty, 0);
  const totalPrice = cart.reduce((acc, i) => acc + i.preco * i.qty, 0);

  return (
    <div>
      <div className="integration-warning">
        <span className="warn-icon">⚠️</span>
        <p>
          <strong>Modo Estrutural:</strong> Este frontend opera com dados mockados locais.
          Nenhuma chamada HTTP é feita aos microsserviços. As integrações serão
          implementadas manualmente em etapas futuras.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        <div>
          <h1 className="page-title">Catálogo de Produtos</h1>
          <p className="page-subtitle">
            // dados mockados em src/data/products.js — sem chamadas HTTP
          </p>
          <ProductList onAddToCart={handleAddToCart} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Carrinho local */}
          <div className="card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <span style={{ fontWeight: 700 }}>Carrinho Local</span>
              <span className="badge badge-green">{totalItems} itens</span>
            </div>

            {cart.length === 0 ? (
              <div className="empty-state">Nenhum item</div>
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.82rem",
                        color: "var(--text-dim)",
                      }}
                    >
                      <span>
                        {item.imagem} {item.nome.slice(0, 20)}… ×{item.qty}
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
                        R${(item.preco * item.qty).toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    borderTop: "1px solid var(--border)",
                    paddingTop: "0.75rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>Total</span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontWeight: 700,
                      color: "var(--accent)",
                    }}
                  >
                    R$ {totalPrice.toFixed(2)}
                  </span>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => navigate("/checkout")}
                >
                  Ir para Checkout →
                </button>
              </>
            )}
          </div>

          <StatusPanel />
        </div>
      </div>
    </div>
  );
}
