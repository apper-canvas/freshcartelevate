import storesData from "@/services/mockData/stores.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get stored data from localStorage or use default
const getStoredStores = () => {
  const stored = localStorage.getItem('freshcart_stores');
  return stored ? JSON.parse(stored) : storesData;
};

const getStoredFavorites = () => {
  const stored = localStorage.getItem('freshcart_favorite_stores');
  return stored ? JSON.parse(stored) : [];
};

const saveFavorites = (favorites) => {
  localStorage.setItem('freshcart_favorite_stores', JSON.stringify(favorites));
};

// Generate real-time inventory for stores
const generateInventory = (storeId, productIds) => {
  const inventory = {};
  productIds.forEach(productId => {
    // Simulate varying stock levels
    const baseStock = Math.floor(Math.random() * 50) + 5;
    const variation = Math.floor(Math.random() * 10) - 5;
    inventory[productId] = Math.max(0, baseStock + variation);
  });
  return inventory;
};

const storeService = {
  async getAll() {
    await delay(250);
    return getStoredStores();
  },

  async getById(id) {
    await delay(200);
    const stores = getStoredStores();
    const store = stores.find(s => s.Id === parseInt(id));
    if (!store) throw new Error('Store not found');
    return store;
  },

  async getFavorites() {
    await delay(150);
    const favoriteIds = getStoredFavorites();
    const allStores = getStoredStores();
    return allStores.filter(store => favoriteIds.includes(store.Id));
  },

  async addFavorite(storeId) {
    await delay(300);
    const currentFavorites = getStoredFavorites();
    
    if (currentFavorites.length >= 3) {
      throw new Error('Maximum 3 favorite stores allowed');
    }
    
    if (!currentFavorites.includes(storeId)) {
      currentFavorites.push(storeId);
      saveFavorites(currentFavorites);
    }
    
    return this.getFavorites();
  },

  async removeFavorite(storeId) {
    await delay(200);
    const currentFavorites = getStoredFavorites();
    const updatedFavorites = currentFavorites.filter(id => id !== storeId);
    saveFavorites(updatedFavorites);
    return this.getFavorites();
  },

  async getInventory(storeId, productIds = []) {
    await delay(300);
    const store = await this.getById(storeId);
    
    // Generate or get cached inventory
    const cacheKey = `inventory_${storeId}`;
    let inventory = JSON.parse(localStorage.getItem(cacheKey) || '{}');
    
    // Check if we need to generate new inventory (cache for 5 minutes)
    const lastUpdate = localStorage.getItem(`${cacheKey}_timestamp`);
    const now = Date.now();
    
    if (!lastUpdate || (now - parseInt(lastUpdate)) > 5 * 60 * 1000) {
      inventory = generateInventory(storeId, productIds.length > 0 ? productIds : [1, 2, 3, 4, 5]);
      localStorage.setItem(cacheKey, JSON.stringify(inventory));
      localStorage.setItem(`${cacheKey}_timestamp`, now.toString());
    }
    
    return {
      storeId,
      storeName: store.name,
      inventory,
      lastUpdated: new Date(parseInt(localStorage.getItem(`${cacheKey}_timestamp`)))
    };
  },

  async getMultiStoreInventory(productIds = []) {
    await delay(400);
    const favorites = await this.getFavorites();
    
    const inventoryPromises = favorites.map(store => 
      this.getInventory(store.Id, productIds)
    );
    
    const inventories = await Promise.all(inventoryPromises);
    
    // Combine inventory data by product
    const combined = {};
    productIds.forEach(productId => {
      combined[productId] = inventories.map(inv => ({
        storeId: inv.storeId,
        storeName: inv.storeName,
        stock: inv.inventory[productId] || 0,
        available: (inv.inventory[productId] || 0) > 0
      }));
    });
    
    return combined;
  },

  async findBestStore(productId) {
    await delay(200);
    const favorites = await this.getFavorites();
    
    if (favorites.length === 0) {
      throw new Error('No favorite stores selected');
    }
    
    const inventories = await Promise.all(
      favorites.map(store => this.getInventory(store.Id, [productId]))
    );
    
    // Find store with highest stock
    let bestStore = null;
    let maxStock = 0;
    
    inventories.forEach((inv, index) => {
      const stock = inv.inventory[productId] || 0;
      if (stock > maxStock) {
        maxStock = stock;
        bestStore = favorites[index];
      }
    });
    
    return bestStore ? { store: bestStore, stock: maxStock } : null;
  }
};

export default storeService;