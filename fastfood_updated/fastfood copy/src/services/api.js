const API_BASE = '/api';

function getAuthHeaders() {
  const token = sessionStorage.getItem('flamebites_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const apiService = {
  async getProducts(category = 'Barchasi') {
    const query = category && category !== 'Barchasi' ? `?category=${encodeURIComponent(category)}` : '';
    const res = await fetch(`${API_BASE}/products${query}`);
    if (!res.ok) throw new Error('Mahsulotlarni yuklashda xatolik');
    return res.json();
  },

  async createProduct(formData) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Mahsulot qo'shishda xatolik");
    return data;
  },

  async updateProduct(id, formData) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Mahsulotni yangilashda xatolik');
    return data;
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Mahsulotni o'chirishda xatolik");
    return data;
  },

  async registerVisitor(payload) {
    const res = await fetch(`${API_BASE}/visitors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Ma'lumotni yuborishda xatolik");
    return data.visitor;
  },

  async getVisitors() {
    const res = await fetch(`${API_BASE}/visitors`, { headers: getAuthHeaders() });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Mijozlarni yuklashda xatolik');
    return data;
  },

  async deleteVisitor(id) {
    const res = await fetch(`${API_BASE}/visitors/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Mijozni o'chirishda xatolik");
    return data;
  },

  async login(credentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login yoki parol noto'g'ri");
    return data;
  },

  async checkSession() {
    const token = sessionStorage.getItem('flamebites_admin_token');
    if (!token) return null;
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      sessionStorage.removeItem('flamebites_admin_token');
      return null;
    }
    return res.json();
  },

  async updateCredentials(payload) {
    const res = await fetch(`${API_BASE}/auth/credentials`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Ma'lumotlarni yangilashda xatolik");
    return data;
  },
};