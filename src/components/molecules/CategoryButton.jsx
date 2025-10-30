import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CategoryButton = ({ category, icon, isActive, onClick, count }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200",
        "hover:bg-secondary/10 hover:scale-105",
        isActive
          ? "bg-primary text-white shadow-md scale-105"
          : "bg-white text-gray-700 shadow-card"
      )}
    >
      <ApperIcon
        name={icon}
        size={20}
        className={isActive ? "text-white" : "text-primary"}
      />
      <span className="flex-1 text-left font-medium">{category}</span>
      {count !== undefined && (
        <span
          className={cn(
            "text-xs font-semibold px-2 py-0.5 rounded-full",
            isActive ? "bg-white/20" : "bg-primary/10 text-primary"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export default CategoryButton;