import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  resetPassword,
  validateResetToken,
} from "../services/authService";
import Input from "../components/Input";
import Button from "../components/Button";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [checkingToken, setCheckingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setTokenError(
          "This password reset link is invalid. Please request a new one."
        );
        setCheckingToken(false);
        return;
      }

      try {
        await validateResetToken(token);
        setTokenValid(true);
      } catch (err) {
        setTokenValid(false);

        setTokenError(
          err.response?.data?.message ||
          err.message ||
          "This password reset link is invalid or has expired."
        );
      } finally {
        setCheckingToken(false);
      }
    };

    checkToken();
  }, [token]);

  const handleChange = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        token,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to reset password. Please request a new reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkingToken) {
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
          <h2 style={{ textAlign: "center", marginBottom: "0.5rem" }}>
            Checking Reset Link
          </h2>

          <p className="text-mid" style={{ textAlign: "center" }}>
            Please wait while we verify your reset link.
          </p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
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
          <h2 style={{ textAlign: "center", marginBottom: "0.75rem" }}>
            Reset Link Expired
          </h2>

          <p
            className="text-danger"
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            {tokenError}
          </p>

          <p style={{ textAlign: "center" }}>
            <Link
              to="/forgot-password"
              style={{
                color: "var(--color-primary-dark)",
                fontWeight: 700,
              }}
            >
              Request a new reset link
            </Link>
          </p>
        </div>
      </div>
    );
  }

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
          Reset Your Password
        </h2>

        <p
          className="text-mid"
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          Create a new password for your account.
        </p>

        <form onSubmit={handleSubmit}>
          {error && <p className="text-danger">{error}</p>}

          <Input
            id="new-password"
            label="New password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="New Password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
            autoComplete="new-password"
            rightElement={
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                aria-controls="new-password"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={20} strokeWidth={2} aria-hidden="true" />
                ) : (
                  <Eye size={20} strokeWidth={2} aria-hidden="true" />
                )}
              </button>
            }
          />

          <Input
            id="confirm-new-password"
            label="Confirm new password"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
            autoComplete="new-password"
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
                aria-pressed={showConfirmPassword}
                aria-controls="confirm-new-password"
                title={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} strokeWidth={2} aria-hidden="true" />
                ) : (
                  <Eye size={20} strokeWidth={2} aria-hidden="true" />
                )}
              </button>
            }
          />

          <Button type="submit" className="btn-block" loading={loading}>
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}