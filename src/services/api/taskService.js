class TaskService {
  constructor() {
    this.tableName = 'task';
    this.fields = [
      'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy',
      'ModifiedOn', 'ModifiedBy', 'title', 'contact_id', 'due_date', 
      'priority', 'completed'
    ];
    this.updateableFields = ['title', 'contact_id', 'due_date', 'priority', 'completed'];
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
        orderBy: [{ fieldName: "due_date", SortType: "ASC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to fetch tasks');
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const client = this.getApperClient();
      const params = { fields: this.fields };
      
      const response = await client.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to fetch task');
      }
      
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      const client = this.getApperClient();
      
      // Filter to only include updateable fields
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (taskData[field] !== undefined) {
          filteredData[field] = taskData[field];
        }
      });

      // Ensure contact_id is integer if provided
      if (filteredData.contact_id) {
        filteredData.contact_id = parseInt(filteredData.contact_id);
      }

      // Ensure completed is boolean
      if (filteredData.completed !== undefined) {
        filteredData.completed = Boolean(filteredData.completed);
      }

      // Ensure due_date is in correct format (YYYY-MM-DD)
      if (filteredData.due_date) {
        const date = new Date(filteredData.due_date);
        filteredData.due_date = date.toISOString().split('T')[0];
      }
      
      const params = { records: [filteredData] };
      const response = await client.createRecord(this.tableName, params);
      
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to create task');
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:`, failedRecords);
          throw new Error(failedRecords[0]?.message || 'Failed to create task');
        }
        
        return successfulRecords[0]?.data;
      }
      
      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async update(id, taskData) {
    try {
      const client = this.getApperClient();
      
      // Filter to only include updateable fields
      const filteredData = { Id: parseInt(id) };
      this.updateableFields.forEach(field => {
        if (taskData[field] !== undefined) {
          filteredData[field] = taskData[field];
        }
      });

      // Ensure contact_id is integer if provided
      if (filteredData.contact_id) {
        filteredData.contact_id = parseInt(filteredData.contact_id);
      }

      // Ensure completed is boolean
      if (filteredData.completed !== undefined) {
        filteredData.completed = Boolean(filteredData.completed);
      }

      // Ensure due_date is in correct format (YYYY-MM-DD)
      if (filteredData.due_date) {
        const date = new Date(filteredData.due_date);
        filteredData.due_date = date.toISOString().split('T')[0];
      }
      
      const params = { records: [filteredData] };
      const response = await client.updateRecord(this.tableName, params);
      
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to update task');
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:`, failedUpdates);
          throw new Error(failedUpdates[0]?.message || 'Failed to update task');
        }
        
        return successfulUpdates[0]?.data;
      }
      
      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const client = this.getApperClient();
      const params = { RecordIds: [parseInt(id)] };
      
      const response = await client.deleteRecord(this.tableName, params);
      
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to delete task');
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:`, failedDeletions);
          throw new Error(failedDeletions[0]?.message || 'Failed to delete task');
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
}

export default new TaskService();