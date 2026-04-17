


import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const variants = {
  primary: "bg-accent text-white shadow-glow hover:bg-accent-bright active:scale-[0.98]",
  secondary: "bg-white/5 text-foreground shadow-inner-highlight hover:bg-white/8 hover:shadow-card-hover",
  ghost: "text-foreground-muted hover:bg-white/5 hover:text-foreground",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-6 py-3 text-base rounded-lg",
};

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  as: Component = "button", 
  children, 
  ...props 
}, ref) => {
  return (
    <Component
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-200 ease-expo-out",
        "focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background-base",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});

Button.displayName = "Button";
export default Button;




