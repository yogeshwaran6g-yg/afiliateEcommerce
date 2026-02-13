import React, { useState } from "react";
import WithdrawalHeader from "./WithdrawalHeader";
import BankDetailsCard from "./BankDetailsCard";
import WithdrawalForm from "./WithdrawalForm";
import TransactionHistory from "./TransactionHistory";
import WithdrawalFooter from "./WithdrawalFooter";
import { transactions } from "./data";

export default function Withdrawals() {
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const availableBalance = 4250.0;
    const platformFeeRate = 0.015; // 1.5%

    const platformFee = withdrawAmount * platformFeeRate;
    const finalSettlement = withdrawAmount - platformFee;

    const setMaxAmount = () => {
        setWithdrawAmount(availableBalance);
    };

    return (
        <div className="max-w-7xl mx-auto px-8 py-8">
            <WithdrawalHeader availableBalance={availableBalance} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <BankDetailsCard />
                <WithdrawalForm
                    withdrawAmount={withdrawAmount}
                    setWithdrawAmount={setWithdrawAmount}
                    availableBalance={availableBalance}
                    setMaxAmount={setMaxAmount}
                    platformFee={platformFee}
                    finalSettlement={finalSettlement}
                />
            </div>

            <TransactionHistory transactions={transactions} />
            <WithdrawalFooter />
        </div>
    );
}
