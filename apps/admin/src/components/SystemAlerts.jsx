import React from "react";

export default function SystemAlerts() {
    const alerts = [
        {
            type: "HIGH PRIORITY",
            title: "Large Withdrawal Flagged",
            description: "User #8921 requested a payout of $4,500. Manual verification required.",
            time: "2m ago",
            color: "red"
        },
        {
            type: "KYC VERIFICATION",
            title: "12 New Member Approvals",
            description: "New users from the Southeast Asia region are awaiting document verification.",
            time: "1h ago",
            color: "blue"
        },
        {
            type: "SECURITY",
            title: "Multiple Login Attempts",
            description: "Unusual login patterns detected from IP 192.168.1.1 on node #04.",
            time: "4h ago",
            color: "slate"
        },
        {
            type: "BACKUP SUCCESS",
            title: "Weekly Database Export",
            description: "Cloud storage backup completed successfully. Total size: 4.2GB.",
            time: "12h ago",
            color: "green"
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500 fill-1">campaign</span>
                <h3 className="text-lg font-bold text-[#172b4d]">System Alerts</h3>
            </div>

            <div className="space-y-4">
                {alerts.map((alert, i) => (
                    <div key={i} className={`relative p-5 rounded-2xl border ${alert.color === 'red' ? 'bg-red-50/50 border-red-100' : 'bg-white border-slate-100 shadow-sm'} transition-all hover:scale-[1.02] cursor-pointer`}>
                        {alert.color === 'red' && (
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500 rounded-l-2xl"></div>
                        )}
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-[9px] font-black tracking-widest uppercase ${alert.color === 'red' ? 'text-red-600' :
                                    alert.color === 'blue' ? 'text-primary' :
                                        alert.color === 'green' ? 'text-green-600' : 'text-slate-500'
                                }`}>
                                {alert.type}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">{alert.time}</span>
                        </div>
                        <h4 className="text-sm font-bold text-[#172b4d] mb-1">{alert.title}</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{alert.description}</p>

                        {alert.color === 'red' && (
                            <div className="flex gap-2 mt-4">
                                <button className="px-4 py-1.5 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-700 transition-colors">Review Now</button>
                                <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-slate-50 transition-colors">Dismiss</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button className="w-full py-3 text-primary text-xs font-bold hover:underline">Clear All Notifications</button>
        </div>
    );
}
