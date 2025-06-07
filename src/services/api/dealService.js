class DealService {
  constructor() {
    this.tableName = 'deal';
    this.fields = [
      'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy',
      'ModifiedOn', 'ModifiedBy', 'title', 'value', 'contact_id', 
      'stage', 'probability', 'expected_close', 'created_at'
    ];
    this.updateableFields = ['title', 'value', 'contact_id', 'stage', 'probability', 'expected_close', 'created_at'];
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
        throw new Error(response?.message || 'Failed to fetch deals');
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching deals:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const client = this.getApperClient();
      const params = { fields: this.fields };
      
      const response = await client.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to fetch deal');
      }
      
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error);
      throw error;
    }
  }

  async create(dealData) {
    try {
      const client = this.getApperClient();
      
      // Filter to only include updateable fields
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (dealData[field] !== undefined) {
          filteredData[field] = dealData[field];
        }
      });

      // Ensure contact_id is integer
      if (filteredData.contact_id) {
        filteredData.contact_id = parseInt(filteredData.contact_id);
      }

      // Ensure value is float
      if (filteredData.value) {
        filteredData.value = parseFloat(filteredData.value);
      }

      // Ensure probability is integer
      if (filteredData.probability) {
        filteredData.probability = parseInt(filteredData.probability);
      }

      // Set created_at to current datetime
      filteredData.created_at = new Date().toISOString();
      
      const params = { records: [filteredData] };
      const response = await client.createRecord(this.tableName, params);
      
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to create deal');
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:`, failedRecords);
          throw new Error(failedRecords[0]?.message || 'Failed to create deal');
        }
        
        return successfulRecords[0]?.data;
      }
      
      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error('Error creating deal:', error);
      throw error;
    }
  }

  async update(id, dealData) {
    try {
      const client = this.getApperClient();
      
      // Filter to only include updateable fields
      const filteredData = { Id: parseInt(id) };
      this.updateableFields.forEach(field => {
        if (dealData[field] !== undefined) {
          filteredData[field] = dealData[field];
        }
      });

      // Ensure contact_id is integer
      if (filteredData.contact_id) {
        filteredData.contact_id = parseInt(filteredData.contact_id);
      }

      // Ensure value is float
      if (filteredData.value) {
        filteredData.value = parseFloat(filteredData.value);
      }

      // Ensure probability is integer
      if (filteredData.probability) {
        filteredData.probability = parseInt(filteredData.probability);
      }
      
      const params = { records: [filteredData] };
      const response = await client.updateRecord(this.tableName, params);
      
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to update deal');
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:`, failedUpdates);
          throw new Error(failedUpdates[0]?.message || 'Failed to update deal');
        }
        
        return successfulUpdates[0]?.data;
      }
      
      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error('Error updating deal:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const client = this.getApperClient();
      const params = { RecordIds: [parseInt(id)] };
      
      const response = await client.deleteRecord(this.tableName, params);
      
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to delete deal');
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:`, failedDeletions);
          throw new Error(failedDeletions[0]?.message || 'Failed to delete deal');
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting deal:', error);
      throw error;
    }
  }
}

export default new DealService();