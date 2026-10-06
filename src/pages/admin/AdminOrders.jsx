import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";
import { statusStyles } from "../Confirmation";

const statusOptions = ["processing", "completed", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");

  const loadOrders = () => {
    const params = { page: 1, limit: 50 };
    if (filter) params.status = filter;
    getAllOrders(params).then((res) => setOrders(res.data)).catch(() => {});
  };
  useEffect(loadOrders, [filter]);

  const handleStatusChange = async (id, status) => {
    try { await updateOrderStatus(id, status); loadOrders(); } catch (err) { alert(err.message); }
  };

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">
        <h1 style={{ margin: "0 0 0.2rem", fontSize: "1.4rem" }}>Orders</h1>
        <p className="text-mid" style={{ marginBottom: "1.3rem" }}>Manage customer orders and fulfilment</p>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.3rem", flexWrap: "wrap" }}>
          {["", ...statusOptions].map((s) => (
            <button key={s || "all"} className={`btn chip ${filter === s ? "btn-primary" : "btn-secondary"}`} onClick={() => setFilter(s)}>
              {s ? s[0].toUpperCase() + s.slice(1) : "All"}
            </button>
          ))}
        </div>
        <div className="card table-scroll">
          <table>
            <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Update</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td style={{ fontFamily: "monospace" }}>{o._id.slice(-8)}</td>
                  <td>{o.user?.name || "N/A"}</td>
                  <td>{o.items?.length} items</td>
                  <td>NGN {o.totalAmount?.toLocaleString()}</td>
                  <td><span className={`tag ${statusStyles[o.status] || "tag-warning"}`}>{o.status}</span></td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)} disabled={o.paymentStatus !== "paid"} style={{ padding: "0.3rem 0.5rem", fontSize: "0.85rem", width: "auto" }}>
                      {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
