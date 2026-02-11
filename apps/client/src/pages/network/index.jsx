import React, { useState } from "react";
import NetworkHeader from "./NetworkHeader";
import ReferralLinkCard from "./ReferralLinkCard";
import QRCodeCard from "./QRCodeCard";
import LevelTabs from "./LevelTabs";
import MemberTable from "./MemberTable";
import NetworkFooter from "./NetworkFooter";
import { levels, members } from "./data";

export default function Network() {
    const [activeLevel, setActiveLevel] = useState(1);
    const referralLink = "https://fintechmlm.io/ref/user789_elite";
    const totalReferrals = 1284;
    const activeToday = 42;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
    };

    return (
        <div className="p-4 md:p-8 space-y-6">
            <NetworkHeader />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ReferralLinkCard
                    referralLink={referralLink}
                    copyToClipboard={copyToClipboard}
                    totalReferrals={totalReferrals}
                    activeToday={activeToday}
                />
                <QRCodeCard />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <LevelTabs
                    levels={levels}
                    activeLevel={activeLevel}
                    setActiveLevel={setActiveLevel}
                />
                <MemberTable members={members} />
                <NetworkFooter />
            </div>
        </div>
    );
}
