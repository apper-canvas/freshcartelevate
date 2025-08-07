import productsData from "@/services/mockData/products.json";
import React from "react";
import Error from "@/components/ui/Error";

const STORAGE_KEY = "freshcart_products";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getStoredProducts = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [...productsData];
  } catch {
    return [...productsData];
  }
};

const saveProducts = (products) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.warn("Failed to save products to localStorage:", error);
  }
};

const productService = {
  async getAll() {
    await delay(300);
    return getStoredProducts();
  },

  async getById(id) {
    await delay(200);
    const products = getStoredProducts();
    const product = products.find(p => p.Id === parseInt(id));
    if (!product) {
      throw new Error(`Product with Id ${id} not found`);
    }
    return { ...product };
  },

  async getByCategory(category) {
    await delay(250);
    const products = getStoredProducts();
    if (category === "All") {
      return products;
    }
    return products.filter(p => p.category === category);
  },

  async search(query) {
    await delay(200);
    const products = getStoredProducts();
    const searchTerm = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    );
  },

  async create(productData) {
    await delay(400);
    const products = getStoredProducts();
    const maxId = Math.max(...products.map(p => p.Id), 0);
    const newProduct = {
      ...productData,
      Id: maxId + 1
    };
    const updatedProducts = [...products, newProduct];
    saveProducts(updatedProducts);
    return { ...newProduct };
  },

  async update(id, productData) {
    await delay(400);
    const products = getStoredProducts();
    const index = products.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Product with Id ${id} not found`);
    }
    const updatedProduct = { ...products[index], ...productData, Id: parseInt(id) };
    products[index] = updatedProduct;
    saveProducts(products);
    return { ...updatedProduct };
  },

async delete(id) {
    await delay(300);
    const products = getStoredProducts();
    const index = products.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Product with Id ${id} not found`);
    }
    const deletedProduct = products[index];
    products.splice(index, 1);
    saveProducts(products);
    return { ...deletedProduct };
  },

  // Get product recommendations based on cart items
  async getRecommendations(cartItems) {
    await delay(500); // Simulate API call
    
    if (!cartItems || cartItems.length === 0) {
      return [];
    }
    
    const products = getStoredProducts();
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
  }
};

export default productService;