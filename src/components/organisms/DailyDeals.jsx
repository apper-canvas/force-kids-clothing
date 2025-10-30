import React from "react";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const DailyDeals = ({ products, onAddToCart }) => {
  const saleProducts = products.filter(p => p.salePrice).slice(0, 4);

  if (saleProducts.length === 0) return null;

  const calculateDiscount = (original, sale) => {
    return Math.round(((original - sale) / original) * 100);
  };

  return (
    <div className="bg-gradient-to-r from-error/10 via-primary/10 to-secondary/10 py-8 mb-8">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-error text-white p-3 rounded-full">
            <ApperIcon name="Flame" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold text-gray-800">
              Daily Deals
            </h2>
            <p className="text-gray-600">Limited time offers - Don't miss out!</p>
          </div>
        </div>

        <div className="overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-6 min-w-max lg:grid lg:grid-cols-4 lg:min-w-0">
            {saleProducts.map((product) => (
              <div
                key={product.Id}
                className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden w-72 lg:w-auto flex-shrink-0"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-error text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                    {calculateDiscount(product.price, product.salePrice)}% OFF
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-display font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
                    {product.title}
                  </h3>
                  
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-display font-bold text-error">
                      ${product.salePrice.toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/product/${product.Id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Deal
                      </Button>
                    </Link>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        onAddToCart({
                          productId: product.Id,
                          title: product.title,
                          price: product.salePrice,
                          image: product.image,
                          quantity: 1
                        });
                      }}
                      className="flex-shrink-0"
                    >
                      <ApperIcon name="ShoppingCart" size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyDeals;