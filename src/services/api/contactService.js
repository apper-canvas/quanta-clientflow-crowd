import contactsData from '../mockData/contacts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ContactService {
  constructor() {
    this.contacts = [...contactsData];
  }

  async getAll() {
    await delay(300);
    return [...this.contacts];
  }

  async getById(id) {
    await delay(200);
    const contact = this.contacts.find(c => c.id === id);
    return contact ? { ...contact } : null;
  }

  async create(contactData) {
    await delay(400);
    const newContact = {
      ...contactData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };
    this.contacts.unshift(newContact);
    return { ...newContact };
  }

  async update(id, contactData) {
    await delay(300);
    const index = this.contacts.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Contact not found');
    
    this.contacts[index] = { ...this.contacts[index], ...contactData };
    return { ...this.contacts[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.contacts.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Contact not found');
    
    this.contacts.splice(index, 1);
    return true;
  }
}

export default new ContactService();