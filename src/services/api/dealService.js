import dealsData from '../mockData/deals.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DealService {
  constructor() {
    this.deals = [...dealsData];
  }

  async getAll() {
    await delay(350);
    return [...this.deals];
  }

  async getById(id) {
    await delay(200);
    const deal = this.deals.find(d => d.id === id);
    return deal ? { ...deal } : null;
  }

  async create(dealData) {
    await delay(400);
    const newDeal = {
      ...dealData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.deals.unshift(newDeal);
    return { ...newDeal };
  }

  async update(id, dealData) {
    await delay(300);
    const index = this.deals.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Deal not found');
    
    this.deals[index] = { ...this.deals[index], ...dealData };
    return { ...this.deals[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.deals.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Deal not found');
    
    this.deals.splice(index, 1);
    return true;
  }
}

export default new DealService();