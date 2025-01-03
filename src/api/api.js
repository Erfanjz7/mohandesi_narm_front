const API_URL = 'http://localhost:8000/api';

const api = {
  login: async (username, password) => {
    const response = await fetch(`${API_URL}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_URL}/logout/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  },

  getFoodList: async (category = '') => {
    const url = category ? `${API_URL}/foods/list/?category=${category}` : `${API_URL}/foods/list/`;
    const response = await fetch(url);
    return response.json();
  },

  getFoodDetail: async (id) => {
    const response = await fetch(`${API_URL}/food/detail/${id}/`);
    return response.json();
  },

  addToCart: async (foodId, quantity) => {
    const response = await fetch(`${API_URL}/cart/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Food: foodId, quantity }),
    });
    return response.json();
  },

  getCart: async () => {
    const response = await fetch(`${API_URL}/cart/`);
    return response.json();
  },

  getOrders: async () => {
    const response = await fetch(`${API_URL}/order/`);
    return response.json();
  },

  createOrder: async (address) => {
    const response = await fetch(`${API_URL}/order/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    });
    return response.json();
  },

  getPendingOrders: async () => {
    const response = await fetch(`${API_URL}/employee/dashboard/`);
    return response.json();
  },

  completeOrder: async (orderId) => {
    const response = await fetch(`${API_URL}/employee/dashboard/${orderId}/complete/`, {
      method: 'POST',
    });
    return response.json();
  },

  getCompletedOrders: async () => {
    const response = await fetch(`${API_URL}/employee/dashboard/completed/`);
    return response.json();
  },

  adminAddFood: async (foodData) => {
    const response = await fetch(`${API_URL}/admin/food/add/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(foodData),
    });
    return response.json();
  },

  adminUpdateFood: async (id, foodData) => {
    const response = await fetch(`${API_URL}/admin/food/${id}/edit/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(foodData),
    });
    return response.json();
  },

  adminDeleteFood: async (id) => {
    const response = await fetch(`${API_URL}/admin/food/${id}/delete/`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

export default api;
