import React, { useEffect, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import CategoryButton from "@/components/molecules/CategoryButton";
import Loading from "@/components/ui/Loading";
import { cn } from "@/utils/cn";
import categoryService from "@/services/api/categoryService";

const CategorySidebar = ({ products, categories, categoriesLoading, selectedCategory, selectedSubcategory, onCategoryChange, onSubcategoryChange }) => {
  const [categoryCounts, setCategoryCounts] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null);
  
  useEffect(() => {
    const counts = {};
    const subcategoryCounts = {};
    
    if (products && Array.isArray(products)) {
      products.forEach((product) => {
        const category = product.category;
        counts[category] = (counts[category] || 0) + 1;
        
        if (product.subcategory) {
          const subKey = `${category}-${product.subcategory}`;
          subcategoryCounts[subKey] = (subcategoryCounts[subKey] || 0) + 1;
        }
      });
    }
    
    setCategoryCounts({ ...counts, ...subcategoryCounts });
  }, [products]);

  const getCategoryCount = (categoryName, subcategory = null) => {
    if (!products || products.length === 0) {
      return 0;
    }
    
    if (subcategory) {
      const subKey = `${categoryName}-${subcategory}`;
      return categoryCounts[subKey] || 0;
    }
    
    return categoryCounts[categoryName] || 0;
  };
const handleCategoryClick = (category) => {
    if (category.subcategories) {
      if (expandedCategory === category.name) {
        setExpandedCategory(null);
      } else {
        setExpandedCategory(category.name);
        onCategoryChange(category.name);
      }
    } else {
      setExpandedCategory(null);
      onCategoryChange(category.name);
    }
  };

  const handleSubcategoryClick = (categoryName, subcategory) => {
    onSubcategoryChange(categoryName, subcategory);
  };

  return (
    <>
      {/* Desktop Sidebar */}
<aside className="hidden lg:block w-60 shrink-0">
        <div className="sticky top-24 space-y-2">
{/* Category List */}
        <nav className="space-y-2">
          {categoriesLoading ? (
            <div className="text-center py-8 text-gray-500">Loading categories...</div>
          ) : !categories || categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No categories available</div>
          ) : (
            categories.map((category) => (
              <div key={category.id}>
                <div className="relative">
                <CategoryButton
                  category={category.name}
                  icon={category.icon}
                  isActive={selectedCategory === category.name && !selectedSubcategory}
                  onClick={() => handleCategoryClick(category)}
                  count={getCategoryCount(category.name)}
                />
                {category.subcategories && (
                  <button
                    onClick={() => setExpandedCategory(expandedCategory === category.name ? null : category.name)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded transition-all"
                  >
                    <ApperIcon
                      name="ChevronDown"
                      size={16}
                      className={cn(
                        "transition-transform duration-200",
                        expandedCategory === category.name && "rotate-180",
                        selectedCategory === category.name && !selectedSubcategory ? "text-white" : "text-gray-500"
                      )}
                    />
                  </button>
                )}
              </div>
              
              {category.subcategories && expandedCategory === category.name && (
                <div className="ml-4 mt-1 space-y-1 overflow-hidden">
                  {category.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleSubcategoryClick(category.name, sub.name)}
                      className={cn(
                        "flex items-center gap-2 w-full px-4 py-2 rounded-lg transition-all duration-200 text-sm",
                        "hover:bg-secondary/10",
                        selectedSubcategory === sub.name
                          ? "bg-secondary text-white shadow-md"
                          : "bg-white text-gray-600 shadow-card"
                      )}
                    >
                      <ApperIcon
                        name={sub.icon}
                        size={16}
                        className={selectedSubcategory === sub.name ? "text-white" : "text-secondary"}
                      />
                      <span className="flex-1 text-left font-medium">{sub.name}</span>
                      <span
                        className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded-full",
                          selectedSubcategory === sub.name
                            ? "bg-white/20"
                            : "bg-secondary/10 text-secondary"
                        )}
                      >
                        {getCategoryCount(category.name, sub.name)}
                      </span>
                    </button>
                  ))}
</div>
              )}
            </div>
          ))
          )}
</nav>
      </div>
    </aside>

    {/* Horizontal Scroll Categories */}
    <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 shadow-sm">
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {categoriesLoading ? (
            <div className="text-center py-4 text-gray-500 w-full">Loading...</div>
          ) : !categories || categories.length === 0 ? (
            <div className="text-center py-4 text-gray-500 w-full">No categories</div>
          ) : (
            categories.map((category) => (
              <React.Fragment key={category.id}>
                <button
                onClick={() => handleCategoryClick(category)}
                className={cn(
                  "px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-2",
                  selectedCategory === category.name && !selectedSubcategory
                    ? "bg-primary text-white shadow-md scale-105"
                    : "bg-white text-gray-700 shadow-card hover:bg-secondary/10"
                )}
              >
                <ApperIcon name={category.icon} size={16} />
                {category.name}
                <span
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full",
                    selectedCategory === category.name && !selectedSubcategory
                      ? "bg-white/20"
                      : "bg-primary/10 text-primary"
                  )}
                >
                  {getCategoryCount(category.name)}
                </span>
                {category.subcategories && (
                  <ApperIcon
                    name="ChevronDown"
                    size={14}
                    className={cn(
                      "transition-transform duration-200",
                      expandedCategory === category.name && "rotate-180"
                    )}
                  />
                )}
              </button>
              
              {category.subcategories && expandedCategory === category.name && (
                <>
                  {category.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleSubcategoryClick(category.name, sub.name)}
                      className={cn(
                        "px-3 py-2 rounded-full font-medium text-xs whitespace-nowrap transition-all duration-200 flex items-center gap-1.5",
                        selectedSubcategory === sub.name
                          ? "bg-secondary text-white shadow-md scale-105"
                          : "bg-white text-gray-600 shadow-card hover:bg-secondary/10"
                      )}
                    >
                      <ApperIcon name={sub.icon} size={14} />
                      {sub.name}
                      <span
                        className={cn(
                          "text-xs px-1.5 py-0.5 rounded-full",
                          selectedSubcategory === sub.name
                            ? "bg-white/20"
                            : "bg-secondary/10 text-secondary"
                        )}
                      >
                        {getCategoryCount(category.name, sub.name)}
                      </span>
                    </button>
))}
                </>
              )}
            </React.Fragment>
          ))
          )}
        </div>
      </div>
    </>
  );
};

export default CategorySidebar;