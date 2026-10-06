import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Plus, Minus, X, ShieldCheck } from "lucide-react";

import Button from "../components/Button";
import { useCart } from "../context/CartContext";

export const DELIVERY_FEE = 500;

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80";

const safeImage = (url) => {
  try {
    const u = new URL(url);
    return u.protocol === "https:" ? u.href : PLACEHOLDER_IMG;
  } catch {
    return PLACEHOLDER_IMG;
  }
};

const naira = (n) => `₦${Number(n || 0).toLocaleString()}`;

export default function Cart() {
  const { cart, loading, refreshCart, removeItem, removeOneFromCart, addOneToCart } = useCart();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [promo, setPromo] = useState("");
  const [promoMsg, setPromoMsg] = useState("");
  const [optimistic, setOptimistic] = useState({});
  const queues = useRef({});
  const pending = useRef({});

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const serverItems = Array.isArray(cart?.items) ? cart.items : [];

  const items = serverItems
    .map((item) => {
      const id = item?.product?._id;
      const serverQty = Number(item?.quantity ?? 0);
      const quantity = id in optimistic ? optimistic[id] : serverQty;
      return { product: item?.product, quantity };
    })
    .filter((i) => i.product?._id && i.quantity > 0);

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce(
    (s, i) => s + Number(i.product.price ?? 0) * i.quantity,
    0,
  );
  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const clearOptimistic = (id) =>
    setOptimistic((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

  const enqueue = (productId, setTo, action, fallbackMessage) => {
    setError("");
    setOptimistic((prev) => ({ ...prev, [productId]: setTo(prev) }));
    pending.current[productId] = (pending.current[productId] || 0) + 1;

    queues.current[productId] = (queues.current[productId] || Promise.resolve())
      .then(() => action(productId))
      .catch((err) => {
        setError(err.response?.data?.message || err.message || fallbackMessage);
        clearOptimistic(productId);
      })
      .finally(() => {
        pending.current[productId] -= 1;
        if (pending.current[productId] === 0) clearOptimistic(productId);
      });
  };

  const currentQty = (productId, serverQty) => (prev) =>
    productId in prev ? prev[productId] : serverQty;

  const handleAddOne = (productId, serverQty) =>
    enqueue(
      productId,
      (prev) => currentQty(productId, serverQty)(prev) + 1,
      addOneToCart,
      "Unable to add this item. Please try again.",
    );

  const handleRemoveOne = (productId, serverQty) =>
    enqueue(
      productId,
      (prev) => Math.max(0, currentQty(productId, serverQty)(prev) - 1),
      removeOneFromCart,
      "Unable to update your cart. Please try again.",
    );

  const handleRemoveAll = (productId) =>
    enqueue(productId, () => 0, removeItem, "Unable to remove this product. Please try again.");

  const handleClearAll = () => {
    if (!window.confirm("Remove all items from your basket?")) return;
    items.forEach((i) => handleRemoveAll(i.product._id));
  };

  const serverQtyOf = (id) =>
    Number(serverItems.find((i) => i?.product?._id === id)?.quantity ?? 0);

  const handleApplyPromo = () => {
    // Placeholder: wire this to your promo/coupon API when it exists.
    setPromoMsg(promo.trim() ? "Promo codes are applied at checkout." : "");
  };

  const isInitialLoading = loading && serverItems.length === 0;

  return (
    <div className="cart-shell">
      <header className="cart-topbar">
        <div className="cart-topbar-inner">
          <Link to="/" className="cart-brand">
            <span className="cart-logo">S</span>
            <span>Supermarket</span>
          </Link>
          <Link to="/" className="cart-back">← Back to Shop</Link>
        </div>
      </header>

      <div className="cart-page">
        <div className="cart-heading">
          <h1>
            Shopping Basket{" "}
            <span className="cart-heading-count">
              ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
          </h1>
          {items.length > 0 && (
            <button type="button" className="cart-clear" onClick={handleClearAll}>
              Clear all items
            </button>
          )}
        </div>

        {error && (
          <p className="text-danger" role="alert" style={{ marginBottom: "1rem" }}>
            {error}
          </p>
        )}

        {isInitialLoading ? (
          <p className="text-mid">Loading your basket...</p>
        ) : items.length === 0 ? (
          <div className="cart-empty">
            <p>Your basket is empty.</p>
            <Link to="/" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-list">
              {items.map(({ product, quantity }) => {
                const id = product._id;
                const price = Number(product.price ?? 0);
                return (
                  <div className="cart-item" key={id}>
                    <img
                      className="cart-item-img"
                      src={safeImage(product.imageUrl || product.image?.url || product.image)}
                      alt={product.name || "Product"}
                      referrerPolicy="no-referrer"
                    />

                    <div className="cart-item-info">
                      <h3>{product.name || "Product"}</h3>
                      <p className="cart-item-unit">
                        {product.unit || product.description || "Fresh in store"}
                      </p>
                      <p className="cart-item-price">
                        {naira(price * quantity)}
                        <span> ({naira(price)} ea)</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      className="cart-item-remove"
                      onClick={() => handleRemoveAll(id)}
                      aria-label={`Remove ${product.name} from basket`}
                    >
                      <X size={18} aria-hidden="true" />
                    </button>

                    <div className="cart-stepper">
                      <button
                        type="button"
                        onClick={() => handleRemoveOne(id, serverQtyOf(id))}
                        aria-label={`Decrease quantity of ${product.name}`}
                      >
                        <Minus size={14} strokeWidth={2.5} aria-hidden="true" />
                      </button>
                      <span aria-live="polite">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleAddOne(id, serverQtyOf(id))}
                        aria-label={`Increase quantity of ${product.name}`}
                      >
                        <Plus size={14} strokeWidth={2.5} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="cart-aside">
              <div className="cart-summary">
                <h3>Order Summary</h3>

                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span>{naira(subtotal)}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Delivery Estimate</span>
                  <span>{naira(deliveryFee)}</span>
                </div>

                <div className="cart-summary-total">
                  <span>Total</span>
                  <span>{naira(total)}</span>
                </div>

                <div className="cart-promo">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. GROUP29)"
                    value={promo}
                    maxLength={30}
                    onChange={(e) => setPromo(e.target.value)}
                  />
                  <button type="button" onClick={handleApplyPromo}>Apply</button>
                </div>
                {promoMsg && <p className="cart-promo-msg">{promoMsg}</p>}

                <Button className="btn-block" onClick={() => navigate("/checkout")}>
                  Proceed to Checkout ({naira(total)})
                </Button>
              </div>

              <div className="cart-secure">
                <ShieldCheck size={24} aria-hidden="true" />
                <div>
                  <strong>100% Secure Checkout</strong>
                  <p>Encrypted transactions &amp; quick supermarket delivery.</p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}