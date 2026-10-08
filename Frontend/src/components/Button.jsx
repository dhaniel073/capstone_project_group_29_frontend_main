export default function Button({ children, variant = "primary", loading, className = "", ...props }) {
  const v = variant === "secondary" ? "btn-secondary" : variant === "danger" ? "btn-danger" : "btn-primary";
  return (
    <button className={`btn ${v} ${className}`} {...props} disabled={loading || props.disabled}>
      {loading ? <span className="spinner" /> : children}
    </button>
  );
}
