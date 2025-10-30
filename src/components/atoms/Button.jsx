import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "left",
      fullWidth = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
const variants = {
      primary: "bg-primary text-white hover:brightness-110 active:scale-95",
      secondary: "bg-secondary text-white hover:brightness-110 active:scale-95",
      outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
      ghost: "text-primary hover:bg-primary/10",
      warning: "bg-warning text-white hover:brightness-110 active:scale-95"
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg"
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          disabled && "opacity-50 cursor-not-allowed hover:brightness-100",
          className
        )}
        {...props}
      >
        {icon && iconPosition === "left" && (
          <ApperIcon name={icon} size={size === "sm" ? 16 : size === "lg" ? 24 : 20} />
        )}
        {children}
        {icon && iconPosition === "right" && (
          <ApperIcon name={icon} size={size === "sm" ? 16 : size === "lg" ? 24 : 20} />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;