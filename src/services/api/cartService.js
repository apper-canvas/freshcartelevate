const STORAGE_KEY = "freshcart_cart";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getStoredCart = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCart = (cart) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.warn("Failed to save cart to localStorage:", error);
  }
};

const cartService = {
  async getCartItems() {
    await delay(200);
    return getStoredCart();
  },

async addItem(item) {
    await delay(300);
    const cart = getStoredCart();
    const existingIndex = cart.findIndex(cartItem => cartItem.productId === item.productId);
    
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += item.quantity || 1;
    } else {
      cart.push({
        productId: item.productId,
        name: item.name,
        price: item.price,
        unit: item.unit,
        image: item.image,
        quantity: item.quantity || 1
      });
    }
    
    saveCart(cart);
    return cart;
  },

  async updateQuantity(productId, quantity) {
    await delay(250);
    const cart = getStoredCart();
    const index = cart.findIndex(item => item.productId === productId);
    
    if (index === -1) {
      throw new Error(`Item with productId ${productId} not found in cart`);
    }

    if (quantity <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = quantity;
    }
    
    saveCart(cart);
    return cart;
  },

  async removeItem(productId) {
    await delay(200);
    const cart = getStoredCart();
    const index = cart.findIndex(item => item.productId === productId);
    
    if (index === -1) {
      throw new Error(`Item with productId ${productId} not found in cart`);
    }
    
    const removedItem = cart[index];
    cart.splice(index, 1);
    saveCart(cart);
    return removedItem;
  },

  async clearCart() {
    await delay(200);
    saveCart([]);
    return [];
  },

  async getCartCount() {
    await delay(100);
    const cart = getStoredCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },

  async getCartTotal() {
    await delay(100);
    const cart = getStoredCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
};

export default cartService;