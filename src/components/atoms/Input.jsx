import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-lg",
          "focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20",
          "transition-all duration-200",
          "placeholder:text-gray-400",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;