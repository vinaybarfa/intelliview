import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const messageFor = (error) =>
    error?.response
        ? "Unable to sign in. Please check your email and password."
        : error?.message || "Unable to sign in. Please try again.";

const LoginForm = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const update = (event) => {
        setForm((current) => ({
            ...current,
            [event.target.name]: event.target.value,
        }));

        setError("");
    };

    const submit = async (event) => {
        event.preventDefault();

        const email = form.email.trim();

        if (!emailPattern.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!form.password) {
            setError("Please enter your password.");
            return;
        }

        setError("");
        setSubmitting(true);

        try {
            await login({
                email,
                password: form.password,
            });

            navigate("/app", { replace: true });
        } catch (error) {
            setError(messageFor(error));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={submit} noValidate>
            <div className="auth-field">
                <label htmlFor="login-email">Email</label>

                <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={update}
                    placeholder="you@example.com"
                    disabled={submitting}
                />
            </div>

            <div className="auth-field">
                <label htmlFor="login-password">Password</label>

                <div className="password-field">
                    <input
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={form.password}
                        onChange={update}
                        placeholder="Enter your password"
                        disabled={submitting}
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        aria-label={
                            showPassword ? "Hide password" : "Show password"
                        }
                    >
                        {showPassword ? (
                            <EyeOff size={17} />
                        ) : (
                            <Eye size={17} />
                        )}
                    </button>
                </div>
            </div>

            {error && (
                <p className="auth-error" role="alert">
                    {error}
                </p>
            )}

            <button
                className="button auth-submit"
                type="submit"
                disabled={submitting}
            >
                {submitting && (
                    <LoaderCircle size={16} className="spin" />
                )}

                {submitting ? "Signing in..." : "Sign In"}
            </button>

            <p className="auth-switch">
                Don't have an account?{" "}
                <Link to="/register">Create one</Link>
            </p>
        </form>
    );
};

export default LoginForm;