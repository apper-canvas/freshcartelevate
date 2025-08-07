import ordersData from "@/services/mockData/orders.json";

const STORAGE_KEY = "freshcart_orders";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getStoredOrders = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [...ordersData];
  } catch {
    return [...ordersData];
  }
};

const saveOrders = (orders) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.warn("Failed to save orders to localStorage:", error);
  }
};

const orderService = {
  async getAll() {
    await delay(350);
    return getStoredOrders();
  },

  async getById(id) {
    await delay(250);
    const orders = getStoredOrders();
    const order = orders.find(o => o.Id === parseInt(id));
    if (!order) {
      throw new Error(`Order with Id ${id} not found`);
    }
    return { ...order };
  },

  async create(orderData) {
    await delay(500);
    const orders = getStoredOrders();
    const maxId = Math.max(...orders.map(o => o.Id), 0);
    const newOrder = {
      ...orderData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      status: orderData.status || "confirmed"
    };
    const updatedOrders = [newOrder, ...orders];
    saveOrders(updatedOrders);
    return { ...newOrder };
  },

  async update(id, orderData) {
    await delay(400);
    const orders = getStoredOrders();
    const index = orders.findIndex(o => o.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Order with Id ${id} not found`);
    }
    const updatedOrder = { ...orders[index], ...orderData, Id: parseInt(id) };
    orders[index] = updatedOrder;
    saveOrders(orders);
    return { ...updatedOrder };
  },

  async updateStatus(id, status) {
    await delay(300);
    const orders = getStoredOrders();
    const index = orders.findIndex(o => o.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Order with Id ${id} not found`);
    }
    orders[index].status = status;
    saveOrders(orders);
    return { ...orders[index] };
  },

  async delete(id) {
    await delay(300);
    const orders = getStoredOrders();
    const index = orders.findIndex(o => o.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Order with Id ${id} not found`);
    }
    const deletedOrder = orders[index];
    orders.splice(index, 1);
    saveOrders(orders);
    return { ...deletedOrder };
  },

  async getRecentOrders(limit = 5) {
    await delay(250);
    const orders = getStoredOrders();
    return orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }
};

export default orderService;