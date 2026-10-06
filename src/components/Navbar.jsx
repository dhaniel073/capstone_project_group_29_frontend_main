import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";


export default function Navbar({ searchQuery, onSearchChange }) {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const showSearch = typeof onSearchChange === "function";
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    logout();
    close();
    navigate("/login");
  };

  return (
    <header className="sm-nav">
      <div className="sm-nav__inner">
        <Link to="/" onClick={close} className="sm-nav__brand">
          <span className="sm-nav__logo">S</span>
          <span>
            <span className="sm-nav__title">Supermarket</span>
            <span className="sm-nav__subtitle">Group 29 Store</span>
          </span>
        </Link>

        {showSearch && (
          <div className="sm-nav__search">
            <input
              type="text"
              placeholder="Search groceries, bakery, fresh foods..."
              value={searchQuery || ""}
              maxLength={100}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )}

        <div className="sm-nav__actions">
          {isAdmin && (
            <Link to="/admin/add-product" className="sm-nav__pill">+ Add Product</Link>
          )}

          <Link to="/cart" className="sm-nav__pill">
            <span>🛒 Cart</span>
            {itemCount > 0 && <span className="sm-nav__count">{itemCount}</span>}
          </Link>

          {user ? (
            <div className="sm-nav__user">
              <div className="sm-nav__user-text">
                <Link to="/profile" className="sm-nav__name">{user.name || "Profile"}</Link>
                <button type="button" className="sm-nav__logout" onClick={handleLogout}>
                  Log out
                </button>
              </div>
              <Link to="/profile" className="sm-nav__avatar">
                {user.name ? user.name.charAt(0) : "U"}
              </Link>
            </div>
          ) : (
            <Link to="/login" className="sm-nav__login">Log In</Link>
          )}
        </div>

        <button
          type="button"
          className="sm-nav__toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? "\u2715" : "\u2630"}
        </button>
      </div>

      {open && (
        <div className="sm-nav__mobile">
          {showSearch && (
            <input
              type="text"
              placeholder="Search groceries..."
              value={searchQuery || ""}
              maxLength={100}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          )}
          <Link to="/" onClick={close}>Home</Link>
          <Link to="/cart" onClick={close}>Cart {itemCount > 0 && `(${itemCount})`}</Link>
          {isAdmin && <Link to="/admin/add-product" onClick={close}>+ Add Product</Link>}
          {user ? (
            <>
              <Link to="/profile" onClick={close}>{user.name?.split(" ")[0] || "Profile"}</Link>
              <button type="button" className="sm-nav__logout" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" onClick={close}>Log In</Link>
          )}
        </div>
      )}
    </header>
  );
}