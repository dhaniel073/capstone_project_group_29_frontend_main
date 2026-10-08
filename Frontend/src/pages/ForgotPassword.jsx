import { useState } from "react";
import { Link } from "react-router";
import { forgotPassword } from "../services/authService";
import Input from "../components/Input";
import Button from "../components/Button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-shell">
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: 420,
          padding: "2rem",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "0.4rem" }}>
          Forgot Password?
        </h2>

        <p
          className="text-mid"
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          Enter your email and we will send you a reset link.
        </p>

        {sent ? (
          <div
            className="tag tag-success"
            style={{
              display: "block",
              textAlign: "center",
              padding: "0.8rem",
            }}
          >
            If an account exists for this email, a reset link has been sent.
            The link expires after 20 minutes.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <p className="text-danger">{error}</p>}

            <Input
              label="Email address"
              type="email"
              name="email"
              value={email}
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <Button type="submit" className="btn-block" loading={loading}>
              Send Reset Link
            </Button>
          </form>
        )}

        <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
          Remember it?{" "}
          <Link
            to="/login"
            style={{
              color: "var(--color-primary-dark)",
              fontWeight: 700,
            }}
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}