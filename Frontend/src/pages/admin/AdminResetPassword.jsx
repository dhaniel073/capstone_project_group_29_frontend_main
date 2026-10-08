import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { validateAdminResetToken, sendAdminResetOtp, verifyAdminResetOtp, resendAdminResetOtp, resetAdminPassword } from "../../services/authService";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function AdminResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [step, setStep] = useState("checking");
  const [tokenError, setTokenError] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [resetAuthorization, setResetAuthorization] = useState("");
  const [otp, setOtp] = useState("");

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);

  useEffect(() => {
    let active = true;

    setStep("checking");
    setTokenError("");
    setError("");
    setNotice("");
    setOtp("");
    setChallengeId("");
    setResetAuthorization("");
    setForm({ password: "", confirmPassword: "" });

    const checkToken = async () => {
      if (!token) {
        if (active) {
          setTokenError(
            "This reset link is invalid. Please request a new one."
          );
          setStep("invalid");
        }
        return;
      }

      try {
        await validateAdminResetToken(token);

        if (active) {
          setStep("send");
        }
      } catch (err) {
        if (active) {
          setTokenError(
            err.message || "This reset link is invalid or has expired."
          );
          setStep("invalid");
        }
      }
    };

    checkToken();

    return () => {
      active = false;
    };
  }, [token]);

  useEffect(() => {
    if (resendSeconds <= 0) return;

    const timer = window.setTimeout(() => {
      setResendSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendSeconds]);

  const handleSendOtp = async () => {
    setError("");
    setNotice("");
    setLoading(true);

    try {
      const result = await sendAdminResetOtp(token);
      const id = result.data?.challengeId;

      if (!id) {
        throw new Error("The server did not return a verification challenge.");
      }

      setChallengeId(id);
      setOtp("");
      setResendSeconds(60);
      setNotice(
        result.message || "A verification code has been sent to your email."
      );
      setStep("otp");
    } catch (err) {
      setError(err.message || "Unable to send the verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");

    if (!/^\d{6}$/.test(otp.trim())) {
      setError("Enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      const result = await verifyAdminResetOtp(challengeId, otp.trim());
      const authorization = result.data?.resetAuthorization;

      if (!authorization) {
        throw new Error("The server did not return reset authorization.");
      }

      setResetAuthorization(authorization);
      setOtp("");
      setStep("password");
    } catch (err) {
      setError(err.message || "Unable to verify the code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendSeconds > 0 || resending || loading) return;

    setError("");
    setNotice("");
    setResending(true);

    try {
      const result = await resendAdminResetOtp(challengeId);

      setOtp("");
      setResendSeconds(60);
      setNotice(
        result.message || "A new verification code has been sent."
      );
    } catch (err) {
      setError(err.message || "Unable to resend the verification code.");
    } finally {
      setResending(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!challengeId || !resetAuthorization) {
      setError("Please complete email verification first.");
      return;
    }

    setLoading(true);

    try {
      await resetAdminPassword({
        challengeId,
        resetAuthorization,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      setResetAuthorization("");
      setForm({ password: "", confirmPassword: "" });
      setStep("success");
    } catch (err) {
      setError(err.message || "Unable to reset your password.");
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    checking: "Checking Reset Link",
    invalid: "Reset Link Unavailable",
    send: "Verify Your Admin Email",
    otp: "Enter Verification Code",
    password: "Reset Admin Password",
    success: "Password Reset Successful",
  };

  return (
    <div className="center-shell">
      <div
        className="card"
        style={{ width: "100%", maxWidth: 420, padding: "2rem" }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "0.75rem" }}>
          {titles[step]}
        </h2>

        {error && (
          <p className="text-danger" role="alert">
            {error}
          </p>
        )}

        {notice && (
          <p className="text-mid" role="status">
            {notice}
          </p>
        )}

        {step === "checking" && (
          <p
            className="text-mid"
            role="status"
            style={{ textAlign: "center" }}
          >
            Please wait while we verify your reset link.
          </p>
        )}

        {step === "invalid" && (
          <>
            <p
              className="text-danger"
              role="alert"
              style={{ textAlign: "center", marginBottom: "1.5rem" }}
            >
              {tokenError}
            </p>

            <p style={{ textAlign: "center" }}>
              <Link
                to="/admin/forgot-password"
                style={{
                  color: "var(--color-primary-dark)",
                  fontWeight: 700,
                }}
              >
                Request a new reset link
              </Link>
            </p>
          </>
        )}

        {step === "send" && (
          <>
            <p
              className="text-mid"
              style={{ textAlign: "center", marginBottom: "1.5rem" }}
            >
              Your reset link is valid. Send a verification code to your
              registered admin email to continue.
            </p>

            <Button
              type="button"
              className="btn-block"
              loading={loading}
              onClick={handleSendOtp}
            >
              Send Verification Code
            </Button>
          </>
        )}

        {step === "otp" && (
          <>
            <p
              className="text-mid"
              style={{ textAlign: "center", marginBottom: "1.5rem" }}
            >
              Enter the 6-digit code sent to your admin email.
              The code expires after 5 minutes.
            </p>

            <form onSubmit={handleVerifyOtp}>
              <Input
                id="admin-reset-otp"
                label="Verification code"
                type="text"
                name="otp"
                value={otp}
                placeholder="Enter 6-digit code"
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                inputMode="numeric"
                autoComplete="one-time-code"
                minLength={6}
                maxLength={6}
                required
              />

              <Button
                type="submit"
                className="btn-block"
                loading={loading}
                disabled={resending}
              >
                Verify Code
              </Button>
            </form>

            <div style={{ marginTop: "1rem" }}>
              <Button
                type="button"
                variant="secondary"
                className="btn-block"
                loading={resending}
                disabled={loading || resendSeconds > 0}
                onClick={handleResendOtp}
              >
                {resendSeconds > 0
                  ? `Resend Code in ${resendSeconds}s`
                  : "Resend Code"}
              </Button>
            </div>
          </>
        )}

        {step === "password" && (
          <>
            <p
              className="text-mid"
              style={{ textAlign: "center", marginBottom: "1.5rem" }}
            >
              Your email has been verified. Create a new admin password.
            </p>

            <form onSubmit={handleResetPassword}>
              <Input
                id="admin-new-password"
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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-controls="admin-new-password"
                    title={
                      showPassword ? "Hide password" : "Show password"
                    }
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
                id="admin-confirm-new-password"
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
                    aria-controls="admin-confirm-new-password"
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
          </>
        )}

        {step === "success" && (
          <>
            <p
              className="text-mid"
              role="status"
              style={{ textAlign: "center", marginBottom: "1.5rem" }}
            >
              Your admin password has been reset. Sign in with your new
              password.
            </p>

            <Button
              type="button"
              className="btn-block"
              onClick={() => navigate("/admin/login", { replace: true })}
            >
              Go to Admin Login
            </Button>
          </>
        )}

        {["send", "otp", "password"].includes(step) && (
          <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <Link
              to="/admin/forgot-password"
              style={{
                color: "var(--color-primary-dark)",
                fontWeight: 700,
              }}
            >
              Request a new reset link
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}