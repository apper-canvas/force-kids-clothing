import ordersData from "@/services/mockData/orders.json";

let orders = [...ordersData];
let nextId = orders.length > 0 ? Math.max(...orders.map(o => o.Id)) + 1 : 1;

const orderService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return orders.map(order => ({ ...order }));
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid order ID");
    }

    const order = orders.find(o => o.Id === id);
    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }

    return { ...order };
  },

  create: async (orderData) => {
    await new Promise(resolve => setTimeout(resolve, 500));

const newOrder = {
      Id: nextId++,
      orderNumber: orderData.orderNumber || `ORD-${Date.now()}`,
      customerName: orderData.customerName,
      email: orderData.email,
      phone: orderData.phone,
      shippingAddress: orderData.shippingAddress,
      items: orderData.items,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      tax: orderData.tax,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod,
      status: orderData.status || "pending",
      createdAt: orderData.createdAt || new Date().toISOString()
    };

    orders.push(newOrder);
    return { ...newOrder };
  },

  update: async (id, orderData) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid order ID");
    }

    const index = orders.findIndex(o => o.Id === id);
    if (index === -1) {
      throw new Error(`Order with ID ${id} not found`);
    }

    orders[index] = {
      ...orders[index],
      ...orderData,
      Id: orders[index].Id,
      orderNumber: orders[index].orderNumber,
      createdAt: orders[index].createdAt
    };

    return { ...orders[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid order ID");
    }

    const index = orders.findIndex(o => o.Id === id);
    if (index === -1) {
      throw new Error(`Order with ID ${id} not found`);
    }

    const deletedOrder = orders[index];
    orders.splice(index, 1);
    return { ...deletedOrder };
  },

  getByEmail: async (email) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return orders.filter(o => o.email === email).map(order => ({ ...order }));
  },

  getByStatus: async (status) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return orders.filter(o => o.status === status).map(order => ({ ...order }));
  }
};

export default orderService;