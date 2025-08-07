const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const productService = {
  async getAll() {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "product_name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "is_featured_c" } },
          { field: { Name: "unit_c" } },
          { field: { Name: "discount_c" } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "category_id_c" } }
        ],
        orderBy: [{ fieldName: "Id", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords("product_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI expected format
      return response.data.map(product => ({
        Id: product.Id,
        name: product.product_name_c || product.Name,
        category: product.category_id_c?.Name || "General",
        price: product.price_c || 0,
        unit: product.unit_c || "each",
        image: product.image_url_c || "https://images.unsplash.com/photo-1546583087-d8f2000a5d92?w=400&h=300&fit=crop",
        inStock: (product.quantity_c || 0) > 0,
        onSale: (product.discount_c || 0) > 0,
        originalPrice: product.discount_c > 0 ? product.price_c + product.discount_c : undefined
      }));
    } catch (error) {
      console.error("Error fetching products from productService:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getById(id) {
    try {
      await delay(200);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "product_name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "is_featured_c" } },
          { field: { Name: "unit_c" } },
          { field: { Name: "discount_c" } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "category_id_c" } }
        ]
      };

      const response = await apperClient.getRecordById("product_c", id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error(`Product with Id ${id} not found`);
      }

      // Map database fields to UI expected format
      const product = response.data;
      return {
        Id: product.Id,
        name: product.product_name_c || product.Name,
        category: product.category_id_c?.Name || "General",
        price: product.price_c || 0,
        unit: product.unit_c || "each",
        image: product.image_url_c || "https://images.unsplash.com/photo-1546583087-d8f2000a5d92?w=400&h=300&fit=crop",
        inStock: (product.quantity_c || 0) > 0,
        onSale: (product.discount_c || 0) > 0,
        originalPrice: product.discount_c > 0 ? product.price_c + product.discount_c : undefined
      };
    } catch (error) {
      console.error("Error fetching product by ID from productService:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getByCategory(category) {
    try {
      await delay(250);
      
      const products = await this.getAll();
      
      if (category === "All") {
        return products;
      }
      
      return products.filter(p => p.category === category);
    } catch (error) {
      console.error("Error fetching products by category from productService:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async search(query) {
    try {
      await delay(200);
      
      const products = await this.getAll();
      const searchTerm = query.toLowerCase();
      
      return products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error("Error searching products from productService:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async create(productData) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: productData.name,
          product_name_c: productData.name,
          description_c: productData.description || "",
          price_c: productData.price || 0,
          image_url_c: productData.image || "",
          is_featured_c: productData.featured || false,
          unit_c: productData.unit || "each",
          discount_c: productData.discount || 0,
          quantity_c: productData.quantity || 0,
          category_id_c: productData.categoryId || null
        }]
      };

      const response = await apperClient.createRecord("product_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create products ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      console.error("Error creating product from productService:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, productData) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: productData.name,
          product_name_c: productData.name,
          description_c: productData.description,
          price_c: productData.price,
          image_url_c: productData.image,
          is_featured_c: productData.featured,
          unit_c: productData.unit,
          discount_c: productData.discount,
          quantity_c: productData.quantity,
          category_id_c: productData.categoryId
        }]
      };

      const response = await apperClient.updateRecord("product_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update products ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      console.error("Error updating product from productService:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("product_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete products ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error("Error deleting product from productService:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getRecommendations(cartItems) {
    try {
      await delay(500);
      
      if (!cartItems || cartItems.length === 0) {
        return [];
      }
      
      const products = await this.getAll();
      const cartProductIds = cartItems.map(item => item.productId);
      const cartProducts = products.filter(p => cartProductIds.includes(p.Id));
      
      // Get categories from cart items
      const cartCategories = [...new Set(cartProducts.map(p => p.category))];
      
      // Complementary product mappings
      const complementaryMap = {
        'Produce': ['Dairy', 'Pantry'],
        'Dairy': ['Produce', 'Bakery', 'Pantry'],
        'Meat': ['Produce', 'Pantry', 'Bakery'],
        'Bakery': ['Dairy', 'Pantry'],
        'Pantry': ['Produce', 'Dairy', 'Meat'],
        'Frozen': ['Dairy', 'Produce'],
        'Beverages': ['Snacks', 'Bakery'],
        'Snacks': ['Beverages', 'Dairy']
      };
      
      // Get complementary categories
      const complementaryCategories = [];
      cartCategories.forEach(category => {
        if (complementaryMap[category]) {
          complementaryCategories.push(...complementaryMap[category]);
        }
      });
      
      // Filter out products already in cart and get recommendations
      const availableProducts = products.filter(p => 
        !cartProductIds.includes(p.Id) && 
        p.inStock &&
        (cartCategories.includes(p.category) || complementaryCategories.includes(p.category))
      );
      
      // Prioritize complementary products, then same category
      const complementaryProducts = availableProducts.filter(p => 
        complementaryCategories.includes(p.category)
      );
      const sameCategoryProducts = availableProducts.filter(p => 
        cartCategories.includes(p.category)
      );
      
      // Combine and shuffle, prioritizing complementary
      const recommendations = [
        ...complementaryProducts.slice(0, 3),
        ...sameCategoryProducts.slice(0, 2)
      ].slice(0, 4);
      
      // If not enough recommendations, add popular products
      if (recommendations.length < 4) {
        const popularProducts = products
          .filter(p => !cartProductIds.includes(p.Id) && p.inStock && p.onSale)
          .slice(0, 4 - recommendations.length);
        recommendations.push(...popularProducts);
      }
      
      return recommendations;
    } catch (error) {
      console.error("Error getting product recommendations from productService:", error?.response?.data?.message || error.message);
      return [];
    }
  }
};

export default productService;