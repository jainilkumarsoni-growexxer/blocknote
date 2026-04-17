import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { login } from "../../services/authService";
import PasswordInput from "./PasswordInput";
import styles from "../../styles/auth.module.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login: setUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  }

  function validate() {
    const newErrors = { email: "", password: "" };
    let valid = true;

    if (!form.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
      valid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError("");

    try {
      const data = await login(form.email, form.password);
      setUser(data.user);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.card}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="3" width="12" height="2" rx="1" fill="#f5f4f0" />
            <rect x="2" y="7" width="8" height="2" rx="1" fill="#f5f4f0" />
            <rect x="2" y="11" width="10" height="2" rx="1" fill="#f5f4f0" />
          </svg>
        </div>
        <span className={styles.logoText}>BlockNote</span>
      </div>

      <h1 className={styles.heading}>Welcome back</h1>
      <p className={styles.subtitle}>Sign in to continue to your documents</p>

      {/* Server error banner */}
      {serverError && (
        <div className={styles.serverError}>{serverError}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
          />
          {errors.email && (
            <p className={styles.errorMsg}>{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <a href="#" className={styles.forgotLink}>
              Forgot password?
            </a>
          </div>
          <PasswordInput
            id="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            hasError={!!errors.password}
          />
          {errors.password && (
            <p className={styles.errorMsg}>{errors.password}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={styles.submitBtn}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className={styles.divider}>
        <div className={styles.dividerLine} />
        <span className={styles.dividerText}>or</span>
        <div className={styles.dividerLine} />
      </div>

      <p className={styles.switchLink}>
        Don't have an account?{" "}
        <Link to="/register" className={styles.link}>
          Create one free
        </Link>
      </p>
    </div>
  );
}