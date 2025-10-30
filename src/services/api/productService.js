import { toast } from "react-toastify";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const enhanceProductData = (product) => {
  const baseImage = product.image_c;
  const categoryName = product.category_c?.Name || "Kids Clothing";
  
  // Calculate stock status
  const stockLevel = product.stock_level_c || 0;
  let stockStatus = 'out-of-stock';
  if (stockLevel > 5) {
    stockStatus = 'in-stock';
  } else if (stockLevel > 0) {
    stockStatus = 'low-stock';
  }

  // Parse size stock if it's a string
  let sizeStock = {};
  if (product.size_stock_c && typeof product.size_stock_c === 'string') {
    try {
      sizeStock = JSON.parse(product.size_stock_c);
    } catch (e) {
      sizeStock = {};
    }
  } else if (product.size_stock_c && typeof product.size_stock_c === 'object') {
    sizeStock = product.size_stock_c;
  }
  
  const enhancedProduct = {
    ...product,
    // Legacy field mapping for compatibility
    title: product.title_c,
    price: product.price_c,
    salePrice: product.sale_price_c,
    image: product.image_c,
    category: categoryName,
    subcategory: product.subcategory_c,
    description: product.description_c,
    sizeRecommendation: product.size_recommendation_c,
    inStock: product.in_stock_c,
    stockLevel: stockLevel,
    sizeStock: sizeStock,
    
    // Enhanced fields
    images: [
      baseImage,
      baseImage?.replace('.jpg', '-2.jpg') || baseImage,
      baseImage?.replace('.jpg', '-3.jpg') || baseImage,
      baseImage?.replace('.jpg', '-lifestyle.jpg') || baseImage,
      baseImage?.replace('.jpg', '-detail.jpg') || baseImage
    ].filter(Boolean),
    fullDescription: `${product.description_c} This high-quality ${categoryName.toLowerCase()} item is perfect for kids and families. Made with care and attention to detail, it offers great value and lasting durability. Ideal for everyday use or special occasions, this product combines style, comfort, and functionality in one package.`,
    sizes: categoryName === "Kids Clothing" ? ["XS", "S", "M", "L", "XL"] : undefined,
    ageRange: product.subcategory_c 
      ? product.subcategory_c 
      : categoryName === "Toys" 
        ? "3-8 years" 
        : categoryName === "Kids Clothing" 
          ? "2-12 years" 
          : "All ages",
    stockStatus: stockStatus
  };
  
  return enhancedProduct;
};

// Complementary product relationships
const complementaryMap = {
  1: [2, 3, 4],
  2: [1, 3, 5],
  3: [1, 2, 6],
  4: [2, 5, 7],
  5: [3, 6, 8],
  6: [4, 7, 9],
  7: [5, 8, 10],
  8: [6, 9, 11],
  9: [7, 10, 12],
  10: [8, 11, 13]
};

