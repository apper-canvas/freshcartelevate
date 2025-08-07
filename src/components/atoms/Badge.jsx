import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary to-success text-white",
    secondary: "bg-gradient-to-r from-secondary to-warning text-white",
    accent: "bg-gradient-to-r from-accent to-warning text-white",
    success: "bg-gradient-to-r from-success to-green-500 text-white",
    warning: "bg-gradient-to-r from-warning to-yellow-500 text-white",
    error: "bg-gradient-to-r from-error to-red-600 text-white",
    outline: "border border-primary text-primary bg-white"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ease-out",
        "shadow-sm hover:shadow-md transform hover:scale-105",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;