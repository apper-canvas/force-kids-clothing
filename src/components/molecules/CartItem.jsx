import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleIncrease = () => {
    onUpdateQuantity(item.productId, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.productId, item.quantity - 1);
    }
  };

  return (
    <div className="flex gap-4 bg-white rounded-lg p-4 shadow-card">
      <img
        src={item.image}
        alt={item.title}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-800 truncate">{item.title}</h4>
        <p className="text-primary font-bold mt-1">${item.price.toFixed(2)}</p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={handleDecrease}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            disabled={item.quantity <= 1}
          >
            <ApperIcon name="Minus" size={14} />
          </button>
          <span className="w-8 text-center font-semibold">{item.quantity}</span>
          <button
            onClick={handleIncrease}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-primary text-white hover:brightness-110 transition-all"
          >
            <ApperIcon name="Plus" size={14} />
          </button>
        </div>
      </div>
      <button
        onClick={() => onRemove(item.productId)}
        className="text-error hover:bg-error/10 rounded-lg p-2 h-fit transition-colors"
      >
        <ApperIcon name="Trash2" size={18} />
      </button>
    </div>
  );
};

export default CartItem;