const productService = {
  getAll: async () => {
    try {
      await delay(300);
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sale_price_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "size_recommendation_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "stock_level_c"}},
          {"field": {"Name": "size_stock_c"}},
          {"field": {"Name": "category_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "ASC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      if (!response.data?.length) {
        return [];
      }
      
      return response.data.map(enhanceProductData);
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      await delay(200);
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sale_price_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "size_recommendation_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "stock_level_c"}},
          {"field": {"Name": "size_stock_c"}},
          {"field": {"Name": "category_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      };
      
      const response = await apperClient.getRecordById('product_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data ? enhanceProductData(response.data) : null;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  },

  getByCategory: async (category) => {
    try {
      await delay(250);
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sale_price_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "size_recommendation_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "stock_level_c"}},
          {"field": {"Name": "size_stock_c"}},
          {"field": {"Name": "category_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "ASC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };

      if (category && category !== "All Products") {
        params.where = [{"FieldName": "category_c", "Operator": "EqualTo", "Values": [category]}];
      }
      
      const response = await apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      if (!response.data?.length) {
        return [];
      }
      
      return response.data.map(enhanceProductData);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      return [];
    }
  },

  searchProducts: async (query) => {
    try {
      await delay(200);
      if (!query) return [];
      
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sale_price_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "size_recommendation_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "stock_level_c"}},
          {"field": {"Name": "size_stock_c"}},
          {"field": {"Name": "category_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "title_c", "operator": "Contains", "values": [query]},
                {"fieldName": "description_c", "operator": "Contains", "values": [query]}
              ],
              "operator": "OR"
            }
          ]
        }],
        orderBy: [{"fieldName": "Id", "sorttype": "ASC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      if (!response.data?.length) {
        return [];
      }
      
      return response.data.map(enhanceProductData);
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  },

  getRelatedProducts: async (productId, limit = 6) => {
    try {
      await delay(200);
      const currentProduct = await productService.getById(productId);
      if (!currentProduct) return [];

      const apperClient = getApperClient();
      const priceMin = currentProduct.price_c * 0.5;
      const priceMax = currentProduct.price_c * 1.5;
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sale_price_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "size_recommendation_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "stock_level_c"}},
          {"field": {"Name": "size_stock_c"}},
          {"field": {"Name": "category_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        where: [
          {"FieldName": "category_c", "Operator": "EqualTo", "Values": [currentProduct.category_c?.Id || currentProduct.category_c]},
          {"FieldName": "price_c", "Operator": "GreaterThanOrEqualTo", "Values": [priceMin]},
          {"FieldName": "price_c", "Operator": "LessThanOrEqualTo", "Values": [priceMax]},
          {"FieldName": "Id", "Operator": "NotEqualTo", "Values": [parseInt(productId)]}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "ASC"}],
        pagingInfo: {"limit": limit, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      if (!response.data?.length) {
        return [];
      }
      
      return response.data.map(enhanceProductData).slice(0, limit);
    } catch (error) {
      console.error("Error fetching related products:", error);
      return [];
    }
  },

  getComplementaryProducts: async (productId, limit = 4) => {
    try {
      await delay(200);
      const currentProduct = await productService.getById(productId);
      if (!currentProduct) return [];

      // Get predefined complementary products
      const complementaryIds = complementaryMap[parseInt(productId)] || [];
      
      if (complementaryIds.length > 0) {
        const apperClient = getApperClient();
        
        const params = {
          fields: [
            {"field": {"Name": "Name"}},
            {"field": {"Name": "title_c"}},
            {"field": {"Name": "price_c"}},
            {"field": {"Name": "sale_price_c"}},
            {"field": {"Name": "image_c"}},
            {"field": {"Name": "subcategory_c"}},
            {"field": {"Name": "description_c"}},
            {"field": {"Name": "size_recommendation_c"}},
            {"field": {"Name": "in_stock_c"}},
            {"field": {"Name": "stock_level_c"}},
            {"field": {"Name": "size_stock_c"}},
            {"field": {"Name": "category_c"}, "referenceField": {"field": {"Name": "Name"}}}
          ],
          where: [{"FieldName": "Id", "Operator": "ExactMatch", "Values": complementaryIds}],
          orderBy: [{"fieldName": "Id", "sorttype": "ASC"}],
          pagingInfo: {"limit": limit, "offset": 0}
        };
        
        const response = await apperClient.fetchRecords('product_c', params);
        
        if (response.success && response.data?.length) {
          return response.data.map(enhanceProductData).slice(0, limit);
        }
      }

      // Fallback to random products from different category
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "sale_price_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "size_recommendation_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "stock_level_c"}},
          {"field": {"Name": "size_stock_c"}},
          {"field": {"Name": "category_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        where: [
          {"FieldName": "category_c", "Operator": "NotEqualTo", "Values": [currentProduct.category_c?.Id || currentProduct.category_c]},
          {"FieldName": "Id", "Operator": "NotEqualTo", "Values": [parseInt(productId)]}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "ASC"}],
        pagingInfo: {"limit": limit, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        return [];
      }
      
      return response.data?.length ? response.data.map(enhanceProductData).slice(0, limit) : [];
    } catch (error) {
      console.error("Error fetching complementary products:", error);
      return [];
    }
  }
};
export default productService;