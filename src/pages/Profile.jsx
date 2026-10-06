import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { getMyOrders } from "../services/orderService";

const menuItems = [
  { label: "My Orders", icon: "📦", to: "/orders" },
  { label: "Saved Addresses", icon: "📍" },
  { label: "Payment Methods", icon: "💳" },
  { label: "Notifications", icon: "🔔" },
  { label: "Settings", icon: "⚙️" },
  { label: "Help & Support", icon: "💬" },
];

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orderCount, setOrderCount] = useState(null);

  useEffect(() => {
    let active = true;
    getMyOrders()
      .then((res) => {
        if (active) setOrderCount(Array.isArray(res?.data) ? res.data.length : 0);
      })
      .catch(() => { });
    return () => { active = false; };
  }, []);

  const initials =
    user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <div>
      <Navbar />
      <div className="container page profile-page">
        <div className="card profile-header">
          <div className="profile-avatar">{initials}</div>
          <h2 className="profile-name">{user?.name}</h2>
          <p className="text-mid profile-email">{user?.email}</p>
          {user?.role && <span className="tag tag-accent">{user.role.toUpperCase()}</span>}

          <Link to="/orders" className="profile-stat">
            <span className="profile-stat-value">{orderCount ?? "–"}</span>
            <span className="profile-stat-label">Orders</span>
          </Link>
        </div>

        <div className="card profile-menu">
          {menuItems.map((item) =>
            item.to ? (
              <Link key={item.label} to={item.to} className="profile-row">
                <span className="profile-row-icon">{item.icon}</span>
                <span className="profile-row-label">{item.label}</span>
                <span className="text-light">›</span>
              </Link>
            ) : (
              <div key={item.label} className="profile-row profile-row-disabled" aria-disabled="true">
                <span className="profile-row-icon">{item.icon}</span>
                <span className="profile-row-label">{item.label}</span>
                <span className="tag tag-accent">Soon</span>
              </div>
            )
          )}
        </div>

        <Button
          variant="danger"
          className="btn-block profile-logout"
          onClick={() => { logout(); navigate("/login"); }}
        >
          Log Out
        </Button>
      </div>
    </div>
  );
}