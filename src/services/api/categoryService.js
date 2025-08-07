const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const categoryService = {
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
          { field: { Name: "category_name_c" } },
          { field: { Name: "image_url_c" } }
        ],
        orderBy: [{ fieldName: "Id", sorttype: "ASC" }],
        pagingInfo: { limit: 50, offset: 0 }
      };

      const response = await apperClient.fetchRecords("category_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI expected format
      return response.data.map(category => ({
        Id: category.Id,
        name: category.category_name_c || category.Name,
        imageUrl: category.image_url_c || ""
      }));
    } catch (error) {
      console.error("Error fetching categories from categoryService:", error?.response?.data?.message || error.message);
      return [];
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
          { field: { Name: "category_name_c" } },
          { field: { Name: "image_url_c" } }
        ]
      };

      const response = await apperClient.getRecordById("category_c", id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error(`Category with Id ${id} not found`);
      }

      // Map database fields to UI expected format
      const category = response.data;
      return {
        Id: category.Id,
        name: category.category_name_c || category.Name,
        imageUrl: category.image_url_c || ""
      };
    } catch (error) {
      console.error("Error fetching category by ID from categoryService:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async create(categoryData) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: categoryData.name,
          category_name_c: categoryData.name,
          image_url_c: categoryData.imageUrl || ""
        }]
      };

      const response = await apperClient.createRecord("category_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create categories ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      console.error("Error creating category from categoryService:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, categoryData) {
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
          Name: categoryData.name,
          category_name_c: categoryData.name,
          image_url_c: categoryData.imageUrl
        }]
      };

      const response = await apperClient.updateRecord("category_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update categories ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      console.error("Error updating category from categoryService:", error?.response?.data?.message || error.message);
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

      const response = await apperClient.deleteRecord("category_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete categories ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error("Error deleting category from categoryService:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};

export default categoryService;