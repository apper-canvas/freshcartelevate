import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const variants = {
  primary: "bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl",
  secondary: "bg-secondary hover:bg-secondary/90 text-white shadow-lg hover:shadow-xl",
  accent: "bg-accent hover:bg-accent/90 text-white shadow-lg hover:shadow-xl",
  outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
  ghost: "text-primary hover:bg-primary/10",
  success: "bg-success hover:bg-success/90 text-white shadow-lg hover:shadow-xl",
  warning: "bg-warning hover:bg-warning/90 text-white shadow-lg hover:shadow-xl",
  error: "bg-error hover:bg-error/90 text-white shadow-lg hover:shadow-xl"
};

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-base",
  lg: "h-12 px-6 text-lg",
  xl: "h-14 px-8 text-xl"
};

const Button = forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md",
  // Extract motion props to prevent them from being passed to DOM
  whileHover,
  whileTap,
  whileFocus,
  whileInView,
  animate,
  initial,
  exit,
  transition,
  ...props 
}, ref) => {
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