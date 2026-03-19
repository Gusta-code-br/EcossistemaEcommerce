import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home", icon: "⬡" },
  { to: "/estoque", label: "Estoque", icon: "📦" },
  { to: "/checkout", label: "Checkout", icon: "🛒" },
  { to: "/pagamento", label: "Pagamento", icon: "💳" },
  { to: "/notificacao", label: "Notificação", icon: "🔔" },
];

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <div style={styles.brand}>
          <span style={styles.logo}>◈</span>
          <div>
            <div style={styles.brandName}>EcoShop</div>
            <div style={styles.brandSub}>Distributed E-Commerce</div>
          </div>
        </div>

        <nav style={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
              })}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    background: "var(--surface)",
    borderBottom: "1px solid var(--border)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1.5rem",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "0.65rem",
    flexShrink: 0,
  },
  logo: {
    fontSize: "1.6rem",
    color: "var(--accent)",
    lineHeight: 1,
  },
  brandName: {
    fontFamily: "var(--font-display)",
    fontWeight: 800,
    fontSize: "1rem",
    letterSpacing: "-0.02em",
    color: "var(--text)",
    lineHeight: 1.1,
  },
  brandSub: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    color: "var(--text-muted)",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    overflowX: "auto",
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.35rem 0.75rem",
    borderRadius: "6px",
    fontFamily: "var(--font-display)",
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "var(--text-muted)",
    transition: "all 0.15s",
    whiteSpace: "nowrap",
    border: "1px solid transparent",
  },
  navLinkActive: {
    color: "var(--accent)",
    background: "var(--accent-dim)",
    border: "1px solid rgba(0,229,160,0.2)",
  },
};
