import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function AdminLogin() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role !== "admin") { logout(); setError("This account does not have admin access."); return; }
      navigate("/admin/dashboard");
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="center-shell" style={{ background: "#3A3A2E" }}>
      <form onSubmit={handleSubmit} className="card" style={{ width: "100%", maxWidth: 400, padding: "2rem" }}>
        <h2 style={{ textAlign: "center", marginBottom: "0.2rem" }}>Admin Portal</h2>
        <p className="text-mid" style={{ textAlign: "center", marginBottom: "1.5rem" }}>Sign in to manage your store</p>
        {error && <p className="text-danger">{error}</p>}
        <Input label="Admin email" placeholder="Enter your email address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <Input label="Password" placeholder="Enter your password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <Button type="submit" className="btn-block" loading={loading}>Sign In</Button>
        <p className="text-light" style={{ textAlign: "center", fontSize: "0.75rem", marginTop: "1rem" }}>Restricted to authorized staff only.</p>
      </form>
    </div>
  );
}
