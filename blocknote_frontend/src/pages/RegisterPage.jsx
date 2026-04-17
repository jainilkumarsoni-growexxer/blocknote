import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, Card, Input } from "../components/ui";
import { useAuth } from "../hooks/useAuth";
import { BackgroundLayer } from "../components/layout/BackgroundLayer";

const validatePassword = (password) => {
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/\d/.test(password)) return "Password must contain at least one number";
  return "";
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email is invalid";

    const passwordError = validatePassword(form.password);
    if (passwordError) newErrors.password = passwordError;

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // src/pages/RegisterPage.jsx (updated handleSubmit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register({ email: form.email, password: form.password });
      navigate("/login", { state: { message: "Registration successful! Please log in." } });
    } catch (err) {
      setErrors({ form: err.response?.data?.message || "Registration failed" });
    }
  };

  return (
    <>
      <BackgroundLayer />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <Card className="p-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-gradient">Create account</h1>
              <p className="mt-2 text-foreground-muted">Start building with BlockNote today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={errors.email}
                placeholder="you@example.com"
                autoComplete="email"
              />
              <Input
                label="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
                placeholder="At least 8 characters with a number"
                autoComplete="new-password"
              />
              <Input
                label="Confirm password"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
                placeholder="Re-enter your password"
                autoComplete="new-password"
              />

              {errors.form && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                  {errors.form}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-foreground-muted">
              Already have an account?{" "}
              <Link to="/login" className="text-accent hover:text-accent-bright transition-colors">
                Sign in
              </Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </>
  );
};