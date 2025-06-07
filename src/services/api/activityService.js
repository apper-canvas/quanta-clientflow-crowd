import activitiesData from '../mockData/activities.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ActivityService {
  constructor() {
    this.activities = [...activitiesData];
  }

  async getAll() {
    await delay(250);
    return [...this.activities];
  }

  async getById(id) {
    await delay(200);
    const activity = this.activities.find(a => a.id === id);
    return activity ? { ...activity } : null;
  }

  async create(activityData) {
    await delay(300);
    const newActivity = {
      ...activityData,
      id: Date.now().toString(),
      date: activityData.date || new Date().toISOString()
    };
    this.activities.unshift(newActivity);
    return { ...newActivity };
  }

  async update(id, activityData) {
    await delay(250);
    const index = this.activities.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Activity not found');
    
    this.activities[index] = { ...this.activities[index], ...activityData };
    return { ...this.activities[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.activities.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Activity not found');
    
    this.activities.splice(index, 1);
    return true;
  }
}

export default new ActivityService();