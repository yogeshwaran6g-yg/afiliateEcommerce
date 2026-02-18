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
    },

    getKYCRecords: async (status) => {
        try {
            const url = status ? `${API_BASE_URL}/admin/kyc?status=${status}` : `${API_BASE_URL}/admin/kyc`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch KYC records');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in userApiService.getKYCRecords:', error);
            throw error;
        }
    },

    updateKYCStatus: async (userId, type, status) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/kyc/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ type, status })
            });

            if (!response.ok) {
                // - [x] Implement KYC Approval/Rejection Flow
                // - [x] Create backend endpoint for KYC status updates
                // - [x] Add updateKYCStatus method to frontend service
                // - [x] Make action buttons functional in KYCDetails.jsx
                // - [x] Implement "Approve All" feature 
                // - [x] Verify persistence of status changes
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update KYC status');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in userApiService.updateKYCStatus:', error);
            throw error;
        }
    }
};

export default userApiService;
