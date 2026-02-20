// import React from "react";
// import { Link, useLocation } from "react-router-dom";

// const Dashboard = () => {
//   const location = useLocation();
//   const isActive = (path) => location.pathname === path;

//   return (
//     <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
//       {/* Sidebar Navigation */}
//       <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 h-screen hidden md:flex flex-col">
//         <div className="p-6 flex items-center gap-3">
//           <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
//             <span className="material-symbols-outlined">account_balance_wallet</span>
//           </div>
//           <div className="flex flex-col">
//             <h1 className="text-lg font-bold leading-tight tracking-tight">FinMLM</h1>
//             <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Distributor</span>
//           </div>
//         </div>
//         <nav className="flex-1 px-4 py-4 space-y-1">
//           <Link
//             className={`${isActive("/dashboard") ? "sidebar-item-active" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"} flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors`}
//             to="/dashboard"
//           >
//             <span className="material-symbols-outlined">dashboard</span>
//             <span>Dashboard</span>
//           </Link>
//           <Link
//             className={`${isActive("/network") ? "sidebar-item-active" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"} flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors`}
//             to="/network"
//           >
//             <span className="material-symbols-outlined">hub</span>
//             <span>My Network</span>
//           </Link>
//           <Link
//             className={`${isActive("/wallet") ? "sidebar-item-active" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"} flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors`}
//             to="/wallet"
//           >
//             <span className="material-symbols-outlined">payments</span>
//             <span>Wallet</span>
//           </Link>
//           <Link
//             className={`${isActive("/reports") ? "sidebar-item-active" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"} flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors`}
//             to="/reports"
//           >
//             <span className="material-symbols-outlined">bar_chart</span>
//             <span>Reports</span>
//           </Link>
//           <Link
//             className={`${isActive("/inventory") ? "sidebar-item-active" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"} flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors`}
//             to="/inventory"
//           >
//             <span className="material-symbols-outlined">inventory_2</span>
//             <span>Products</span>
//           </Link>
//           <div className="pt-4 pb-2 text-xs font-semibold text-slate-400 uppercase px-4 tracking-widest">
//             Support
//           </div>
//           <a
//             className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors"
//             href="#"
//           >
//             <span className="material-symbols-outlined">person</span>
//             <span>Profile</span>
//           </a>
//           <a
//             className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors"
//             href="#"
//           >
//             <span className="material-symbols-outlined">help</span>
//             <span>Help Center</span>
//           </a>
//         </nav>
//         <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-800">
//           <button className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md shadow-accent/20">
//             <span className="material-symbols-outlined text-[18px]">person_add</span>
//             <span>Invite Member</span>
//           </button>
//         </div>
//       </aside>

//       {/* Main Content Area */}
//       <main className="flex-1 flex flex-col min-w-0">
//         {/* Top Navbar */}
//         <header className="h-16 glass-header border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
//           <div className="flex items-center gap-4 flex-1 max-w-xl">
//             <div className="relative w-full">
//               <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
//                 search
//               </span>
//               <input
//                 className="w-full pl-10 pr-4 py-2 rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus:ring-primary focus:border-primary text-sm"
//                 placeholder="Search data, transactions, or network..."
//                 type="text"
//               />
//             </div>
//           </div>
//           <div className="flex items-center gap-6">
//             {/* Wallet Balance Display */}
//             <div className="hidden lg:flex flex-col items-end">
//               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
//                 Available Payout
//               </span>
//               <span className="text-primary font-bold text-lg">₹4,250.00</span>
//             </div>
//             <div className="flex items-center gap-3">
//               <Link
//                 className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
//                 to="/notifications"
//               >
//                 <span className="material-symbols-outlined">notifications</span>
//                 <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
//               </Link>
//               <div className="h-8 w-[1px] bg-slate-200 dark:border-slate-800"></div>
//               <div className="flex items-center gap-3 cursor-pointer group">
//                 <div
//                   className="size-10 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-primary overflow-hidden transition-transform group-hover:scale-105"
//                   style={{
//                     backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDX_dj4KfY6NKcsjryLVAz302mj4ap8VZXGDmA847VctRCQyj5SuefFtzW0hnb1Cdgs9Enl7l70_ui1jrHWj_sHQbVOxhoP5-8IMCQ7YhkZJpZdhDRIRMiSbXTyu5aMODTEN7waowtGKb9UztPBdt2sRD4Hc7XzQRV0anhyY9qDS78D8Yu8LGSpObqn_iBmb2uYWvKhS6vpENUHMdorRAYZdAvw0BvNYBKAzflWEy95LHdPocZOu9pJ0wbfmFzRLyfKxxhfXcvyhQg")`,
//                     backgroundSize: "cover",
//                   }}
//                 ></div>
//                 <div className="hidden sm:block">
//                   <p className="text-sm font-bold leading-none">Alex Thompson</p>
//                   <p className="text-xs text-slate-500 font-medium">Gold Member</p>
//                 </div>
//                 <span className="material-symbols-outlined text-slate-400 text-sm">expand_more</span>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Dashboard Content */}
//         <div className="p-8 space-y-8">
//           {/* Page Title */}
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div>
//               <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Good Morning, Alex!</h2>
//               <p className="text-slate-500 font-medium">Here's what's happening with your network today.</p>
//             </div>
//             <div className="flex gap-3">
//               <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-900">
//                 <span className="material-symbols-outlined text-[20px]">file_download</span>
//                 Export Data
//               </button>
//               <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
//                 <span className="material-symbols-outlined text-[20px]">add</span>
//                 New Order
//               </button>
//             </div>
//           </div>

