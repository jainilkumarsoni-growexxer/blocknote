import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PasswordInput from "./PasswordInput";
import PasswordStrength from "./PasswordStrength";
import { register } from "../../services/authService";
import styles from "../../styles/auth.module.css";
// import { useAuth } from "../../context/AuthContext";

// const { login } = useAuth();

export default function RegisterForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  }

  function validateEmail(email) {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address";
    return "";
  }

  function validatePassword(password) {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[0-9]/.test(password)) return "Password must contain at least 1 number";
    return "";
  }

  function validateConfirm(confirm, password) {
    if (!confirm) return "Please confirm your password";
    if (confirm !== password) return "Passwords do not match";
    return "";
  }

  function validate() {
    const emailErr = validateEmail(form.email);
    const passwordErr = validatePassword(form.password);
    const confirmErr = validateConfirm(form.confirm, form.password);

    setErrors({
      email: emailErr,
      password: passwordErr,
      confirm: confirmErr,
    });

    return !emailErr && !passwordErr && !confirmErr;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError("");

    try {
      const data = await register(form.email, form.password);
    //   login(data.user); // set user in global context
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
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
            <rect x="2" y="3" width="12" height="2" rx="1" fill="#F1EFE8" />
            <rect x="2" y="7" width="8" height="2" rx="1" fill="#F1EFE8" />
            <rect x="2" y="11" width="10" height="2" rx="1" fill="#F1EFE8" />
          </svg>
        </div>
        <span className={styles.logoText}>BlockNote</span>
      </div>

      <h1 className={styles.heading}>Create your account</h1>
      <p className={styles.subtitle}>Start writing with blocks in seconds</p>

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
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <PasswordInput
            id="password"
            name="password"
            placeholder="Min 8 chars, at least 1 number"
            value={form.password}
            onChange={handleChange}
            hasError={!!errors.password}
          />
          <PasswordStrength password={form.password} />
          {errors.password && (
            <p className={styles.errorMsg}>{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className={styles.field}>
          <label htmlFor="confirm" className={styles.label}>
            Confirm password
          </label>
          <PasswordInput
            id="confirm"
            name="confirm"
            placeholder="Re-enter your password"
            value={form.confirm}
            onChange={handleChange}
            hasError={!!errors.confirm}
          />
          {errors.confirm && (
            <p className={styles.errorMsg}>{errors.confirm}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={styles.submitBtn}
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <div className={styles.divider}>
        <div className={styles.dividerLine} />
        <span className={styles.dividerText}>or</span>
        <div className={styles.dividerLine} />
      </div>

      <p className={styles.switchLink}>
        Already have an account?{" "}
        <Link to="/login" className={styles.link}>
          Sign in
        </Link>
      </p>

      <p className={styles.terms}>
        By creating an account you agree to our{" "}
        <a href="#" className={styles.link}>Terms of Service</a>{" "}
        and{" "}
        <a href="#" className={styles.link}>Privacy Policy</a>
      </p>
    </div>
  );
}