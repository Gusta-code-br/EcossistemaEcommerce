import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Checkout from "./pages/Checkout.jsx";
import Estoque from "./pages/Estoque.jsx";
import Pagamento from "./pages/Pagamento.jsx";
import Notificacao from "./pages/Notificacao.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/pagamento" element={<Pagamento />} />
          <Route path="/notificacao" element={<Notificacao />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
