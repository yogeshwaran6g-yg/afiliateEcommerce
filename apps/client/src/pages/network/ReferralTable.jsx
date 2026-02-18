import React from "react";

const ReferralTable = ({ referrals = [], pagination, onPageChange }) => {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
            Referring Members
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            List of all users you have directly invited and their organization's contribution
          </p>
        </div>
        <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 shadow-sm">
          {pagination ? pagination.total : referrals.length} Total
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/30 border-b border-slate-100">
            <tr>
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Member
              </th>
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:table-cell">
                Contact
              </th>
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">
                Join Date
              </th>
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Status
              </th>
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Contribution
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {referrals.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-slate-200 text-6xl">
                      person_add
                    </span>
                    <p className="text-slate-500 font-medium max-w-xs mx-auto">
                      No direct referrals found. Start inviting members to grow
                      your network!
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              referrals.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-slate-50/30 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-700 font-bold text-base shadow-inner uppercase group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                        {r.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          {r.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold">
                          UID: {r.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 hidden sm:table-cell">
                    <div className="text-xs font-medium text-slate-600">
                      {r.email}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold tracking-tight">
                      {r.phone}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs font-semibold text-slate-500 hidden md:table-cell">
                    {r.joinedAt ? new Date(r.joinedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }) : "N/A"}
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        r.status === "Active"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-black text-slate-900">
                      ₹{(r.totalContribution || 0).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-bold">
                      Network Revenue
                    </div>
                  </td>                
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-8 py-4 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center">
            <button
            onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
            disabled={pagination.page === 1}
            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
            <span className="material-symbols-outlined text-sm font-bold">arrow_back</span>
            </button>

            <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Page</span>
            <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-700 shadow-sm min-w-[2rem] text-center">
                {pagination.page}
            </div>
            <span className="text-xs font-bold text-slate-400">of {pagination.totalPages}</span>
            </div>

            <button
            onClick={() => onPageChange(Math.min(pagination.totalPages, pagination.page + 1))}
            disabled={pagination.page === pagination.totalPages}
            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
            <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
            </button>
        </div>
      )}
    </div>
  );
};

export default ReferralTable;
