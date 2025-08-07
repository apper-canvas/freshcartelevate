const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const promoService = {
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
          { field: { Name: "title_c" } },
          { field: { Name: "subtitle_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "redirect_url_c" } },
          { field: { Name: "is_active_c" } }
        ],
        orderBy: [{ fieldName: "Id", sorttype: "ASC" }],
        pagingInfo: { limit: 50, offset: 0 }
      };

      const response = await apperClient.fetchRecords("promo_banner_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI expected format
      return response.data.map((promo, index) => ({
        Id: promo.Id,
        title: promo.title_c || promo.Name,
        subtitle: promo.subtitle_c || "",
        description: `${promo.title_c} - ${promo.subtitle_c}`,
        imageUrl: promo.image_url_c || "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&h=400&fit=crop",
        ctaText: "Shop Now",
        ctaLink: promo.redirect_url_c || "/search",
        backgroundColor: this.getBackgroundColor(index),
        textColor: "text-white",
        isActive: promo.is_active_c || false,
        priority: index + 1,
        startDate: "2024-01-01",
        endDate: "2024-12-31"
      }));
    } catch (error) {
      console.error("Error fetching promos from promoService:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getActive() {
    try {
      const allPromos = await this.getAll();
      return allPromos
        .filter(promo => promo.isActive)
        .sort((a, b) => a.priority - b.priority);
    } catch (error) {
      console.error("Error fetching active promos from promoService:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getById(id) {
    try {
      await delay(200);
      
      if (typeof id !== 'number') {
        throw new Error('ID must be a number');
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "subtitle_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "redirect_url_c" } },
          { field: { Name: "is_active_c" } }
        ]
      };

      const response = await apperClient.getRecordById("promo_banner_c", id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error('Promo not found');
      }

      // Map database fields to UI expected format
      const promo = response.data;
      return {
        Id: promo.Id,
        title: promo.title_c || promo.Name,
        subtitle: promo.subtitle_c || "",
        description: `${promo.title_c} - ${promo.subtitle_c}`,
        imageUrl: promo.image_url_c || "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&h=400&fit=crop",
        ctaText: "Shop Now",
        ctaLink: promo.redirect_url_c || "/search",
        backgroundColor: "from-orange-400 to-red-500",
        textColor: "text-white",
        isActive: promo.is_active_c || false,
        priority: 1,
        startDate: "2024-01-01",
        endDate: "2024-12-31"
      };
    } catch (error) {
      console.error("Error fetching promo by ID from promoService:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async create(promoData) {
    try {
      await delay(400);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: promoData.title,
          title_c: promoData.title,
          subtitle_c: promoData.subtitle || "",
          image_url_c: promoData.imageUrl || "",
          redirect_url_c: promoData.ctaLink || "/search",
          is_active_c: promoData.isActive ?? true
        }]
      };

      const response = await apperClient.createRecord("promo_banner_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create promo banners ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      console.error("Error creating promo from promoService:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      await delay(400);
      
      if (typeof id !== 'number') {
        throw new Error('ID must be a number');
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: updateData.title,
          title_c: updateData.title,
          subtitle_c: updateData.subtitle,
          image_url_c: updateData.imageUrl,
          redirect_url_c: updateData.ctaLink,
          is_active_c: updateData.isActive
        }]
      };

      const response = await apperClient.updateRecord("promo_banner_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update promo banners ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      console.error("Error updating promo from promoService:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      await delay(300);
      
      if (typeof id !== 'number') {
        throw new Error('ID must be a number');
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("promo_banner_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete promo banners ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error("Error deleting promo from promoService:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  // Helper method to get background colors for different promos
  getBackgroundColor(index) {
    const colors = [
      "from-orange-400 to-red-500",
      "from-green-400 to-emerald-600", 
      "from-blue-400 to-indigo-600",
      "from-purple-400 to-pink-500",
      "from-yellow-400 to-orange-500"
    ];
    return colors[index % colors.length];
  }
};

export default promoService;