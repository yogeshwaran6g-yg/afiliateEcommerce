import React from "react";
import {
  X,
  GitBranch,
  MessageCircle,
  UserPlus,
  TrendingUp,
  Award,
} from "lucide-react";

const MemberDetailsModal = ({ member, isOpen, onClose, onViewTree }) => {
  if (!member) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-md transition-all duration-300">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full md:w-[480px] bg-white h-full overflow-y-auto shadow-2xl animate-slide-in flex flex-col">
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          .animate-slide-in {
            animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
        `}</style>

        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 p-8 z-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
              Member Profile
            </h2>
            <button
              onClick={onClose}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all border border-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={
                  member.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=3b82f6&color=fff&size=128`
                }
                alt={member.name}
                className="w-24 h-24 rounded-3xl object-cover border-4 border-slate-50 shadow-xl"
              />
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 border-4 border-white rounded-full shadow-lg ${member.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-slate-900 mb-1">
                {member.name}
              </h3>
              <p className="text-slate-500 font-bold text-sm mb-3">
                Joined {new Date(member.joinDate).toLocaleDateString()}
              </p>
              <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider border shadow-sm ${member.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                {member.status === 'active' ? 'Active Member' : 'Inactive Member'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8 flex-1">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-5 border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-blue-100 group">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 group-hover:text-blue-500 transition-colors">
                Direct Referrals
              </p>
              <p className="text-2xl font-black text-slate-900 leading-none">
                {member.directRefs || 0}
              </p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-5 border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-primary/20 group">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">
                Network Size
              </p>
              <p className="text-2xl font-black text-primary leading-none">
                {member.networkSize || 0}
              </p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-5 border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-emerald-100 group col-span-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 group-hover:text-emerald-500 transition-colors">
                Total Contribution
              </p>
              <p className="text-2xl font-black text-slate-900 leading-none">
                ₹{member.earnings?.toLocaleString() || 0}
              </p>
            </div>
          </div>

          {/* Network Summary */}
          {member.children && member.children.length > 0 && (
            <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
              <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2 text-sm uppercase tracking-wider relative">
                <GitBranch className="w-5 h-5 text-primary" />
                Recent Direct Downline
              </h4>
              <div className="space-y-4 relative">
                {[...member.children]
                  .sort((a, b) => new Date(b.joinDate || 0) - new Date(a.joinDate || 0))
                  .slice(0, 5)
                  .map((child, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between group/item p-2 hover:bg-slate-50 rounded-xl transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full bg-primary/40 group-hover/item:bg-primary transition-colors`} />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700">
                            {child.name}
                          </span>
                          {child.joinDate && (
                            <span className="text-[9px] text-slate-400 font-medium">
                              {new Date(child.joinDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-black text-[10px] rounded-md group-hover/item:bg-primary group-hover/item:text-white transition-all">
                        LVL {child.level}
                      </span>
                    </div>
                  ))}
                {member.children.length > 5 && (
                  <button 
                    onClick={() => {
                      onViewTree(member);
                      onClose();
                    }}
                    className="w-full text-center text-xs text-primary font-black mt-4 hover:underline cursor-pointer py-2"
                  >
                    View All {member.children.length} Referrals
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Activity Placeholder */}
          <div className="space-y-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-100 border-dashed">
            <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Network Explorer
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium capitalize">
              Explore {member.name.toLowerCase()}'s downline network to see their performance and contribution in real-time. Use the button below to switch your view to their position.
            </p>
          </div>
        </div>

        {/* Action Footer */}
        <div className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-slate-100 p-8">
          <button
            onClick={() => {
              onViewTree(member);
              onClose();
            }}
            className="w-full px-6 py-4 bg-primary text-white font-black rounded-2xl transition-all shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group"
          >
            <GitBranch className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            EXPLORE NETWORK
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailsModal;
