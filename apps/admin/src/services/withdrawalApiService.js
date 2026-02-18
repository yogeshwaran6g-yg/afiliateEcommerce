const API_BASE_URL = 'http://localhost:4000/api/v1/admin';

const withdrawalApiService = {
    getWithdrawals: async (status = null) => {
        try {
            const query = status ? `?status=${status}` : '';
            const response = await fetch(`${API_BASE_URL}/withdrawals${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch withdrawals');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in withdrawalApiService.getWithdrawals:', error);
            throw error;
        }
    },

    approveWithdrawal: async (requestId, adminComment) => {
        try {
            const response = await fetch(`${API_BASE_URL}/approve-withdrawal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({ requestId, adminComment })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to approve withdrawal');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in withdrawalApiService.approveWithdrawal:', error);
            throw error;
        }
    },

    rejectWithdrawal: async (requestId, adminComment) => {
        try {
            const response = await fetch(`${API_BASE_URL}/reject-withdrawal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({ requestId, adminComment })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to reject withdrawal');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in withdrawalApiService.rejectWithdrawal:', error);
            throw error;
        }
    }
};

export default withdrawalApiService;
