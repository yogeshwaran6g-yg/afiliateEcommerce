import React from "react";

const ReportCard = ({ title, description, tag, type, icon }) => (
    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full relative group">
        <div className="flex justify-between items-start mb-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${type === 'FINANCIAL' ? 'bg-blue-100 text-blue-600' :
                type === 'PAYOUTS' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                } shadow-sm group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-2xl font-bold">{icon}</span>
            </div>
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                {tag}
            </span>
        </div>

        <h3 className="text-lg md:text-xl font-bold text-[#172b4d] mb-2">{title}</h3>
        <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed mb-6 md:mb-8">{description}</p>

        <div className="mt-auto space-y-4">
            {title !== "Commission Report" ? (
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">DATE RANGE</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input type="date" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        <input type="date" className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">PAYOUT CYCLE</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                        <option>Current Cycle (Oct 2023)</option>
                        <option>Sept 2023</option>
                        <option>Aug 2023</option>
                    </select>
                </div>
            )}

            <button className="w-full py-3.5 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 leading-none">
                <span className="material-symbols-outlined text-lg">settings</span>
                <span>Generate</span>
            </button>
        </div>
    </div>
);

export default function Reports() {
    const historicalReports = [
        { name: "Sales_Report_Oct_2023.csv", date: "Oct 24, 2023", status: "Completed", size: "2.4 MB" },
        { name: "Commission_Payouts_Q3.csv", date: "Oct 23, 2023", status: "Completed", size: "14.8 MB" },
        { name: "Distributor_Growth.csv", date: "Oct 22, 2023", status: "Processing", size: "-" },
        { name: "Inventory_Status.csv", date: "Oct 20, 2023", status: "Completed", size: "1.2 MB" },
    ];

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-12">
            {/* Header Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    <span>Admin</span>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                    <span className="text-primary">System Reports</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-[#172b4d] tracking-tight">Advanced System Reports</h2>
                <p className="text-sm md:text-lg text-slate-500 font-medium max-w-2xl">Generate, configure, and download granular data exports for your MLM ecosystem.</p>
            </div>

            {/* Report Config Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <ReportCard
                    title="Sales Report"
                    description="Detailed analysis of revenue by SKU, product category, and regional performance."
                    tag="FINANCIAL"
                    type="FINANCIAL"
                    icon="assessment"
                />
                <ReportCard
                    title="Commission Report"
                    description="Unilevel payouts, dynamic compression logs, and performance bonus disbursements."
                    tag="PAYOUTS"
                    type="PAYOUTS"
                    icon="calendar_today"
                />
                <ReportCard
                    title="User Growth Report"
                    description="New distributor registrations, retention rates, and genealogy activity spikes."
                    tag="NETWORK"
                    type="NETWORK"
                    icon="person_add"
                />
            </div>

            {/* Recently Generated Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-50 gap-4">
                    <div>
                        <h3 className="text-lg md:text-xl font-bold text-[#172b4d]">Historical Exports</h3>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Stored for 30 days</p>
                    </div>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:bg-slate-100 transition-colors uppercase tracking-widest">
                        <span className="material-symbols-outlined text-lg">filter_alt</span>
                        <span>Filter</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">REPORT NAME</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">DATE</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">SIZE</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">DOWNLOAD</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {historicalReports.map((report, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5 flex items-center gap-3">
                                        <span className="material-symbols-outlined text-slate-300">description</span>
                                        <span className="text-sm font-bold text-[#172b4d]">{report.name}</span>
                                    </td>
                                    <td className="px-8 py-5 text-sm text-slate-500 font-medium">{report.date}</td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${report.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-sm text-slate-500 font-medium">{report.size}</td>
                                    <td className="px-8 py-5 text-right">
                                        {report.status === 'Completed' ? (
                                            <div className="flex items-center justify-end gap-3 text-[10px] font-black text-primary uppercase tracking-widest">
                                                <button className="hover:underline">CSV</button>
                                                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                <button className="hover:underline">XLSX</button>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-bold text-slate-400 italic">Syncing...</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between border-t border-slate-50 gap-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">1 - 4 of 50 reports</p>
                    <div className="flex items-center gap-1.5">
                        <button className="px-3 py-2 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-500 hover:bg-slate-50 transition-all uppercase leading-none">Prev</button>
                        <button className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-xl text-[10px] font-bold shadow-lg shadow-primary/20">1</button>
                        <button className="px-3 py-2 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-500 hover:bg-slate-50 transition-all uppercase leading-none">Next</button>
                    </div>
                </div>
            </div>

            {/* Notice Banner */}
            <div className="bg-blue-50 border border-blue-100 p-6 md:p-8 rounded-[2.5rem] flex gap-6 items-start">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary border border-blue-100 shrink-0">
                    <span className="material-symbols-outlined font-bold text-2xl">info</span>
                </div>
                <div>
                    <h4 className="text-sm font-black text-blue-900 mb-1 uppercase tracking-widest">Data Processing Notice</h4>
                    <p className="text-xs text-blue-800 leading-relaxed font-medium">Large datasets may take several minutes to compile. You will receive an internal notification once the background process is complete.</p>
                </div>
            </div>
        </div>
    );
}
