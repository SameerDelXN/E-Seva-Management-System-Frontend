const API_BASE_URL = 'https://dokument-guru-backend.vercel.app/api/admin/staff';

export const staffService = {
  // Fetch all staff
  fetchAllStaff: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/fetch-all-staff`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch staff. Status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  },

  // Add new staff
  addStaff: async (staffData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/add-staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(staffData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add staff');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding staff:', error);
      throw error;
    }
  },

  // Update staff
  updateStaff: async (staffId, staffData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/update-staff/${staffId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(staffData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update staff');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating staff:', error);
      throw error;
    }
  },

  // Delete staff
  deleteStaff: async (staffId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/delete-staff/${staffId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete staff');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting staff:', error);
      throw error;
    }
  }
}; 