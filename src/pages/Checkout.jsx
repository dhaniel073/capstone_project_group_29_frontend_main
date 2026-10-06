import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { checkout as checkoutApi, initializeCheckout } from "../services/orderService";
import { DELIVERY_FEE } from "./Cart";

const PAYSTACK_SRC = "https://js.paystack.co/v2/inline.js";
const naira = (n) => `₦${Number(n || 0).toLocaleString()}`;

function loadPaystackScript() {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) return resolve();
    const existing = document.querySelector(`script[src="${PAYSTACK_SRC}"]`);
    const s = existing || document.createElement("script");
    s.addEventListener("load", resolve, { once: true });
    s.addEventListener("error", reject, { once: true });
    if (!existing) {
      s.src = PAYSTACK_SRC;
      document.body.appendChild(s);
    }
  });
}

export default function Checkout() {
  const { user } = useAuth();
  const { cart, loading, refreshCart } = useCart();
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [paidRef, setPaidRef] = useState("");

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const items = Array.isArray(cart?.items) ? cart.items.filter((i) => i?.product) : [];
  const subtotal = items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0);
  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const handlePay = async () => {
    if (paying || total === 0) return;
    setError("");
    setPaidRef("");
    setPaying(true);

    try {
      await loadPaystackScript();

      // Server computes the amount from the DB cart and returns an access code
      const init = await initializeCheckout();
      const accessCode = init?.data?.access_code;
      if (!accessCode) throw new Error("Missing access code");

      const popup = new window.PaystackPop();
      popup.resumeTransaction(accessCode, {
        onSuccess: (transaction) => {
          const reference = transaction?.reference;
          // Backend re-verifies status, amount and currency with Paystack
          checkoutApi(reference)
            .then((res) =>
              navigate(`/confirmation/${res.data._id}`, { state: { order: res.data } }),
            )
            .catch((err) => {
              setPaidRef(reference || "");
              setError(
                err.response?.data?.message ||
                err.message ||
                "We could not confirm your order.",
              );
            })
            .finally(() => setPaying(false));
        },
        onCancel: () => setPaying(false),
        onError: () => {
          setError("Payment failed. Please try again.");
          setPaying(false);
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to start payment. Please try again.",
      );
      setPaying(false);
    }
  };

  const isEmpty = !loading && items.length === 0;

  return (
    <div>
      <Navbar />
      <div className="container page">
        <h1 style={{ fontSize: "1.4rem" }}>Checkout</h1>

        {isEmpty ? (
          <div className="card" style={{ padding: "2.5rem 1.5rem", textAlign: "center" }}>
            <p className="text-mid">Your basket is empty.</p>
            <Link to="/" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="split-layout">
            <div className="split-main">
              <div className="card" style={{ padding: "1.3rem", marginBottom: "1.2rem" }}>
                <h3 style={{ marginTop: 0 }}>Delivery Address</h3>
                <p style={{ fontWeight: 700, margin: "0 0 0.2rem" }}>{user?.name}</p>
                <p className="text-mid" style={{ margin: 0 }}>
                  {user?.address || "12 Tanke Street, Ilorin, Kwara State"}
                </p>
              </div>
              <div className="card" style={{ padding: "1.3rem", border: "2px solid var(--color-primary)" }}>
                <h3 style={{ marginTop: 0 }}>Payment Method</h3>
                <p style={{ fontWeight: 700, color: "var(--color-primary-dark)", margin: "0 0 0.2rem" }}>
                  Pay with Paystack
                </p>
                <p className="text-mid" style={{ margin: 0, fontSize: "0.85rem" }}>
                  Card, Bank Transfer, USSD, or Mobile Money
                </p>
              </div>
            </div>

            <div className="split-aside">
              <div className="card" style={{ padding: "1.3rem" }}>
                <h3 style={{ marginTop: 0 }}>Order Summary</h3>
                {items.map((i) => (
                  <div key={i.product._id} className="row" style={{ fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                    <span className="text-mid">{i.product.name} x{i.quantity}</span>
                    <span>{naira(i.product.price * i.quantity)}</span>
                  </div>
                ))}
                <div className="row" style={{ fontSize: "0.85rem" }}>
                  <span className="text-mid">Delivery fee</span>
                  <span>{naira(deliveryFee)}</span>
                </div>
                <hr style={{ border: "none", borderTop: "1px solid var(--color-border)" }} />
                <div className="row" style={{ fontWeight: 800, marginBottom: "1.2rem" }}>
                  <span>Total</span>
                  <span className="text-success">{naira(total)}</span>
                </div>

                {error && (
                  <p className="text-danger" role="alert">
                    {error}
                    {paidRef && (
                      <>
                        <br />
                        Your payment went through. Do not pay again. Contact support with
                        reference <strong>{paidRef}</strong>.
                      </>
                    )}
                  </p>
                )}

                <Button
                  className="btn-block"
                  onClick={handlePay}
                  loading={paying}
                  disabled={total === 0 || loading}
                >
                  Pay {naira(total)}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}