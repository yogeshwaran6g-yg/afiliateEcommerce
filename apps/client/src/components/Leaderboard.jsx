import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import PodiumCard from "./PodiumCard";
import RankingTable from "./RankingTable";

const Leaderboard = () => {
  const [timePeriod, setTimePeriod] = useState("Monthly");
  const [region, setRegion] = useState("Global Ranking");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tableData = [
    {
      rank: 4,
      name: "Emily Watson",
      id: "884210",
      region: "California, US",
      pv: "34,120",
      growth: "+12.4%",
      trend: "up",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEw0yqtsd5H0_s4-6W404NgHnaDXLR9Dbx8LCGnCJYwfbqIqhNAdzYxZPnXNNzeaYr7qFNba3YwsIERa0pvqjwOXx1VQNaCXqsm132gh1u509LPfNH2eoiHvVJbKl2CrjnZhsvwjUfAxb11bX6VklmivYaimw3kY7WJJUNT5bu1GKu89NqrWNi1NZmG1iF3rfbv23P-bKqw-DuR0qI5VpTeSmg1mCjeYIlvkvlgFfX_E9wltMa0Bmg9K4_50rkLeW-m0ODQemrbBU"
    },
    {
      rank: 5,
      name: "Robert Fox",
      id: "110943",
      region: "London, UK",
      pv: "31,800",
      growth: "+9.2%",
      trend: "up",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxMZlqzuWoHQxUTpIaPJuPyPnJyuonifxQrJgQbxVAHtuiQZgcDanMMKPtoPW0exb3JbCYMM-kc2c5g2z8YyzeiPYfXqQNCm3t1ajMDCWjYEVE8W2cM6i3jwTfC5T1rOeAS_ABVjDeWhrnYphe3evr3v7jSab0WgPsXs8fd8zIKN1fuhsKRH38HKWPpVz6epoOSpnglkchMmDSM4gUtyqKKakNm02TuxZmfX49VXpBOPzzfwkZHotry7FH0TjBntlkL-lHxmGP3Hk"
    },
    {
      rank: 6,
      name: "Jane Cooper",
      id: "900221",
      region: "Singapore, SG",
      pv: "29,950",
      growth: "+4.8%",
      trend: "none",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHltgYo2LVHaltEloThXIzNL2DfbxhMyp1Kv5VzUyL-9p0vdvRTk5mfqKq2sHO8lfrurddZQ9xApSytoc_qJ5Ee8IqQ60hGICjNKpuBHq9L3hfeCddNOxYunwOG8wnK20S-YXapsn7etc6j2M_q5oVSc40szZvQU1jiOKs3itL85bsPgprUVJ45pYQlwRj8LxJ30pEERUNWvWqAjzvg00FAsifSiYKDf2dU4R2UkYYTN2oyFhHkTASIAV2p1HAFQVaHwu8U9Lm59Y"
    },
    {
      rank: 7,
      name: "Marcus Aurelius",
      id: "004122",
      region: "Rome, IT",
      pv: "27,400",
      growth: "-1.2%",
      trend: "down",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmlt0vq5Deq6Jg7lr1Rt0p7H9AGZq8pAe0scTxkTkPmxNp4Rt4YHh8eM6VmaWZpq3s1D8qRjuOk2xsgMNIjJq83y6-tEP12gJw7xPp8FAo_cBBSQM5b83_O1IpwEbH7uR503ZfaNtAoJ7p2mNivLLQ8cmEe4wjaJekyi39SZAU36umPCBg_tjbeZ1gJptslCc9AZdvEoErEQHtmjlRspvmLrqT-qByhoYxWQFsCwWbXteCtBH_kapXBNiB5KjhSzEHt035ya1qfEU"
    },
    {
      rank: 8,
      name: "Kevin Peterson",
      id: "554301",
      region: "Toronto, CA",
      pv: "26,900",
      growth: "+21.0%",
      trend: "up",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbUpNv3D4MI1HqzmLnP_AnJ297wcT_CScJCvQEm2ku7tF6oXqySLlscQp63pUrUwGHLMjXzeTcBb52kN60eqlwA7vtnxXg7V3OsW4tG9068lYGvF-Oq0kuRN5PPhAatMvTIHvijuySXxBtWl_qXhBUDTOwsy6gqP7_aIFHkPd-6v8PmTi5u7aQvYu9xWTUcTe0MwzGDD3n4aSLkQb_3IDUqvsCFBQWjkCqBqg3rFPOnzux3kiFHOxkv4BSEX69rpwk3B7Twk8kgw4"
    }
  ];

  const timePeriods = ["Monthly", "Weekly", "All-time"];
  const regions = ["Global Ranking", "North America", "Europe", "Asia Pacific", "Latin America"];

  return (
    <div className="flex min-h-screen bg-slate-50 font-display">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header toggleSidebar={() => setIsSidebarOpen(true)} />

        <div className="p-8 space-y-6">
          {/* Page Title & Time Period Filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Distributor Leaderboard
              </h1>
              <p className="text-slate-500">
                Real-time performance rankings based on Personal Volume (PV).
              </p>
            </div>
            <div className="flex items-center bg-slate-100 p-1 rounded-lg gap-1">
              {timePeriods.map((period) => (
                <button
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  className={`px-6 py-2 text-sm font-semibold rounded-md transition-all ${timePeriod === period
                    ? "bg-white shadow-sm text-primary"
                    : "text-slate-500 hover:text-primary"
                    }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Region Tabs */}
          <div className="flex border-b border-slate-200 overflow-x-auto">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setRegion(reg)}
                className={`px-6 py-3 border-b-2 text-sm font-semibold whitespace-nowrap transition-colors ${region === reg
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-primary"
                  }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* 2nd Place - Silver */}
            <div className="order-2 md:order-1">
              <PodiumCard
                rank={2}
                name="Sarah Jenkins"
                pv="42,850"
                change="+8.2%"
                rankTitle="Silver Rank"
                imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCYUM0k6CqKzTLUMK3dzCNB6T_Sm851RhnEJG4ECLrJpbXD4WHMpDo0h-deZgrTKbYxlIlRWwzR9T4wzmFueOPPBgFBt_O-XJVr8RHmC46b8ihDFFSMW8cqdsdlJkALf-NwdmK4ykSL_qpvGN8zKXu2pSluo5rodccYLRWOXQXuWq37XDmeJqKGNxAQVMQGG_y7RHnCkmDm1Nd_-ybTpSh9kDzQM8dsqEIPM-8bOQhG2LtJ9FkP6OpiFSNTvIieAP35zA9vYKqllMI"
              />
            </div>

            {/* 1st Place - Champion */}
            <div className="order-1 md:order-2">
              <PodiumCard
                rank={1}
                name="Michael Chen"
                pv="58,500"
                change="+14.5%"
                rankTitle="Gold Diamond"
                imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCnOcDAzXbndb7IKNVsh8QAY8jJB8_wWeMvbAbIZxj7UKx-cp1TB62wYyxTLWsPcUpD7yyRI4S0xzw9YB26wATLYBcGUkt3rWOD2N2dC7krel0Gv82ZjyB2eoiuMIXEOA0IQ1OtwGbjEMn8g-T73xiRtNXdDjC2X6aep8IY-4UWtCh7wHuYdhpZ_AzWodj-d0ea3RaTm8bB_59YVOsBK52blVlnK5ekn6yRmCwKXxpCVQoxydPajcB-M68bx4b6wGAOuQ2QVBmxq3A"
                isChampion
              />
            </div>

            {/* 3rd Place - Bronze */}
            <div className="order-3 md:order-3">
              <PodiumCard
                rank={3}
                name="David Rodriguez"
                pv="39,200"
                change="+5.1%"
                rankTitle="Bronze Elite"
                imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuAIAzBK98IfcAeMI2Ay_5bbu4IRyqoRFXxOnt1AMOQJkXQ-9-oMMo1xyRF6lufk8SK6vOWphcIwwP4D6ASPsC6-VvwMXztTCP1x28uL084F7RpNwShB_scRXWOz-FI5Yc1ObkxrBbfNwGkLWv_XjdJi5ACvpKh3tpgjsQPXqLK_S50dJyxOkOh9-E3IvbwCHjx525puk62qByNGEntdCP-zzWC3v6JAlHdMAOtyMaZKro-n2CfcjIz2_NcsPuAPITqI7igDRCX-QAY"
              />
            </div>
          </div>

          {/* Top 100 Distributors Table */}
          <RankingTable rankings={tableData} />
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
