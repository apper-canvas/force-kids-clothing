import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertCircle" className="text-error" size={40} />
      </div>
      <h3 className="text-2xl font-display font-semibold text-gray-800 mb-2">
        Oops! Something Went Wrong
      </h3>
      <p className="text-gray-600 text-center max-w-md mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:brightness-110 transition-all duration-200 flex items-center gap-2"
        >
          <ApperIcon name="RotateCw" size={20} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;