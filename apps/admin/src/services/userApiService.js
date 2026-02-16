const API_BASE_URL = "http://localhost:4000/api/v1";

const userApiService = {
    getUsers: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Note: In a real app, you'd add the Auth token here
                    // 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch users');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in userApiService.getUsers:', error);
            throw error;
        }
    },

    getUserDetails: async (userId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch user details');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in userApiService.getUserDetails:', error);
            throw error;
        }
    },

    updateUser: async (userId, userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update user');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in userApiService.updateUser:', error);
            throw error;
        }
    }
};

export default userApiService;
