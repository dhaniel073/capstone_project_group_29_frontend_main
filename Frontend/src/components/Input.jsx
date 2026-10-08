export default function Input({
  label,
  error,
  rightElement,
  id,
  name,
  ...props
}) {
  const inputId = id || name;

  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={inputId}>
          {label}
        </label>
      )}

      {rightElement ? (
        <div className="password-input-wrapper">
          <input
            id={inputId}
            name={name}
            className="password-input"
            {...props}
          />

          {rightElement}
        </div>
      ) : (
        <input id={inputId} name={name} {...props} />
      )}

      {error && (
        <p
          className="text-danger"
          style={{
            fontSize: "0.78rem",
            marginTop: "0.3rem",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}