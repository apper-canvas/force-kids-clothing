import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router-dom";
import DailyDeals from "@/components/organisms/DailyDeals";
import CategorySidebar from "@/components/organisms/CategorySidebar";
import CartPanel from "@/components/organisms/CartPanel";
import Header from "@/components/organisms/Header";
import ProductGrid from "@/components/organisms/ProductGrid";
import RecentlyViewed from "@/components/organisms/RecentlyViewed";
import productService from "@/services/api/productService";
import categoryService from "@/services/api/categoryService";
function ShopPage() {
const { addToCart, recentlyViewed } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);
  const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Handle URL parameters for category filtering
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const subcategoryParam = urlParams.get('subcategory');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      if (subcategoryParam) {
        setSelectedSubcategory(subcategoryParam);
      } else {
        setSelectedSubcategory(null);
      }
    }
  }, []);

  // Listen for URL changes to update filters
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const categoryParam = urlParams.get('category');
      const subcategoryParam = urlParams.get('subcategory');
      
      if (categoryParam) {
        setSelectedCategory(categoryParam);
        setSelectedSubcategory(subcategoryParam);
      } else {
        setSelectedCategory("All");
        setSelectedSubcategory(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError(null);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
      setCategoriesError(error.message);
      toast.error("Failed to load categories");
    } finally {
      setCategoriesLoading(false);
    }
  };

  async function loadProducts() {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }
const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
  };

  const handleSubcategoryChange = (categoryName, subcategory) => {
    setSelectedCategory(categoryName);
    setSelectedSubcategory(subcategory);
  };

const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || 
      (selectedCategory === "Flash Sales" ? !!product.salePrice : 
       selectedSubcategory ? product.subcategory === selectedSubcategory : 
       product.category === selectedCategory);
    const matchesSearch =
      searchQuery === "" ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
<Header
        onSearch={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        categories={categories}
        categoriesLoading={categoriesLoading}
      />
      
<div className="pt-20 sm:pt-24">
        <DailyDeals products={products} onAddToCart={addToCart} />
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
<div className="flex gap-6">
          <CategorySidebar
            products={products}
            categories={categories}
            categoriesLoading={categoriesLoading}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            onCategoryChange={handleCategoryChange}
            onSubcategoryChange={handleSubcategoryChange}
          />
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>

      <CartPanel
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RecentlyViewed 
          products={recentlyViewed} 
          onAddToCart={addToCart}
        />
      </div>
    </div>
  );
}

export default ShopPage;