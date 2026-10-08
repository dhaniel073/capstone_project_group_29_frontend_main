import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/productcategory", label: "Product Category" },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-head">
        <div>
          <p style={{ fontWeight: 800, margin: 0 }}>Supermarket</p>
          <p style={{ fontSize: "0.65rem", opacity: 0.6, margin: 0, letterSpacing: "0.1em" }}>ADMIN</p>
        </div>
        <button className="admin-toggle" onClick={() => setOpen((v) => !v)} aria-label="Toggle admin menu" aria-expanded={open}>
          {open ? "\u2715" : "\u2630"}
        </button>
      </div>
      <div className={`admin-collapse${open ? " open" : ""}`}>
        <nav style={{ padding: "0 0.8rem", flex: 1 }}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)} style={({ isActive }) => ({
              display: "block", padding: "0.7rem 0.8rem", marginBottom: "0.3rem", borderRadius: 8,
              background: isActive ? "var(--color-primary)" : "transparent",
              color: isActive ? "white" : "#CFC9B4", fontWeight: isActive ? 700 : 500,
            })}>{item.label}</NavLink>
          ))}
        </nav>
        <div style={{ padding: "1rem 1.2rem 0" }}>
          <p style={{ fontWeight: 700, margin: "0 0 0.1rem", fontSize: "0.85rem" }}>{user?.name}</p>
          <p style={{ fontSize: "0.75rem", opacity: 0.6, margin: "0 0 0.8rem" }}>Admin</p>
          <button className="btn btn-secondary btn-block" onClick={() => { logout(); navigate("/admin/login"); }}>Log Out</button>
        </div>
      </div>
    </aside>
  );
}
