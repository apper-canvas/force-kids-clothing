import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No Items Found", 
  message = "We couldn't find what you're looking for", 
  actionLabel,
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="Package" className="text-secondary" size={48} />
      </div>
      <h3 className="text-2xl font-display font-semibold text-gray-800 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-center max-w-md mb-6">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:brightness-110 transition-all duration-200 flex items-center gap-2"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;