import { useEffect, useState } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { getMyOrders } from "../services/orderService";
import { statusStyles } from "./Confirmation";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getMyOrders().then((res) => setOrders(res.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  return (
    <div>
      <Navbar />
      <div className="container page" style={{ maxWidth: 700 }}>
        <h1 style={{ fontSize: "1.4rem" }}>My Orders</h1>
        {loading ? <p>Loading...</p> : orders.length === 0 ? <p className="text-mid">You have no orders yet.</p> : orders.map((o) => (
          <Link key={o._id} to={`/confirmation/${o._id}`} className="card" style={{ display: "block", padding: "1rem", marginBottom: "0.9rem" }}>
            <div className="row" style={{ flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700 }}>#{o._id.slice(-8)}</span>
              <span className={`tag ${statusStyles[o.status] || "tag-warning"}`}>{o.status?.toUpperCase()}</span>
            </div>
            <p className="text-mid" style={{ margin: "0.3rem 0", fontSize: "0.82rem" }}>{o.items?.length} items &middot; {new Date(o.createdAt).toLocaleDateString()}</p>
            <p style={{ fontWeight: 700, margin: 0 }}>NGN {o.totalAmount?.toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
