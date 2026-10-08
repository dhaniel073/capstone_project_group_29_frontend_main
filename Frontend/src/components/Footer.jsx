import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
    { icon: "🚀", title: "Fast Local Delivery", text: "Same-day delivery directly to your door." },
    { icon: "🥬", title: "100% Fresh Guarantee", text: "Sourced fresh daily from verified local farms." },
    { icon: "🔒", title: "Secure Payments", text: "Protected checkouts powered by Paystack." },
];

export default function Footer({ categories = [], onCategorySelect }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    const handleCategory = (name) => {
        if (typeof onCategorySelect === "function") onCategorySelect(name);
        scrollTop();
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-features">
                    {FEATURES.map((f) => (
                        <div className="footer-feature" key={f.title}>
                            <div className="footer-feature-icon">{f.icon}</div>
                            <div>
                                <h4>{f.title}</h4>
                                <p>{f.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="footer-columns">
                    <div>
                        <div className="footer-brand">
                            <div className="footer-logo">S</div>
                            <span>Supermarket</span>
                        </div>
                        <p className="footer-about">
                            Your one-stop community supermarket application built for speed,
                            fresh supplies, and easy ordering.
                        </p>
                    </div>

                    <div>
                        <h5>Categories</h5>
                        <ul>
                            {categories.map((c) => {
                                const name = typeof c === "string" ? c : c.name;
                                const key = typeof c === "string" ? c : c._id || c.name;
                                return (
                                    <li key={key}>
                                        <button onClick={() => handleCategory(name)}>{name}</button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div>
                        <h5>Quick Links</h5>
                        <ul>
                            <li><Link to="/cart">View Basket</Link></li>
                            <li><button onClick={scrollTop}>Search Products</button></li>
                            {user && (
                                <li><button className="footer-danger" onClick={handleLogout}>Account Logout</button></li>
                            )}
                        </ul>
                    </div>

                    <div>
                        <h5>Capstone Project</h5>
                        <p className="footer-about">
                            Built by <strong>Group 29</strong>. Full-stack supermarket
                            implementation with Node.js, Express, React, and MongoDB.
                        </p>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Supermarket App (Group 29). All rights reserved.</p>
                    <div>
                        <span>Privacy Policy</span>
                        <span>•</span>
                        <span>Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}