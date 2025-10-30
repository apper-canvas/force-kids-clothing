import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

export default function ProductRecommendations({ title, products, onAddToCart, icon = "Sparkles" }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <div className="flex items-center gap-2 mb-6">
        <ApperIcon name={icon} size={24} className="text-primary" />
        <h2 className="text-2xl font-display font-semibold text-gray-900">
          {title}
        </h2>
      </div>

      <div className="relative">
        <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          <div className="flex gap-4 min-w-min">
            {products.map((product, index) => (
              <motion.div
                key={product.Id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 w-48 sm:w-56"
              >
                <Link
                  to={`/product/${product.Id}`}
                  className="group block bg-surface rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-2 right-2 bg-error text-white text-xs font-bold px-2 py-1 rounded">
                        -{product.discount}%
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-display font-semibold text-sm text-gray-900 line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-lg font-bold text-primary">
                        ${product.price}
                      </p>
                      {product.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          ${product.originalPrice}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
                <div className="px-3 pb-3">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      onAddToCart(product);
                    }}
                    className="w-full py-2 text-sm"
                    size="sm"
                  >
                    <ApperIcon name="ShoppingCart" size={14} />
                    Add to Cart
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}