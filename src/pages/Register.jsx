import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm((currentForm) => ({
      ...currentForm,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      navigate("/");
    } catch (err) {
      setError(err.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <h1 style={{ fontSize: "1.7rem", marginBottom: "0.5rem" }}>
          Welcome to Supermarket
        </h1>

        <p style={{ opacity: 0.85, maxWidth: 320 }}>
          Fresh groceries delivered fast. Join thousands of happy customers.
        </p>
      </div>

      <div className="auth-form-panel">
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 380 }}>
          <h2 style={{ marginBottom: "0.2rem" }}>
            Create Your Account
          </h2>

          <p className="text-mid" style={{ marginBottom: "1.5rem" }}>
            Fill in your details to get started
          </p>

          {error && <p className="text-danger">{error}</p>}

          <Input
            label="Full name"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Name"
            autoComplete="name"
            required
          />

          <Input
            label="Email address"
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="Email"
            autoComplete="email"
            required
          />

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="Password"
            autoComplete="new-password"
            minLength={6}
            required
            rightElement={
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={20} strokeWidth={2} />
                ) : (
                  <Eye size={20} strokeWidth={2} />
                )}
              </button>
            }
          />

          <Input
            label="Confirm password"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={onChange}
            placeholder="Confirm Password"
            autoComplete="new-password"
            minLength={6}
            required
            rightElement={
              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword((current) => !current)
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                title={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} strokeWidth={2} />
                ) : (
                  <Eye size={20} strokeWidth={2} />
                )}
              </button>
            }
          />

          <Button type="submit" className="btn-block" loading={loading}>
            Create Account
          </Button>

          <p style={{ textAlign: "center", marginTop: "1rem" }}>
            Already have an account?{" "}
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
        </form>
      </div>
    </div>
  );
}