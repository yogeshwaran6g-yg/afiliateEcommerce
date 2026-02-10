import React from "react";

export default function VerificationBenefits() {
    return (
        <div className="bg-primary rounded-2xl p-6 text-white shadow-lg shadow-primary/20">
            <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-xl md:text-2xl">verified_user</span>
                <h3 className="text-base md:text-lg font-bold">Verify to unlock:</h3>
            </div>
            <ul className="space-y-3">
                <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base md:text-lg">check_circle</span>
                    <span className="text-xs md:text-sm">Unlimited withdrawal amounts</span>
                </li>
                <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base md:text-lg">check_circle</span>
                    <span className="text-xs md:text-sm">Direct downline management</span>
                </li>
                <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base md:text-lg">check_circle</span>
                    <span className="text-xs md:text-sm">Premium distributor incentives</span>
                </li>
            </ul>
        </div>
    );
}
