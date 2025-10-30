import React, { createContext, useContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import recentlyViewedService from "@/services/api/recentlyViewedService";
import PromptPassword from "@/components/pages/PromptPassword";
import Callback from "@/components/pages/Callback";
import ShopPage from "@/components/pages/ShopPage";
import ErrorPage from "@/components/pages/ErrorPage";
import CheckoutPage from "@/components/pages/CheckoutPage";
import Signup from "@/components/pages/Signup";
import Login from "@/components/pages/Login";
import ProductDetailPage from "@/components/pages/ProductDetailPage";
import ResetPassword from "@/components/pages/ResetPassword";
import Error from "@/components/ui/Error";
// Create contexts
export const CartContext = createContext({});
// AuthContext now defined in src/layouts/Root.jsx

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartContext.Provider');
  }
  return context;
};
function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
// isInitialized now managed in Redux via src/store/userSlice.js
  
  // Cart state
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Get authentication status with proper error handling
// Authentication state now managed in src/layouts/Root.jsx

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    loadRecentlyViewed();
  }, []);

  // Initialize ApperUI once when the app loads
// Authentication initialization moved to src/layouts/Root.jsx
  // ApperUI setup, navigation logic, and route guards now handled by Root component

  const loadRecentlyViewed = async () => {
    const products = await recentlyViewedService.getAll();
    setRecentlyViewed(products);
  };

  const trackProductView = (productId) => {
    recentlyViewedService.trackView(productId);
    loadRecentlyViewed();
  };

  const clearRecentlyViewed = () => {
    recentlyViewedService.clear();
    setRecentlyViewed([]);
  };

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Authentication methods to share via context
// Auth methods now provided by useAuth() hook from Root.jsx

  const cartValue = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    recentlyViewed,
    trackProductView,
    clearRecentlyViewed
  };

// Loading state now handled in Root.jsx

return (
    <CartContext.Provider value={cartValue}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
        <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
        <Route path="/" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </CartContext.Provider>
  );
}

export default App;