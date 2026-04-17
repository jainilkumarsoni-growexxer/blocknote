import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Input = forwardRef(({ className, type = "text", error, ...props }, ref) => {
  return (
    <div className="w-full">
      <input
        type={type}
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-white/10 bg-[#0F0F12] px-4 py-2.5 text-foreground placeholder:text-foreground-subtle",
          "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30",
          "transition-colors duration-200",
          error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/30",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;