import ApperIcon from "@/components/ApperIcon";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <ApperIcon
          name="ShoppingBag"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary"
          size={28}
        />
      </div>
      <p className="mt-6 text-lg font-medium text-gray-600">Loading products...</p>
      <p className="mt-2 text-sm text-gray-500">Finding the best deals for your family</p>
    </div>
  );
};

export default Loading;