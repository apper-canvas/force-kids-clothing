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

// Hardcoded subcategories for Kids Clothing category
const kidsClothingSubcategories = [
  { Id: 31, id_c: "baby", name_c: "Baby (0-2)", icon_c: "Baby" },
  { Id: 32, id_c: "toddler", name_c: "Toddler (2-4)", icon_c: "Smile" },
  { Id: 33, id_c: "kids", name_c: "Kids (4-8)", icon_c: "User" },
  { Id: 34, id_c: "teen", name_c: "Teen (8+)", icon_c: "UserCircle" }
];

const categoryService = {
  getAll: async () => {
    try {
      await delay(250);
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "icon_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "ASC"}],
        pagingInfo: {"limit": 20, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('category_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      if (!response.data?.length) {
        return [];
      }
      
      return response.data.map(category => ({
        ...category,
        // Legacy field mapping for compatibility
        id: category.id_c,
        name: category.name_c || category.Name,
        icon: category.icon_c,
        subcategories: (category.name_c === "Kids Clothing" || category.Name === "Kids Clothing") 
          ? [...kidsClothingSubcategories] 
          : []
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      await delay(250);
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "icon_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById('category_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(`Category with id ${id} not found`);
      }
      
      if (!response.data) {
        throw new Error(`Category with id ${id} not found`);
      }
      
      const category = response.data;
      return {
        ...category,
        // Legacy field mapping
        id: category.id_c,
        name: category.name_c || category.Name,
        icon: category.icon_c,
        subcategories: (category.name_c === "Kids Clothing" || category.Name === "Kids Clothing") 
          ? [...kidsClothingSubcategories] 
          : []
      };
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  getByName: async (name) => {
    try {
      await delay(250);
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "icon_c"}}
        ],
        where: [{"FieldName": "name_c", "Operator": "EqualTo", "Values": [name]}],
        pagingInfo: {"limit": 1, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('category_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(`Category with name ${name} not found`);
      }
      
      if (!response.data?.length) {
        throw new Error(`Category with name ${name} not found`);
      }
      
      const category = response.data[0];
      return {
        ...category,
        // Legacy field mapping
        id: category.id_c,
        name: category.name_c || category.Name,
        icon: category.icon_c,
        subcategories: (category.name_c === "Kids Clothing" || category.Name === "Kids Clothing") 
          ? [...kidsClothingSubcategories] 
          : []
      };
    } catch (error) {
      console.error(`Error fetching category by name ${name}:`, error);
      throw error;
    }
  },

  getSubcategories: async (categoryName) => {
    try {
      await delay(250);
      
      if (categoryName === "Kids Clothing") {
        return [...kidsClothingSubcategories];
      }
      
      return [];
    } catch (error) {
      console.error(`Error fetching subcategories for ${categoryName}:`, error);
      throw new Error(`Category with name ${categoryName} not found`);
    }
  },

  getCategoryBySubcategory: async (subcategoryName) => {
    try {
      await delay(250);
      
      // Check if subcategory exists in Kids Clothing
      const subcategory = kidsClothingSubcategories.find(
        (sub) => sub.name_c === subcategoryName || sub.name === subcategoryName
      );
      
      if (subcategory) {
        // Return Kids Clothing category
        const kidsCategory = await categoryService.getByName("Kids Clothing");
        return kidsCategory;
      }
      
      throw new Error(`Subcategory with name ${subcategoryName} not found`);
    } catch (error) {
      console.error(`Error fetching category by subcategory ${subcategoryName}:`, error);
      throw error;
    }
  },

  hasSubcategories: (categoryName) => {
    return categoryName === "Kids Clothing";
  }
};
export default categoryService;