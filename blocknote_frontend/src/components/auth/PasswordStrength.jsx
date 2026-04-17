import styles from "../../styles/auth.module.css";

function getStrength(password) {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  const levels = [
    { label: "Weak",   color: "#E24B4A" },
    { label: "Weak",   color: "#E24B4A" },
    { label: "Fair",   color: "#EF9F27" },
    { label: "Good",   color: "#1D9E75" },
    { label: "Strong", color: "#0F6E56" },
  ];

  return { score, ...levels[score] };
}

export default function PasswordStrength({ password }) {
  const { score, label, color } = getStrength(password);

  if (!password) return null;

  return (
    <div className={styles.strengthWrap}>
      <div className={styles.strengthBar}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={styles.strengthSeg}
            style={{
              background: i <= score ? color : "var(--color-border-tertiary)",
            }}
          />
        ))}
      </div>
      {label && (
        <span className={styles.strengthLabel} style={{ color }}>
          {label}
        </span>
      )}
    </div>
  );
}