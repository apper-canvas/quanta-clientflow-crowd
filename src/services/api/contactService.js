class ContactService {
  constructor() {
    this.tableName = 'contact';
    this.fields = [
      'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
      'ModifiedOn', 'ModifiedBy', 'email', 'phone', 'company', 'last_activity'
    ];
    this.updateableFields = ['Name', 'Tags', 'email', 'phone', 'company', 'last_activity'];
  }

  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const client = this.getApperClient();
      const params = {
        fields: this.fields,
        orderBy: [{ fieldName: "CreatedOn", SortType: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to fetch contacts');
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const client = this.getApperClient();
      const params = { fields: this.fields };
      
      const response = await client.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to fetch contact');
      }
      
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error);
      throw error;
    }
  }

  async create(contactData) {
    try {
      const client = this.getApperClient();
      
      // Filter to only include updateable fields
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (contactData[field] !== undefined) {
          filteredData[field] = contactData[field];
        }
      });

      // Convert tags array to comma-separated string if needed
      if (filteredData.Tags && Array.isArray(filteredData.Tags)) {
        filteredData.Tags = filteredData.Tags.join(',');
      }

      // Set last_activity to current datetime
      filteredData.last_activity = new Date().toISOString();
      
      const params = { records: [filteredData] };
      const response = await client.createRecord(this.tableName, params);
      
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to create contact');
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:`, failedRecords);
          throw new Error(failedRecords[0]?.message || 'Failed to create contact');
        }
        
        return successfulRecords[0]?.data;
      }
      
      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  async update(id, contactData) {
    try {
      const client = this.getApperClient();
      
      // Filter to only include updateable fields
      const filteredData = { Id: parseInt(id) };
      this.updateableFields.forEach(field => {
        if (contactData[field] !== undefined) {
          filteredData[field] = contactData[field];
        }
      });

      // Convert tags array to comma-separated string if needed
      if (filteredData.Tags && Array.isArray(filteredData.Tags)) {
        filteredData.Tags = filteredData.Tags.join(',');
      }
      
      const params = { records: [filteredData] };
      const response = await client.updateRecord(this.tableName, params);
      
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to update contact');
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:`, failedUpdates);
          throw new Error(failedUpdates[0]?.message || 'Failed to update contact');
        }
        
        return successfulUpdates[0]?.data;
      }
      
      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const client = this.getApperClient();
      const params = { RecordIds: [parseInt(id)] };
      
      const response = await client.deleteRecord(this.tableName, params);
      
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to delete contact');
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:`, failedDeletions);
          throw new Error(failedDeletions[0]?.message || 'Failed to delete contact');
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }
}

export default new ContactService();