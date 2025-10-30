import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useCart } from "@/App";
import RecentlyViewed from "@/components/organisms/RecentlyViewed";
import ProductRecommendations from "@/components/organisms/ProductRecommendations";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import SizeGuideModal from "@/components/atoms/SizeGuideModal";
import ImageGalleryModal from "@/components/atoms/ImageGalleryModal";
import { cn } from "@/utils/cn";
import productService from "@/services/api/productService";
function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [complementaryProducts, setComplementaryProducts] = useState([]);
  useEffect(() => {
loadProduct();
    loadRecommendations();
  }, [id]);

  const { trackProductView, recentlyViewed } = useCart();

  useEffect(() => {
    if (product) {
      trackProductView(product.Id);
    }
  }, [product]);

async function loadProduct() {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getById(id);
      if (!data) {
        setError("Product not found");
      } else {
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          // Set first available (in-stock) size as default
          const firstAvailableSize = data.sizes.find(size => {
            const sizeStock = data.sizeStock?.[size] || 0;
            return sizeStock > 0;
          });
          setSelectedSize(firstAvailableSize || data.sizes[0]);
        }
      }
    } catch (err) {
      setError("Failed to load product details. Please try again.");
      console.error("Error loading product:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadRecommendations() {
    try {
      const [related, complementary] = await Promise.all([
        productService.getRelatedProducts(id, 6),
        productService.getComplementaryProducts(id, 4)
      ]);
      setRelatedProducts(related);
      setComplementaryProducts(complementary);
    } catch (err) {
      console.error("Error loading recommendations:", err);
      // Don't show error to user - recommendations are optional
    }
  }


  const { addToCart } = useCart();

function handleAddToCart() {
    // Check if product is out of stock
    if (product.stockStatus === 'out-of-stock') {
      toast.error("This item is currently out of stock");
      return;
    }
    
    // For clothing items, validate size selection and stock
    if (product.category === "Kids Clothing") {
      if (!selectedSize) {
        toast.error("Please select a size");
        return;
      }
      
      const sizeStock = product.sizeStock?.[selectedSize] || 0;
      if (sizeStock === 0) {
        toast.error(`Size ${selectedSize} is out of stock`);
        return;
      }
      
      if (quantity > sizeStock) {
        toast.error(`Only ${sizeStock} items available in size ${selectedSize}`);
        return;
      }
    } else {
      // For non-clothing items, check general stock
      if (quantity > product.stockLevel) {
        toast.error(`Only ${product.stockLevel} items available`);
        return;
      }
    }

    addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: quantity,
      size: selectedSize || undefined
    });

    setIsAdded(true);
    toast.success(`${product.title} added to cart!`);
    
    setTimeout(() => setIsAdded(false), 2000);
  }

  function handleQuantityChange(change) {
const newQuantity = quantity + change;
    
    // Determine max quantity based on product type and stock
    let maxQuantity = 10; // default max
    if (product.category === "Kids Clothing" && selectedSize) {
      const sizeStock = product.sizeStock?.[selectedSize] || 0;
      maxQuantity = Math.min(sizeStock, 10);
    } else {
      maxQuantity = Math.min(product.stockLevel || 0, 10);
    }
    
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Loading message="Loading product details..." />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Error
            message={error || "Product not found"}
            onRetry={loadProduct}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Home
          </Link>
          <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
          <span className="text-gray-600">{product.category}</span>
          <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
          <span className="text-gray-800 font-semibold line-clamp-1">
            {product.title}
          </span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-card overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
{/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div 
                className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-zoom-in group"
                onClick={() => setIsZoomOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsZoomOpen(true);
                  }
                }}
                aria-label="Click to zoom image"
              >
                <img
                  src={product.images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Zoom Icon Overlay */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ApperIcon name="ZoomIn" size={20} className="text-white" />
                </div>
                
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-error text-white px-6 py-3 rounded-lg font-semibold text-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200",
                        selectedImage === index
                          ? "border-primary shadow-md scale-105 ring-2 ring-primary/20"
                          : "border-gray-200 hover:border-primary/50 hover:shadow-sm"
                      )}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
              
              {/* Image Gallery Modal */}
              <ImageGalleryModal
                isOpen={isZoomOpen}
                onClose={() => setIsZoomOpen(false)}
                images={product.images}
                currentIndex={selectedImage}
                onNavigate={setSelectedImage}
                productTitle={product.title}
              />
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Title and Category */}
<div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                    {product.category}
                  </Badge>
                  {product.stockStatus === 'in-stock' && (
                    <Badge className="bg-success/10 text-success border-success/20 flex items-center gap-1">
                      <ApperIcon name="CheckCircle" size={14} />
                      <span>In Stock ({product.stockLevel} left)</span>
                    </Badge>
                  )}
                  {product.stockStatus === 'low-stock' && (
                    <Badge className="bg-warning/10 text-warning border-warning/20 flex items-center gap-1">
                      <ApperIcon name="AlertTriangle" size={14} />
                      <span>Low Stock ({product.stockLevel} left)</span>
                    </Badge>
                  )}
                  {product.stockStatus === 'out-of-stock' && (
                    <Badge className="bg-error/10 text-error border-error/20 flex items-center gap-1">
                      <ApperIcon name="XCircle" size={14} />
                      <span>Out of Stock</span>
                    </Badge>
                  )}
                </div>
                <h1 className="font-display font-bold text-3xl lg:text-4xl text-gray-800 mb-2">
                  {product.title}
                </h1>
                {product.ageRange && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <ApperIcon name="Users" size={18} />
                    <span className="text-sm">
                      Recommended for ages {product.ageRange}
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-display font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {/* Description */}
              <div>
                <h2 className="font-display font-semibold text-lg text-gray-800 mb-2">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {product.fullDescription}
                </p>
              </div>

{/* Size Selection (for Clothing) */}
{product.category === "Kids Clothing" && product.sizes && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-semibold text-lg text-gray-800">
                      Select Size
                    </h3>
                    {product.sizeRecommendation && (
                      <Badge variant="secondary" className="text-xs">
                        {product.sizeRecommendation}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => {
                      const sizeStock = product.sizeStock?.[size] || 0;
                      const isOutOfStock = sizeStock === 0;
                      const isLowStock = sizeStock > 0 && sizeStock <= 5;
                      
                      return (
                        <button
                          key={size}
                          onClick={() => !isOutOfStock && setSelectedSize(size)}
                          disabled={isOutOfStock}
                          className={cn(
                            "px-6 py-3 rounded-lg font-semibold transition-all duration-200 min-w-[80px] relative",
                            selectedSize === size && !isOutOfStock
                              ? "bg-primary text-white shadow-md scale-105"
                              : isOutOfStock
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          )}
                          title={isOutOfStock ? "Out of stock" : `${sizeStock} available`}
                        >
                          <div className="flex flex-col items-center">
                            <span>{size}</span>
                            {!isOutOfStock && (
                              <span className={cn(
                                "text-xs mt-1",
                                selectedSize === size ? "text-white/80" : isLowStock ? "text-warning" : "text-gray-500"
                              )}>
                                {sizeStock} left
                              </span>
                            )}
                            {isOutOfStock && (
                              <span className="text-xs mt-1">Out</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mt-3 text-sm font-semibold"
                  >
                    <ApperIcon name="Ruler" size={16} />
                    <span>View Size Guide</span>
                  </button>
                </div>
              )}

              {/* Quantity Selector */}
<div>
                <h3 className="font-display font-semibold text-lg text-gray-800 mb-3">
                  Quantity
                </h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1 || product.stockStatus === 'out-of-stock'}
                    className="w-12 h-12 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <ApperIcon name="Minus" size={20} />
                  </button>
                  <span className="text-2xl font-display font-semibold text-gray-800 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={product.stockStatus === 'out-of-stock'}
                    className="w-12 h-12 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    <ApperIcon name="Plus" size={20} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
<div className="flex flex-col sm:flex-row gap-3 pt-4">
                {product.stockStatus === 'out-of-stock' ? (
                  <Button
                    onClick={() => toast.info("We'll notify you when this item is back in stock!")}
                    size="lg"
                    icon="Bell"
                    variant="secondary"
                    className="flex-1 bg-warning hover:brightness-110"
                  >
                    Notify When Available
                  </Button>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    size="lg"
                    icon={isAdded ? "Check" : "ShoppingCart"}
                    className={cn(
                      "flex-1",
                      isAdded && "bg-success hover:brightness-100"
                    )}
                  >
                    {isAdded ? "Added to Cart!" : "Add to Cart"}
                  </Button>
                )}
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  size="lg"
                  icon="ArrowLeft"
                  className="sm:w-auto"
                >
                  Continue Shopping
                </Button>
              </div>

              {/* Product Features */}
              <div className="border-t border-gray-200 pt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <ApperIcon
                    name="Truck"
                    size={20}
                    className="text-secondary mt-1"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      Free Shipping
                    </p>
                    <p className="text-sm text-gray-600">
                      On orders over $50
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ApperIcon
                    name="RotateCcw"
                    size={20}
                    className="text-secondary mt-1"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      Easy Returns
                    </p>
                    <p className="text-sm text-gray-600">
                      30-day return policy
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ApperIcon
                    name="Shield"
                    size={20}
                    className="text-secondary mt-1"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      Secure Payment
                    </p>
                    <p className="text-sm text-gray-600">
                      Your payment is safe
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
</motion.div>

      {/* Size Guide Modal */}
      <SizeGuideModal 
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product?.category}
      />

        {/* Product Recommendations */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductRecommendations
            title="You May Also Like"
            products={relatedProducts}
            onAddToCart={addToCart}
            icon="Sparkles"
          />

          <ProductRecommendations
            title="Frequently Bought Together"
            products={complementaryProducts}
            onAddToCart={addToCart}
            icon="Package"
          />

          <RecentlyViewed 
            products={recentlyViewed.filter(p => p.Id !== product?.Id)} 
            onAddToCart={addToCart}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;