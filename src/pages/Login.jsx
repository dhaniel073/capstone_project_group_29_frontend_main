import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(location.state?.from || (user.role === "admin" ? "/admin/dashboard" : "/"));
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <h1 style={{ fontSize: "1.7rem", marginBottom: "0.5rem" }}>Supermarket</h1>
        <p style={{ opacity: 0.85, maxWidth: 320 }}>Log in to pick up where you left off.</p>
      </div>
      <div className="auth-form-panel">
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 380 }}>
          <h2 style={{ marginBottom: "0.2rem" }}>Welcome Back</h2>
          <p className="text-mid" style={{ marginBottom: "1.5rem" }}>Log in to continue shopping</p>
          {error && <p className="text-danger">{error}</p>}
          <Input label="Email address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="Enter your email address" />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required placeholder="Enter your password" />
          <div style={{ textAlign: "right", marginBottom: "1rem" }}><Link to="/forgot-password" style={{ color: "var(--color-primary-dark)", fontSize: "0.85rem", fontWeight: 600 }}>Forgot Password?</Link></div>
          <Button type="submit" className="btn-block" loading={loading}>Log In</Button>
          <p style={{ textAlign: "center", marginTop: "1rem" }}>Don't have an account? <Link to="/register" style={{ color: "var(--color-primary-dark)", fontWeight: 700 }}>Sign Up</Link></p>
        </form>
      </div>
    </div>
  );
}
