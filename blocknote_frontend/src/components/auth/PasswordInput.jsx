import { useState } from "react";
import styles from "../../styles/auth.module.css";

export default function PasswordInput({
  id,
  name,
  placeholder,
  value,
  onChange,
  hasError,
}) {
  const [show, setShow] = useState(false);

  return (
    <div className={styles.passwordWrap}>
      <input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={name === "password" ? "new-password" : "off"}
        className={`${styles.input} ${hasError ? styles.inputError : ""}`}
      />
      <button
        type="button"
        tabIndex={-1}
        className={styles.eyeBtn}
        onClick={() => setShow((prev) => !prev)}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 3C4.5 3 1.5 5.5 0.5 8c1 2.5 4 5 7.5 5s6.5-2.5 7.5-5C14.5 5.5 11.5 3 8 3zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-4.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M1 1l14 14" />
      <path d="M6.5 6.6A3 3 0 0 0 8 11a3 3 0 0 0 2.9-3.7" />
      <path d="M4.2 4.3C2.2 5.4.8 6.6.5 8c1 2.5 4 5 7.5 5 1.4 0 2.8-.4 4-1" />
      <path d="M8 3c3.5 0 6.5 2.5 7.5 5-.4 1-1.2 2-2.3 2.9" />
    </svg>
  );
}