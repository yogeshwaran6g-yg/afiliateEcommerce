import React, { useState, useContext } from "react";
import WithdrawalHeader from "./WithdrawalHeader";
import BankDetailsCard from "./BankDetailsCard";
import WithdrawalForm from "./WithdrawalForm";

import WithdrawalFooter from "./WithdrawalFooter";
import { ProfileContext } from "../../context/ProfileContext";
import { useWallet, useWithdrawalRequests } from "../../hooks/useWallet";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../util/axios";
import constants from "../../config/constants";

export default function Withdrawals() {
    const { profile, kycStatus, isLoading: isProfileLoading } = useContext(ProfileContext);
    const { data: walletData, isLoading: isWalletLoading } = useWallet();
    const { data: pendingRequests, isLoading: isPendingLoading } = useWithdrawalRequests('REVIEW_PENDING');

    // Fetch withdrawal settings
    const { data: settingsData, isLoading: isSettingsLoading } = useQuery({
        queryKey: ['withdrawal-settings'],
        queryFn: async () => {
            const response = await api.get(constants.endpoints.settings.withdrawal);
            return response.data.data;
        }
    });

    const [withdrawAmount, setWithdrawAmount] = useState(0);
    
    const availableBalance = walletData?.balance || 0;
    const commissionPercent = settingsData?.withdraw_commission ?? 5.0;
    const maxWithdrawAmount = settingsData?.maximum_amount_per_withdraw ?? 50000.0;
    const pendingCount = pendingRequests?.length || 0;

    const platformFee = (withdrawAmount * commissionPercent) / 100;
    const finalSettlement = withdrawAmount - platformFee;

    const setMaxAmount = () => {
        const amount = Math.min(availableBalance, maxWithdrawAmount);
        setWithdrawAmount(amount);
    };

    const isLoading = isProfileLoading || isWalletLoading || isSettingsLoading || isPendingLoading;
    const bankKycStatus = kycStatus?.bank || profile?.bank_status || 'NOT_SUBMITTED';
    const isBankVerified = bankKycStatus === 'VERIFIED';

    return (
        <div className="max-w-7xl mx-auto px-8 py-8">
            <WithdrawalHeader availableBalance={availableBalance} isLoading={isWalletLoading} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <BankDetailsCard 
                    profile={profile} 
                    isLoading={isProfileLoading} 
                    status={bankKycStatus} 
                />
                <WithdrawalForm
                    withdrawAmount={withdrawAmount}
                    setWithdrawAmount={setWithdrawAmount}
                    availableBalance={availableBalance}
                    setMaxAmount={setMaxAmount}
                    platformFee={platformFee}
                    commissionPercent={commissionPercent}
                    finalSettlement={finalSettlement}
                    maxWithdrawAmount={maxWithdrawAmount}
                    pendingCount={pendingCount}
                    hasBankDetails={!!(profile?.bank_name && profile?.bank_account_number)}
                    isBankVerified={isBankVerified}
                    bankKycStatus={bankKycStatus}
                    isLoading={isLoading}
                />
            </div>

            <WithdrawalFooter />
        </div>
    );
}
