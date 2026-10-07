import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DELIVERY_FEE = 1200;

function formatNaira(amount) {
  return `NGN ${Number(amount).toLocaleString("en-NG")}`;
}

function readSavedAddress() {
  try {
    return JSON.parse(localStorage.getItem("deliveryAddress") || "null");
  } catch {
    return null;
  }
}

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}") || {};
  } catch {
    return {};
  }
}

function readLocalCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!Array.isArray(savedCart)) return [];
    return savedCart.map((item) => ({
      product: {
        _id: item._id || item.id,
        name: item.name,
        price: Number(item.price) || 0,
        imageUrl: item.imageUrl || item.image?.url || item.image || "",
      },
      quantity: Number(item.quantity) || 1,
    }));
  } catch {
    return [];
  }
}

export default function Checkout() {
  const navigate = useNavigate();
  const user = readUser();
  const [cart] = useState(() => ({ items: readLocalCart() }));
  const [address, setAddress] = useState(() => readSavedAddress());
  const [addressForm, setAddressForm] = useState(() => ({
    name: user.name || "",
    street: address?.street || "",
    city: address?.city || "",
    phone: address?.phone || "",
  }));
  const [editingAddress, setEditingAddress] = useState(!address);
  const loadingCart = false;
  const [error, setError] = useState("");

  const items = cart?.items || [];
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product?.price || 0) * item.quantity,
    0,
  );
  const total = subtotal + (items.length ? DELIVERY_FEE : 0);
  const email = user.email || "";
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  function handleAddressChange(event) {
    setAddressForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function saveAddress(event) {
    event.preventDefault();
    const nextAddress = { ...addressForm };
    localStorage.setItem("deliveryAddress", JSON.stringify(nextAddress));
    setAddress(nextAddress);
    setEditingAddress(false);
    setError("");
  }

  async function startPayment() {
    setError("");
    if (!email) {
      setError("Your account email is missing. Please log in again.");
      return;
    }
    if (!publicKey) {
      setError("Online payment is not configured yet. Please contact support.");
      return;
    }
    if (!address || !address.name || !address.street || !address.phone) {
      setError("Please add your delivery name, address, and phone number.");
      setEditingAddress(true);
      return;
    }
    setError(
      "Payment cannot start yet because checkout is not connected to the local shopping cart. Your cart is ready, but the order service needs to support these items before payment can be processed.",
    );
    return;
  }

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <div className="checkout-header-inner">
          <Link className="checkout-brand" to="/home">
            <span aria-hidden="true">S</span> SUPERMARKET
          </Link>
          <nav className="checkout-nav" aria-label="Main navigation">
            <Link to="/home">Home</Link>
          </nav>
          <span className="checkout-cart-count">Cart ({itemCount})</span>
          <Link className="checkout-account" to="/profile">
            {user.name?.split(" ")[0] || "My account"}{" "}
            <span aria-hidden="true">⌄</span>
          </Link>
        </div>
      </header>

      <main className="checkout-main">
        <div className="checkout-title-row">
          <button
            className="checkout-back"
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            ‹
          </button>
          <h1>Checkout</h1>
          <ol className="checkout-steps" aria-label="Checkout progress">
            <li className="step-done">
              <span>1</span>Cart
            </li>
            <li className="step-active">
              <span>2</span>Checkout
            </li>
            <li>
              <span>3</span>Confirmation
            </li>
          </ol>
        </div>

        {error && (
          <p className="form-message form-message-error" role="alert">
            {error}
          </p>
        )}
        {loadingCart ? (
          <p className="checkout-loading" role="status">
            Loading your cart...
          </p>
        ) : (
          <div className="checkout-layout">
            <section className="checkout-details">
              <div className="checkout-panel delivery-panel">
                <div className="panel-heading">
                  <h2>Delivery Address</h2>
                  {!editingAddress && (
                    <button
                      type="button"
                      className="subtle-button"
                      onClick={() => setEditingAddress(true)}
                    >
                      Change Address
                    </button>
                  )}
                </div>
                {editingAddress ? (
                  <form className="address-form" onSubmit={saveAddress}>
                    <label>
                      Full name
                      <input
                        name="name"
                        autoComplete="name"
                        required
                        value={addressForm.name}
                        onChange={handleAddressChange}
                      />
                    </label>
                    <label>
                      Street address
                      <input
                        name="street"
                        autoComplete="street-address"
                        required
                        value={addressForm.street}
                        onChange={handleAddressChange}
                        placeholder="House number and street"
                      />
                    </label>
                    <div className="address-form-row">
                      <label>
                        City / State
                        <input
                          name="city"
                          autoComplete="address-level2"
                          value={addressForm.city}
                          onChange={handleAddressChange}
                          placeholder="City, State"
                        />
                      </label>
                      <label>
                        Phone number
                        <input
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          required
                          value={addressForm.phone}
                          onChange={handleAddressChange}
                          placeholder="+234"
                        />
                      </label>
                    </div>
                    <button type="submit" className="save-address-button">
                      Save Address
                    </button>
                  </form>
                ) : (
                  <div className="address-content">
                    <strong>{address.name}</strong>
                    <span>
                      {address.street}
                      {address.city ? `, ${address.city}` : ""}
                    </span>
                    <span>{address.phone}</span>
                  </div>
                )}
              </div>

              <section
                className="payment-section"
                aria-labelledby="payment-title"
              >
                <h2 id="payment-title">Payment Method</h2>
                <div className="paystack-choice">
                  <div>
                    <strong>Pay with Paystack</strong>
                    <span>Card, Bank Transfer, USSD, or Mobile Money</span>
                  </div>
                  <span className="payment-radio" aria-label="Selected" />
                </div>
              </section>

              <label className="order-notes">
                <span>Order Notes (optional)</span>
                <textarea
                  placeholder="E.g. Leave at the gate, call on arrival..."
                  rows="3"
                />
              </label>
            </section>

            <aside className="checkout-summary" aria-labelledby="summary-title">
              <h2 id="summary-title">Order Summary</h2>
              {items.length === 0 ? (
                <p className="empty-cart">
                  Your cart is empty. <Link to="/home">Continue shopping</Link>
                </p>
              ) : (
                <ul className="summary-items">
                  {items.map((item) => (
                    <li key={item.product?._id || item.product?.id}>
                      <span>
                        {item.product?.name || "Product"} x{item.quantity}
                      </span>
                      <span>
                        {formatNaira(
                          Number(item.product?.price || 0) * item.quantity,
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="summary-line">
                <span>Subtotal</span>
                <span>{formatNaira(subtotal)}</span>
              </div>
              <div className="summary-line">
                <span>Delivery fee</span>
                <span>{formatNaira(items.length ? DELIVERY_FEE : 0)}</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <strong>{formatNaira(total)}</strong>
              </div>
              <button
                className="pay-button"
                type="button"
                disabled={!items.length || loadingCart}
                onClick={startPayment}
              >
                {`Pay ${formatNaira(total)}`}
              </button>
            </aside>

            <div className="mobile-checkout-total">
              <span>Total to Pay</span>
              <strong>{formatNaira(total)}</strong>
              <button
                className="pay-button"
                type="button"
                disabled={!items.length || loadingCart}
                onClick={startPayment}
              >
                {`Pay ${formatNaira(total)}`}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