//           {/* Metric Summary Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {/* Total Earnings Card */}
//             <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
//               <div className="flex justify-between items-start mb-4">
//                 <div className="size-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
//                   <span className="material-symbols-outlined">payments</span>
//                 </div>
//                 <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
//                   <span className="material-symbols-outlined text-[14px]">trending_up</span>
//                   12.5%
//                 </span>
//               </div>
//               <p className="text-slate-500 text-sm font-medium">Total Lifetime Earnings</p>
//               <h3 className="text-2xl font-bold mt-1">₹12,450.00</h3>
//               <p className="text-xs text-slate-400 mt-4 italic font-medium">Updated 5m ago</p>
//             </div>

//             {/* Withdrawable Balance Card (Primary Emphasis) */}
//             <div className="bg-primary p-6 rounded-xl border border-primary shadow-lg shadow-primary/30 relative overflow-hidden group">
//               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
//                 <span className="material-symbols-outlined text-[120px]">account_balance</span>
//               </div>
//               <div className="relative z-10 flex flex-col h-full">
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="size-12 rounded-lg bg-white/20 flex items-center justify-center text-white">
//                     <span className="material-symbols-outlined">savings</span>
//                   </div>
//                 </div>
//                 <p className="text-white/80 text-sm font-medium">Withdrawable Balance</p>
//                 <h3 className="text-3xl font-bold text-white mt-1">₹2,100.50</h3>
//                 <div className="mt-auto pt-6">
//                   <button className="w-full bg-white text-primary font-bold py-2 rounded-lg text-sm hover:bg-slate-100 transition-colors">
//                     Withdraw Funds
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Team Size Card */}
//             <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
//               <div className="flex justify-between items-start mb-4">
//                 <div className="size-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
//                   <span className="material-symbols-outlined">groups</span>
//                 </div>
//                 <span className="flex items-center text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
//                   <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
//                   5.2%
//                 </span>
//               </div>
//               <p className="text-slate-500 text-sm font-medium">Total Team Size</p>
//               <h3 className="text-2xl font-bold mt-1">
//                 1,240 <span className="text-slate-400 text-sm font-normal">Members</span>
//               </h3>
//               <div className="mt-4 flex -space-x-2">
//                 {[
//                   "https://lh3.googleusercontent.com/aida-public/AB6AXuAA5TI26DoaRJgUx4qxaRXjiwtBrN_zRjetH_9esJ-VtZ7v5GWT64DQg3JPGy0i3wE7uI_schVyWNTxWDdwcKbZZxEyhJnI2qasny8yjzgq62UcIDQ_WaQZ-efrgzKlEkc2CISluzA9gEgUtJFrLkI1YOQ53cFxQ3MiKAb8TgoehohS8FvLDgDX0zjVaN0j4vjCBuU5j88azrWTwJvx182RDUaVHvtd5vMOqyoAudAcN656JVL6_4-qiuOlVaY8hd1yClx-p4bU318",
//                   "https://lh3.googleusercontent.com/aida-public/AB6AXuDhWPoT40Akqrr7pRUGRy0tqxPNh7VVqsR6lX_BqU4Zr2kGg_Q4ubWEf2zPeFoZkS4bI-lEDHbxoTSJIgtiobzCd1JaB2o0WHBZKUtII8yvBGe2ZuNLhnIajg9VzOAMDZGcqM17ihKuihOKaPrMQkOFfTBv6q4qMKQlGU0Z2Zy-xzpPHh-dbSg6CejBazKVfT8LxLyAurL5ej-mUHOZJaKuTQ9SZRo2AyVUdGpBwuRRq7ngskc4qUt9bf4gk7ogcIw_BmCzH8Ik7xg",
//                   "https://lh3.googleusercontent.com/aida-public/AB6AXuCVSWY5tRzjOZm9hi25JNRsMAHa67fROa5O7VrGFhJ91PajeZLgvlUWNkNJpkof2vyit8TfjRMJVwNhnMBLxLzvKihrCIOOkoL1-S4K2xQWsP2d3Vvk9iPXaE6LyoitQPOxQv7C3_LvDPsYPegwHspKLx1nAIrhk0LhEfBA4aL01rJg4tTSTmNR3gWk-pRw4kbhiEGxKZ1jvaiB5s6N3rPEbN59XqV6Z7bO8vEq0UdDJeQJwDAQX7YF_fECe_sGfYlfArNeBdfVTFY",
//                 ].map((url, i) => (
//                   <div
//                     key={i}
//                     className="size-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200"
//                     style={{ backgroundImage: `url("${url}")`, backgroundSize: "cover" }}
//                   ></div>
//                 ))}
//                 <div className="size-7 rounded-full border-2 border-white dark:border-slate-900 bg-primary flex items-center justify-center text-[10px] text-white font-bold">
//                   +12
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Charts Section */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Monthly Income (Line Chart Concept) */}
//             <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
//               <div className="flex items-center justify-between mb-8">
//                 <div>
//                   <h4 className="text-lg font-bold">Monthly Income</h4>
//                   <p className="text-sm text-slate-500 font-medium">₹1,200 Average per month</p>
//                 </div>
//                 <select className="text-xs font-bold border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg px-2 py-1 focus:ring-primary">
//                   <option>Last 6 Months</option>
//                   <option>This Year</option>
//                 </select>
//               </div>
//               <div className="h-[220px] relative w-full overflow-hidden">
//                 <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
//                   <defs>
//                     <linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
//                       <stop offset="0%" stopColor="#1754cf" stopOpacity="0.2"></stop>
//                       <stop offset="100%" stopColor="#1754cf" stopOpacity="0"></stop>
//                     </linearGradient>
//                   </defs>
//                   <path
//                     d="M0,80 Q10,75 20,60 T40,65 T60,30 T80,45 T100,20 L100,100 L0,100 Z"
//                     fill="url(#chartGradient)"
//                   ></path>
//                   <path
//                     d="M0,80 Q10,75 20,60 T40,65 T60,30 T80,45 T100,20"
//                     fill="none"
//                     stroke="#1754cf"
//                     strokeLinecap="round"
//                     strokeWidth="2.5"
//                   ></path>
//                   <circle cx="20" cy="60" fill="#1754cf" r="1.5"></circle>
//                   <circle cx="60" cy="30" fill="#1754cf" r="1.5"></circle>
//                   <circle cx="100" cy="20" fill="#1754cf" r="1.5"></circle>
//                 </svg>
//               </div>
//               <div className="flex justify-between mt-4 px-2">
//                 {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month) => (
//                   <span key={month} className="text-[10px] font-bold text-slate-400 uppercase">
//                     {month}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             {/* Team Growth (Bar Chart Concept) */}
//             <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
//               <div className="flex items-center justify-between mb-8">
//                 <div>
//                   <h4 className="text-lg font-bold">Team Growth</h4>
//                   <p className="text-sm text-slate-500 font-medium">142 New members joined</p>
//                 </div>
//                 <div className="flex items-center gap-1 text-red-500 font-bold text-xs bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
//                   <span className="material-symbols-outlined text-[14px]">trending_down</span>
//                   2.1%
//                 </div>
//               </div>
//               <div className="h-[220px] flex items-end justify-between gap-4 px-2">
//                 <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative group h-[40%]">
//                   <div className="absolute bottom-0 w-full bg-primary/20 rounded-t-lg h-1/2"></div>
//                 </div>
//                 <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative h-[65%]">
//                   <div className="absolute bottom-0 w-full bg-primary rounded-t-lg h-3/4 shadow-lg shadow-primary/20"></div>
//                 </div>
//                 <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative h-[50%]">
//                   <div className="absolute bottom-0 w-full bg-primary/20 rounded-t-lg h-2/3"></div>
//                 </div>
//                 <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative h-[80%]">
//                   <div className="absolute bottom-0 w-full bg-primary rounded-t-lg h-4/5 shadow-lg shadow-primary/20"></div>
//                 </div>
//                 <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative h-[30%]">
//                   <div className="absolute bottom-0 w-full bg-primary/20 rounded-t-lg h-1/2"></div>
//                 </div>
//                 <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative h-[90%]">
//                   <div className="absolute bottom-0 w-full bg-primary rounded-t-lg h-[95%] shadow-lg shadow-primary/20"></div>
//                 </div>
//               </div>
//               <div className="flex justify-between mt-4 px-2">
//                 {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month) => (
//                   <span key={month} className="text-[10px] font-bold text-slate-400 uppercase">
//                     {month}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Recent Activity Table Section */}
//           <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
//             <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
//               <h4 className="text-lg font-bold">Recent Network Transactions</h4>
//               <button className="text-primary text-sm font-bold hover:underline">View All</button>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead className="bg-slate-50 dark:bg-slate-800/50">
//                   <tr>
//                     <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Entity</th>
//                     <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
//                     <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
//                     <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
//                       Amount
//                     </th>
//                     <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
//                       Status
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
//                   <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs">
//                           JD
//                         </div>
//                         <div>
//                           <p className="text-sm font-bold">Jane Doe</p>
//                           <p className="text-[10px] text-slate-500 font-medium italic">Level 2 Distributor</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm font-medium">Commission</td>
//                     <td className="px-6 py-4 text-sm text-slate-500 font-medium">Oct 12, 2023</td>
//                     <td className="px-6 py-4 text-sm font-bold text-right text-green-600">+₹124.00</td>
//                     <td className="px-6 py-4 text-center">
//                       <span className="px-2 py-1 text-[10px] font-bold rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
//                         Completed
//                       </span>
//                     </td>
//                   </tr>
//                   <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs">
//                           SM
//                         </div>
//                         <div>
//                           <p className="text-sm font-bold">Steve Miller</p>
//                           <p className="text-[10px] text-slate-500 font-medium italic">Direct Referral</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm font-medium">Upgrade Bonus</td>
//                     <td className="px-6 py-4 text-sm text-slate-500 font-medium">Oct 11, 2023</td>
//                     <td className="px-6 py-4 text-sm font-bold text-right text-green-600">+₹250.00</td>
//                     <td className="px-6 py-4 text-center">
//                       <span className="px-2 py-1 text-[10px] font-bold rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
//                         Completed
//                       </span>
//                     </td>
//                   </tr>
//                   <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
//                           <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
//                         </div>
//                         <div>
//                           <p className="text-sm font-bold">Withdrawal Request</p>
//                           <p className="text-[10px] text-slate-500 font-medium italic">Bank Transfer (**** 4291)</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm font-medium">Payout</td>
//                     <td className="px-6 py-4 text-sm text-slate-500 font-medium">Oct 10, 2023</td>
//                     <td className="px-6 py-4 text-sm font-bold text-right text-slate-900 dark:text-white">-₹500.00</td>
//                     <td className="px-6 py-4 text-center">
//                       <span className="px-2 py-1 text-[10px] font-bold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
//                         Processing
//                       </span>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;
