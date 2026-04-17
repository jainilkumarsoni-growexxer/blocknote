import { useRef, useEffect } from "react";
import { cn } from "../../utils/cn";
import { useMouseGlow } from "../../hooks/useMouseGlow";

const Card = ({ className, children, spotlight = true, ...props }) => {
  const cardRef = useRef(null);
  const { handleMouseMove, handleMouseLeave, style } = useMouseGlow();

  useEffect(() => {
    const el = cardRef.current;
    if (!el || !spotlight) return;
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [spotlight, handleMouseMove, handleMouseLeave]);

  return (
    <div
      ref={cardRef}
      // className={cn(
      //   "relative rounded-2xl border border-border bg-gradient-to-b from-white/8 to-white/2 p-6 shadow-card transition-shadow duration-200 ease-expo-out hover:shadow-card-hover",
      //   spotlight && "overflow-hidden",
      //   className
      // )}
      className={cn(
        "relative rounded-2xl border border-border bg-gradient-to-b from-white/8 to-white/2 p-6 shadow-card transition-shadow duration-200 ease-expo-out hover:shadow-card-hover",
        // Remove overflow-hidden; spotlight will still work if we use ::before
        className
      )}
      style={spotlight ? style : undefined}
      {...props}
    >
      {spotlight && (
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(94,106,210,0.15), transparent 80%)`,
            opacity: "var(--spotlight-opacity, 0)",
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default Card;