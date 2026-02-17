const API_BASE_URL = 'http://localhost:4000/api/v1/admin';

const rechargeApiService = {
    getRecharges: async (status = null) => {
        try {
            const query = status ? `?status=${status}` : '';
            const response = await fetch(`${API_BASE_URL}/recharges${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch recharges');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error in rechargeApiService.getRecharges:', error);
            throw error;
        }
    },

    approveRecharge: async (requestId, adminComment) => {
        try {
            const response = await fetch(`${API_BASE_URL}/approve-recharge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({ requestId, adminComment })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to approve recharge');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in rechargeApiService.approveRecharge:', error);
            throw error;
        }
    },

    rejectRecharge: async (requestId, adminComment) => {
        try {
            const response = await fetch(`${API_BASE_URL}/reject-recharge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({ requestId, adminComment })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to reject recharge');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in rechargeApiService.rejectRecharge:', error);
            throw error;
        }
    }
};

export default rechargeApiService;
