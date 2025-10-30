import { useState, useEffect, createContext, useContext } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import CartPanel from "@/components/organisms/CartPanel";
import recentlyViewedService from "@/services/api/recentlyViewedService";

// Cart context for backward compatibility
export const CartContext = createContext({});

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartContext.Provider');
  }
  return context;
};

export default function MainLayout() {
  // Cart state
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    loadRecentlyViewed();
  }, []);

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

  return (
    <CartContext.Provider value={cartValue}>
      <div className="min-h-screen bg-background">
        <Header 
          cartItemCount={totalItems}
          onCartClick={() => setIsCartOpen(true)}
        />
        <CartPanel 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
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
        <Outlet context={cartValue} />
      </div>
    </CartContext.Provider>
  );
}