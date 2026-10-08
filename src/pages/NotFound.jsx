import { Link, useLocation } from "react-router";

export default function NotFound() {
    const location = useLocation();

    return (
        <div className="center-shell">
            <div
                className="card"
                style={{
                    width: "100%",
                    maxWidth: 460,
                    padding: "2rem",
                    textAlign: "center",
                }}
            >
                <p
                    style={{
                        margin: "0 0 0.5rem",
                        color: "var(--color-primary-dark)",
                        fontSize: "4rem",
                        fontWeight: 800,
                        lineHeight: 1,
                    }}
                >
                    404
                </p>

                <h1
                    style={{
                        fontSize: "1.5rem",
                        marginBottom: "0.75rem",
                    }}
                >
                    Page not found
                </h1>

                <p
                    className="text-mid"
                    style={{
                        lineHeight: 1.6,
                        marginBottom: "1rem",
                    }}
                >
                    We couldn’t find the page you’re looking for.
                    The address may be incorrect, or the page may have moved.
                </p>

                <p
                    className="text-mid"
                    style={{
                        fontFamily: "monospace",
                        fontSize: "0.85rem",
                        overflowWrap: "anywhere",
                        marginBottom: "1.5rem",
                    }}
                >
                    {location.pathname}
                </p>

                <Link
                    to="/"
                    className="btn btn-block"
                    style={{
                        display: "block",
                        backgroundColor: "var(--color-primary-dark)",
                        color: "#ffffff",
                        padding: "0.85rem 1rem",
                        borderRadius: 8,
                        textDecoration: "none",
                        fontWeight: 700,
                    }}
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}