import React, { useState, useEffect } from 'react';

const EVENTS = [
    { type: 'INITIALIZATION', message: 'New Node WD-998811 Initialized', icon: 'settings_input_component', color: 'text-blue-500' },
    { type: 'FINANCIAL', message: 'Liquid Asset Transfer: ₹12,000 via Gateway-01', icon: 'payments', color: 'text-primary' },
    { type: 'SECURITY', message: 'Unauthorized Gateway Probe Deflected at Node-04', icon: 'shield', color: 'text-red-500' },
    { type: 'NETWORK', message: 'Consensus Achieved: Block #88291 Verified', icon: 'hub', color: 'text-amber-500' },
    { type: 'SYNC', message: 'Financial Ledger Sync Complete (Global-X)', icon: 'sync', color: 'text-green-500' },
    { type: 'REGISTRY', message: 'New Identity Document Uploaded: WD-12400', icon: 'description', color: 'text-primary' },
];

export default function GlobalNodeActivity() {
    const [activeEvents, setActiveEvents] = useState([]);

    useEffect(() => {
        // Initial set of events
        setActiveEvents(EVENTS.slice(0, 4).map((e, i) => ({ ...e, id: Date.now() + i })));

        const interval = setInterval(() => {
            const randomEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)];
            setActiveEvents(prev => [{ ...randomEvent, id: Date.now() }, ...prev.slice(0, 3)]);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[#0f172a] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>

            <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>
                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Global Node Stream</h4>
                    </div>
                    <span className="text-[8px] font-black text-white/20 font-mono">NODE_SCAN: ACTIVE</span>
                </div>

                <div className="space-y-4">
                    {activeEvents.map((event) => (
                        <div key={event.id} className="flex items-start gap-4 group/item animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="mt-1 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover/item:border-white/20">
                                <span className={`material-symbols-outlined text-sm ${event.color}`}>{event.icon}</span>
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="text-[10px] font-bold text-white/90 leading-tight tracking-tight">
                                    {event.message}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">{event.type}</span>
                                    <span className="w-1 h-1 rounded-full bg-white/10"></span>
                                    <span className="text-[7px] font-medium text-white/20 font-mono">T-{Math.floor(Math.random() * 60)}s</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between text-[8px] font-black text-white/10 uppercase tracking-[0.3em]">
                        <span>Dossier Indexing</span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="w-1 h-1 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: `${i * 100}ms` }}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Scanning Line Animation */}
            <div className="absolute left-0 right-0 h-[2px] bg-primary/20 top-0 animate-[scan_8s_linear_infinite] opacity-50 pointer-events-none"></div>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scan {
                    0% { top: 0%; }
                    100% { top: 100%; }
                }
            `}} />
        </div>
    );
}
