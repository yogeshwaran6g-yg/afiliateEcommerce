import React, { useState } from "react";

export default function SystemAlerts() {
    const [alerts, setAlerts] = useState([
        {
            id: 1,
            type: "HIGH PRIORITY",
            title: "Large Withdrawal Flagged",
            description: "User #8921 requested a payout of ₹4,500. Manual verification required.",
            time: "2m ago",
            color: "red"
        },
        {
            id: 2,
            type: "KYC VERIFICATION",
            title: "12 New Member Approvals",
            description: "New users from the Southeast Asia region are awaiting document verification.",
            time: "1h ago",
            color: "blue"
        },
        {
            id: 3,
            type: "SECURITY",
            title: "Multiple Login Attempts",
            description: "Unusual login patterns detected from IP 192.168.1.1 on node #04.",
            time: "4h ago",
            color: "slate"
        },
        {
            id: 4,
            type: "BACKUP SUCCESS",
            title: "Weekly Database Export",
            description: "Cloud storage backup completed successfully. Total size: 4.2GB.",
            time: "12h ago",
            color: "green"
        }
    ]);

    const handleDismiss = (id) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500 fill-1">campaign</span>
                <h3 className="text-lg font-bold text-[#172b4d]">System Alerts</h3>
            </div>

            <div className="space-y-4">
                {alerts.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                        <p className="text-slate-400 text-sm font-medium">No active alerts</p>
                    </div>
                ) : (
                    alerts.map((alert) => (
                        <div key={alert.id} className={`relative p-5 rounded-2xl border ${alert.color === 'red' ? 'bg-red-50/50 border-red-100' : 'bg-white border-slate-100 shadow-sm'} transition-all hover:scale-[1.01]`}>
                            {alert.color === 'red' && (
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500 rounded-l-2xl"></div>
                            )}

                            <button
                                onClick={() => handleDismiss(alert.id)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                                title="Dismiss"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>

                            <div className="flex justify-between items-start mb-2 pr-8">
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
                                    <button
                                        onClick={() => handleDismiss(alert.id)}
                                        className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
