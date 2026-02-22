import { api, handleServiceError } from "../util/axios";
import constants from "../config/constants";

const { wallet: walletEndpoints } = constants.endpoints;

export const getWallet = async () => {
  try {
    const response = await api.get(walletEndpoints.base);
    return response;
  } catch (error) {
    handleServiceError(error, "Get Wallet");
  }
};

export const getTransactions = async (limit = 10, offset = 0, filters = {}) => {
  try {
    const { searchTerm, status, type } = filters;
    const response = await api.get(walletEndpoints.transactions, {      
        limit,
        offset,
        searchTerm,
        status,
        type,
    });
    return response;
  } catch (error) {
    handleServiceError(error, "Get Transactions");
  }
};

export const createWithdrawRequest = async (withdrawalData) => {
  try {
    const response = await api.post(walletEndpoints.withdraw, withdrawalData);
    return response;
  } catch (error) {
    handleServiceError(error, "Create Withdraw Request");
  }
};

export const createRechargeRequest = async (rechargeData) => {
  try {
    const response = await api.post(walletEndpoints.recharge, rechargeData);
    return response;
  } catch (error) {
    handleServiceError(error, "Create Recharge Request");
  }
};

export const getWithdrawalRequests = async (status) => {
  try {
    const response = await api.get(walletEndpoints.withdrawals, { status });
    return response;
  } catch (error) {
    handleServiceError(error, "Get Withdrawal Requests");
  }
};

export const getRechargeRequests = async (status) => {
  try {
    const response = await api.get(walletEndpoints.recharges, { status });
    return response;
  } catch (error) {
    handleServiceError(error, "Get Recharge Requests");
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
