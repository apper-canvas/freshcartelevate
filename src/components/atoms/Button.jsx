import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "medium", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-success text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-gradient-to-r from-secondary to-warning text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]",
    accent: "bg-gradient-to-r from-accent to-warning text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white bg-white shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
    ghost: "text-primary hover:bg-primary/10 hover:text-primary transform hover:scale-[1.02] active:scale-[0.98]",
    danger: "bg-gradient-to-r from-error to-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
  };

  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
    icon: "p-2"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;