import { useState } from "react";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
const ProductCard = ({ product, onAddToCart }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1000);
  };

  return (
<Link to={`/product/${product.Id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden group hover:scale-[1.03] cursor-pointer"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image_c}
            alt={product.title_c}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {product.sale_price_c && (
            <div className="absolute top-2 right-2 bg-error text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
              SALE
            </div>
          )}
          {product.stock_level_c === 0 && (
            <div className="absolute top-2 left-2">
              <div className="flex items-center gap-1 bg-error text-white px-3 py-1.5 rounded-lg font-semibold text-sm shadow-md">
                <ApperIcon name="XCircle" size={16} />
                <span>Out of Stock</span>
              </div>
            </div>
          )}
          {product.stock_level_c > 0 && product.stock_level_c <= 5 && (
            <div className="absolute top-2 left-2">
              <div className="flex items-center gap-1 bg-warning text-white px-3 py-1.5 rounded-lg font-semibold text-sm shadow-md">
                <ApperIcon name="AlertTriangle" size={16} />
                <span>Low Stock</span>
              </div>
            </div>
          )}
          {product.stock_level_c > 5 && (
            <div className="absolute top-2 left-2">
              <div className="flex items-center gap-1 bg-success text-white px-3 py-1.5 rounded-lg font-semibold text-sm shadow-md">
                <ApperIcon name="CheckCircle" size={16} />
                <span>In Stock</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-display font-semibold text-lg text-gray-800 mb-1 line-clamp-2">
            {product.title_c}
          </h3>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {product.description_c}
          </p>
<div className="flex items-center justify-between">
            <div className="flex flex-col">
              {product.sale_price_c ? (
                <>
                  <span className="text-2xl font-display font-bold text-error">
                    ${product.sale_price_c.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${product.price_c.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-display font-bold text-primary">
                  ${product.price_c.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="Eye" size={16} />
              <span>View Details</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;