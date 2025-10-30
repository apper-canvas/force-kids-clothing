import productService from "@/services/api/productService";

const STORAGE_KEY = "recentlyViewed";
const MAX_ITEMS = 8;

const recentlyViewedService = {
  getAll: async () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const productIds = JSON.parse(stored);
      const allProducts = await productService.getAll();
      
      return productIds
        .map(id => allProducts.find(p => p.Id === id))
        .filter(Boolean)
        .slice(0, MAX_ITEMS);
    } catch (error) {
      console.error("Error loading recently viewed:", error);
      return [];
    }
  },

  trackView: (productId) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let productIds = stored ? JSON.parse(stored) : [];
      
      productIds = productIds.filter(id => id !== productId);
      productIds.unshift(productId);
      productIds = productIds.slice(0, MAX_ITEMS);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(productIds));
    } catch (error) {
      console.error("Error tracking product view:", error);
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing recently viewed:", error);
    }
  }
};

export default recentlyViewedService;