import { cn } from "@/utils/cn";

const Badge = ({ children, className, variant = "primary" }) => {
  const variants = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    accent: "bg-accent text-gray-800"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded-full min-w-[20px]",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;