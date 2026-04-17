
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LayoutDashboard, LogOut } from "lucide-react";
import { Button, Card } from "../components/ui";
import { BackgroundLayer } from "../components/layout/BackgroundLayer";
import { useAuth } from "../hooks/useAuth";

const features = [
  {
    title: "Block‑based editing",
    description: "Paragraphs, headings, todos, code—every piece is a block you can move and style.",
    icon: "📝",
  },
  {
    title: "Real‑time auto‑save",
    description: "Never lose a thought. Changes save instantly with visual feedback.",
    icon: "💾",
  },
  {
    title: "Share as read‑only",
    description: "Generate a public link anyone can view. Revoke access anytime.",
    icon: "🔗",
  },
  {
    title: "Precision interactions",
    description: "Every animation and transition is tuned to feel native and responsive.",
    icon: "⚡",
  },
];

export const HomePage = () => {
  const { isAuthenticated, isInitialized, logout } = useAuth();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const renderAuthButtons = () => {
    if (!isInitialized) return null;
    if (isAuthenticated) {
      return (
        <>
          <Button size="lg" onClick={() => navigate("/dashboard")}>
            <LayoutDashboard className="mr-2 h-5 w-5" />
            Dashboard
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </>
      );
    }
    return (
      <>
        <Button size="lg" as={Link} to="/register">
          Get started — it's free
        </Button>
        <Button size="lg" variant="secondary" as={Link} to="/login">
          Sign in
        </Button>
      </>
    );
  };

  return (
    <>
      <BackgroundLayer />
      <div ref={containerRef} className="relative z-10">
        {/* Hero Section */}
        <section className="relative flex min-h-screen items-center justify-center px-4 py-20 md:py-32">
          <motion.div
            style={{ y, opacity }}
            className="container mx-auto max-w-5xl text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-block rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 text-xs font-mono tracking-widest text-accent">
                BLOCKNOTE
              </span>
              <h1 className="mt-8 text-5xl font-semibold tracking-[-0.03em] text-gradient md:text-7xl lg:text-8xl">
                Write, organize, <br />
                <span className="text-gradient-accent animate-shimmer bg-[length:200%_auto]">
                  and share.
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground-muted md:text-xl">
                A block‑based document editor built for clarity and speed. Create
                rich notes, todos, and code blocks—all with a premium, native feel.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                {renderAuthButtons()}
              </div>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-2 text-foreground-subtle">
              <span className="text-xs tracking-widest">SCROLL</span>
              <div className="h-10 w-0.5 bg-gradient-to-b from-white/20 to-transparent" />
            </div>
          </motion.div>
        </section>

        {/* Features Grid – all cards equal size */}
        <section className="container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-16 text-center text-4xl font-semibold tracking-tight text-gradient md:text-5xl">
              Everything you need, <br />
              nothing you don't.
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                >
                  <Card className="h-full p-6">
                    <div className="flex h-full flex-col">
                      <div className="mb-4 text-3xl">{feature.icon}</div>
                      <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                      <p className="text-foreground-muted">{feature.description}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border py-24">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-semibold tracking-tight text-gradient md:text-5xl">
                Start building your workspace.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-foreground-muted">
                Join thousands of developers and creators who use BlockNote to
                capture ideas.
              </p>

              <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" as={Link} to="/register">
                  Create free account
                </Button>
              </div>

            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8">
          <div className="container mx-auto px-4 text-center text-sm text-foreground-subtle">
            <p>© 2026 BlockNote. Crafted with precision.</p>
          </div>
        </footer>
      </div>
    </>
  );
};