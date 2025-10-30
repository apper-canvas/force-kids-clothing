import { Link } from "react-router-dom";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useCart } from "@/App";
import { useAuth } from "@/contexts/AuthContext";
import categoryService from "@/services/api/categoryService";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import SearchBar from "@/components/molecules/SearchBar";

const HARDCODED_CATEGORIES = [
  { id: "flash-sales", name: "Flash Sales", icon: "Flame" },
  { 
    id: "kids-clothing", 
    name: "Kids Clothing", 
    icon: "Shirt",
    subcategories: [
      { id: "baby", name: "Baby (0-2)", icon: "Baby" },
      { id: "toddler", name: "Toddler (2-4)", icon: "Smile" },
      { id: "kids", name: "Kids (4-8)", icon: "User" },
      { id: "teen", name: "Teen (8+)", icon: "UserCircle" }
    ]
  },
  { id: "accessories", name: "Accessories", icon: "Watch" },
  { id: "toys", name: "Toys", icon: "Gamepad2" },
  { id: "home-goods", name: "Home Goods", icon: "Home" },
  { id: "mom-dad", name: "Mom & Dad", icon: "Users" }
];

const Header = ({ onSearch, onOpenCart, categories, categoriesLoading }) => {
  const { totalItems } = useCart();
const { logout } = useAuth();
  const user = useSelector((state) => state.user.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  
const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  // Close dropdown when clicking outside
useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
<div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <ApperIcon name="ShoppingBag" className="text-white" size={24} />
            </div>
            <span className="ml-2 text-xl font-bold font-display text-gray-800 hidden sm:block">
              Kids Clothing Store
            </span>
          </Link>

          {/* Categories Dropdown - Desktop */}
          <div className="relative hidden lg:block" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onMouseEnter={() => setIsDropdownOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-lg transition-all duration-200"
            >
              <ApperIcon name="Grid3x3" size={20} />
              <span>Categories</span>
              <ApperIcon 
                name={isDropdownOpen ? "ChevronUp" : "ChevronDown"} 
                size={16} 
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
<div 
                className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                {categoriesLoading ? (
                  <div className="px-4 py-3 text-center text-gray-500">Loading categories...</div>
                ) : !categories || categories.length === 0 ? (
                  <div className="px-4 py-3 text-center text-gray-500">No categories available</div>
                ) : (
categories.map((category) => (
                    <div key={category.id_c || category.Id}>
                      {category.subcategories && category.subcategories.length > 0 ? (
<div className="group relative">
                          <Link
                            to={`/?category=${category.name_c || category.Name}`}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/10 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <ApperIcon name={category.icon_c || category.icon} size={20} className="text-primary" />
                            <span className="font-medium text-gray-700">{category.name_c || category.Name}</span>
                            <ApperIcon name="ChevronRight" size={16} className="ml-auto text-gray-400" />
                          </Link>
                          {/* Subcategories */}
                          <div className="hidden group-hover:block absolute left-full top-0 ml-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                            {category.subcategories.map((sub) => (
<Link
                               key={sub.id_c || sub.Id}
                               to={`/?category=${category.name_c || category.Name}&subcategory=${sub.name_c || sub.name}`}
                               className="flex items-center gap-3 px-4 py-2 hover:bg-secondary/10 transition-colors"
                               onClick={() => setIsDropdownOpen(false)}
                             >
                                <ApperIcon name={sub.icon_c || sub.icon} size={18} className="text-secondary" />
                                <span className="text-gray-700">{sub.name_c || sub.name}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
) : (
                        <Link
                          to={`/?category=${category.name_c || category.Name}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/10 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <ApperIcon name={category.icon_c || category.icon} size={20} className="text-primary" />
                          <span className="font-medium text-gray-700">{category.name_c || category.Name}</span>
                        </Link>
                      )}
</div>
                  ))
                )}
              </div>
            )}
</div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <SearchBar onSearch={onSearch} placeholder="Search for toys, clothing, and more..." />
          </div>

          {/* User Menu and Cart */}
          <div className="flex items-center gap-2">
            {/* User Menu */}
            {user && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {user.firstName?.[0] || user.name?.[0] || 'U'}
                  </div>
                  <ApperIcon name="ChevronDown" size={16} className="text-gray-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-medium text-gray-800 truncate">
                        {user.firstName} {user.lastName || user.name || 'User'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-error/10 text-error transition-colors"
                    >
                      <ApperIcon name="LogOut" size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="ShoppingCart" size={24} className="text-gray-700" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 min-w-[20px] h-5 text-xs">
                  {totalItems > 99 ? "99+" : totalItems}
                </Badge>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-secondary/10 rounded-lg transition-all duration-200"
            >
              <ApperIcon name="Menu" size={24} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="bg-white h-full w-80 max-w-[80vw] flex flex-col">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Categories */}
              <div className="flex-1 overflow-y-auto">
                {categoriesLoading ? (
                  <div className="px-4 py-8 text-center text-gray-500">Loading categories...</div>
                ) : !categories || categories.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500">No categories available</div>
                ) : (
                  categories.map((category) => (
                    <div key={category.id_c || category.Id} className="border-b border-gray-100 last:border-0">
                      <Link
                        to={`/?category=${category.name_c || category.Name}`}
                        className="flex items-center gap-3 px-4 py-4 hover:bg-secondary/10 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <ApperIcon name={category.icon_c || category.icon} size={24} className="text-primary" />
                        <span className="font-medium text-gray-700 text-lg">{category.name_c || category.Name}</span>
                      </Link>
                      {category.subcategories && (
                        <div className="bg-gray-50 pl-8">
                          {category.subcategories.map((sub) => (
                            <Link
                              key={sub.id_c || sub.Id}
                              to={`/?category=${category.name_c || category.Name}&subcategory=${sub.name_c || sub.name}`}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/10 transition-colors"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <ApperIcon name={sub.icon_c || sub.icon} size={20} className="text-secondary" />
                              <span className="text-gray-600">{sub.name_c || sub.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Search */}
        <div className="pb-4 md:hidden">
          <SearchBar onSearch={onSearch} placeholder="Search products..." />
        </div>
      </div>
    </header>
  );
};

export default Header;