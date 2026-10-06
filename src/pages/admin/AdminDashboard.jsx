import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { getAllOrders } from "../../services/orderService";
import { getProducts } from "../../services/productService";
import { statusStyles } from "../Confirmation";

export default function AdminDashboard() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalProducts: 0, revenue: 0 });

  useEffect(() => {
    getAllOrders({ page: 1, limit: 5 }).then((res) => {
      setRecentOrders(res.data);
      const revenue = res.data.reduce((s, o) => s + (o.paymentStatus === "paid" ? o.totalAmount : 0), 0);
      setStats((s) => ({ ...s, totalOrders: res.meta?.totalRecords || res.data.length, revenue }));
    }).catch(() => {});
    getProducts({ page: 1, limit: 1 }).then((res) => setStats((s) => ({ ...s, totalProducts: res.meta?.totalRecords || 0 }))).catch(() => {});
  }, []);

  const cards = [
    { value: `NGN ${stats.revenue.toLocaleString()}`, label: "Revenue (recent orders)", cls: "text-success" },
    { value: stats.totalOrders, label: "Total Orders" },
    { value: stats.totalProducts, label: "Products" },
  ];

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">
        <h1 style={{ marginBottom: "0.2rem", fontSize: "1.4rem" }}>Dashboard</h1>
        <p className="text-mid" style={{ marginBottom: "1.5rem" }}>Overview of your store performance</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.9rem", marginBottom: "1.5rem" }}>
          {cards.map((c) => (
            <div key={c.label} className="card" style={{ padding: "1.1rem" }}>
              <p className={c.cls} style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0 0 0.2rem" }}>{c.value}</p>
              <p className="text-mid" style={{ margin: 0, fontSize: "0.78rem" }}>{c.label}</p>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 style={{ margin: 0, padding: "1.2rem 1rem 0.4rem" }}>Recent Orders</h3>
          <div className="table-scroll">
            <table>
              <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o._id}>
                    <td style={{ fontFamily: "monospace" }}>{o._id.slice(-8)}</td>
                    <td>{o.user?.name || "N/A"}</td>
                    <td>NGN {o.totalAmount?.toLocaleString()}</td>
                    <td><span className={`tag ${statusStyles[o.status] || "tag-warning"}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
