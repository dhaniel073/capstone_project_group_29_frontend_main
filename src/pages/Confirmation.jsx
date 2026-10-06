import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router";
import Navbar from "../components/Navbar";
import { getOrderById } from "../services/orderService";

export const statusStyles = { processing: "tag-warning", completed: "tag-success", cancelled: "tag-danger" };

export default function Confirmation() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (order) return;
    getOrderById(id).then((res) => setOrder(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id, order]);

  if (loading || !order) return <div><Navbar /><p className="container page">{loading ? "Loading..." : "Order not found."}</p></div>;

  return (
    <div>
      <Navbar />
      <div className="container page" style={{ maxWidth: 600 }}>
        <div className="card" style={{ padding: "1.8rem", textAlign: "center" }}>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: "var(--color-success-bg)", border: "3px solid var(--color-success)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.2rem", fontSize: "1.7rem", color: "var(--color-success)" }}>&#10003;</div>
          <h1 style={{ margin: "0 0 0.3rem", fontSize: "1.3rem" }}>Payment Successful!</h1>
          <p className="text-mid">Order #{order._id?.slice(-8)}</p>
          <span className={`tag ${statusStyles[order.status] || "tag-warning"}`}>{order.status?.toUpperCase()}</span>
          <div className="card" style={{ textAlign: "left", padding: "1.1rem", marginTop: "1.5rem" }}>
            <h4 style={{ marginTop: 0 }}>Order Items</h4>
            {order.items?.map((item, idx) => (
              <div key={idx} className="row" style={{ fontSize: "0.85rem", marginBottom: "0.4rem" }}><span>{item.name} x{item.quantity}</span><span>NGN {(item.priceAtPurchase * item.quantity).toLocaleString()}</span></div>
            ))}
            <hr style={{ border: "none", borderTop: "1px solid var(--color-border)" }} />
            <div className="row" style={{ fontWeight: 800 }}><span>Total Paid</span><span className="text-success">NGN {order.totalAmount?.toLocaleString()}</span></div>
          </div>
          <div style={{ display: "flex", gap: "0.8rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
            <Link to="/orders" className="btn btn-primary" style={{ flex: "1 1 140px" }}>Track Order</Link>
            <Link to="/" className="btn btn-secondary" style={{ flex: "1 1 140px" }}>Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
