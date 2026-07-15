import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // 1. Added useNavigate to support form submission flows
import "./Login.css";
import LoginImg from "../../assets/Rebrand.jpg";
import api from "../../api";

const LoginScreen = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await api.post("/auth/login", {
                email: formData.email,
                password: formData.password,
            });

            if (res.data.role !== "admin") {
                setError("Access denied. Admin accounts only.");
                return;
            }

            const { token, firstName, lastName, email, role } = res.data;
            localStorage.setItem("adminToken", token);
            localStorage.setItem(
                "adminUser",
                JSON.stringify({ firstName, lastName, email, role }),
            );

            navigate("/admin");
        } catch (err) {
            console.error("Login failed:", err);
            setError(
                err.response?.data?.message ||
                    "Login failed. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-split-container">
                {/* Left Section: Interaction Form */}
                <div className="login-form-side">
                    <div className="inner-form-box">
                        <h1 className="login-main-heading">Welcome Admin!</h1>
                        <p className="login-sub-heading">
                            Enter your Credentials to access your workspace
                        </p>

                        <form
                            onSubmit={handleLoginSubmit}
                            className="auth-form-element"
                            id="loginForm"
                        >
                            {/* Email Entry */}
                            <div className="form-input-wrapper">
                                <label htmlFor="email">Email address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Password Entry */}
                            <div className="form-input-wrapper">
                                <div className="password-label-row">
                                    <label htmlFor="password">Password</label>
                                    <Link
                                        to="/forgot-password"
                                        className="forgot-pass-anchor"
                                    >
                                        forgot password
                                    </Link>
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Remember Tracker */}
                            <div className="remember-checkbox-row">
                                <label className="checkbox-custom-label">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                    />
                                    <span className="checkbox-text">
                                        Remember for 30 days
                                    </span>
                                </label>
                            </div>

                            {/* API error message */}
                            {error && (
                                <p className="login-error-message">{error}</p>
                            )}

                            {/* Real submit button wired to the auth API */}
                            <button
                                type="submit"
                                className="btn-solid-login"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Section: Illustrative Panel */}
                <div className="login-visual-side">
                    <div className="visual-rounded-card">
                        <img
                            src={LoginImg}
                            alt="Monstera Plant Layout"
                            className="side-panel-artwork"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
