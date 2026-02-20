const API_BASE_URL = "http://localhost:4000/api/v1";

const walletApiService = {
    getWalletTransactions: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const url = queryParams ? `${API_BASE_URL}/admin/wallet-transactions?${queryParams}` : `${API_BASE_URL}/admin/wallet-transactions`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch wallet transactions');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error in walletApiService.getWalletTransactions:', error);
            throw error;
        }
    }
};

export default walletApiService;
