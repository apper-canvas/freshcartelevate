import promoData from "@/services/mockData/promos.json";

let mockPromos = [...promoData];

const promoService = {
  getAll: () => {
    return Promise.resolve(mockPromos.map(promo => ({ ...promo })));
  },

  getActive: () => {
    const activePromos = mockPromos
      .filter(promo => promo.isActive)
      .sort((a, b) => a.priority - b.priority)
      .map(promo => ({ ...promo }));
    return Promise.resolve(activePromos);
  },

  getById: (id) => {
    if (typeof id !== 'number') {
      return Promise.reject(new Error('ID must be a number'));
    }
    const promo = mockPromos.find(p => p.Id === id);
    return promo ? Promise.resolve({ ...promo }) : Promise.reject(new Error('Promo not found'));
  },

  create: (promoData) => {
    const newId = Math.max(...mockPromos.map(p => p.Id), 0) + 1;
    const newPromo = {
      ...promoData,
      Id: newId,
      isActive: promoData.isActive ?? true,
      priority: promoData.priority ?? mockPromos.length + 1
    };
    mockPromos.push(newPromo);
    return Promise.resolve({ ...newPromo });
  },

  update: (id, updateData) => {
    if (typeof id !== 'number') {
      return Promise.reject(new Error('ID must be a number'));
    }
    const index = mockPromos.findIndex(p => p.Id === id);
    if (index === -1) {
      return Promise.reject(new Error('Promo not found'));
    }
    mockPromos[index] = { ...mockPromos[index], ...updateData, Id: id };
    return Promise.resolve({ ...mockPromos[index] });
  },

  delete: (id) => {
    if (typeof id !== 'number') {
      return Promise.reject(new Error('ID must be a number'));
    }
    const index = mockPromos.findIndex(p => p.Id === id);
    if (index === -1) {
      return Promise.reject(new Error('Promo not found'));
    }
    const deletedPromo = { ...mockPromos[index] };
    mockPromos.splice(index, 1);
    return Promise.resolve(deletedPromo);
  }
};

export default promoService;