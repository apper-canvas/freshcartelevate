import productsData from "@/services/mockData/products.json";

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
  }
};

export default productService;