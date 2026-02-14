import { api } from "../util/axios";
import constants from "../config/constants";

const { wallet: walletEndpoints } = constants.endpoints;

const handleApiError = (error, context) => {
  console.error(`${context} Error:`, error.message || error);
  throw error;
};

export const getWallet = async () => {
  try {
    const response = await api.get(walletEndpoints.base);
    return response;
  } catch (error) {
    handleApiError(error, "Get Wallet");
  }
};

export const getTransactions = async (
  limit = 20,
  offset = 0,
  searchTerm = null,
  status = null,
  type = null,
) => {
  try {
    const response = await api.get(walletEndpoints.transactions, {
      params: { limit, offset, searchTerm, status, type },
    });
    return response;
  } catch (error) {
    handleApiError(error, "Get Transactions");
  }
};

export const createWithdrawRequest = async (withdrawalData) => {
  try {
    const response = await api.post(walletEndpoints.withdraw, withdrawalData);
    return response;
  } catch (error) {
    handleApiError(error, "Create Withdraw Request");
  }
};

export const createRechargeRequest = async (rechargeData) => {
  try {
    const response = await api.post(walletEndpoints.recharge, rechargeData);
    return response;
  } catch (error) {
    handleApiError(error, "Create Recharge Request");
  }
};

export const getWithdrawalRequests = async (status) => {
  try {
    const response = await api.get(walletEndpoints.withdrawals, {
      params: { status },
    });
    return response;
  } catch (error) {
    handleApiError(error, "Get Withdrawal Requests");
  }
};

export const getRechargeRequests = async (status) => {
  try {
    const response = await api.get(walletEndpoints.recharges, {
      params: { status },
    });
    return response;
  } catch (error) {
    handleApiError(error, "Get Recharge Requests");
  }
};

export default {
  getWallet,
  getTransactions,
  createWithdrawRequest,
  createRechargeRequest,
  getWithdrawalRequests,
  getRechargeRequests,
};
