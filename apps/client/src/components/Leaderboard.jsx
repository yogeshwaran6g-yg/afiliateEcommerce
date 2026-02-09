import React from "react";
import { useLocation } from "react-router-dom";
import NavHeader from "./NavHeader";
import PodiumCard from "./PodiumCard";
import RankingTable from "./RankingTable";
import Footer from "./Footer";

const Leaderboard = () => {
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
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbUpNv3D4MI1HqzmLnP_AnJ297wcT_CScJCvQEm2ku7tF6oXqySLlscQp63pUrUwGHLMjXzeTcBb52kN60eqlwA7vtnxXg7V3OsW4tG9068lYGvF-Oq0kuRN5PPhAatMvTIhvijuySXxBtWl_qXhBUDTOwsy6gqP7_aIFHkPd-6v8PmTi5u7aQvYu9xWTUcTe0MwzGDD3n4aSLkQb_3IDUqvsCFBQWjkCqBqg3rFPOnzux3kiFHOxkv4BSEX69rpwk3B7Twk8kgw4"
    }
  ];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden font-display text-slate-900 dark:text-slate-100">
      <div className="layout-container flex h-full grow flex-col">
        <NavHeader />
        
        <main className="flex flex-1 flex-col px-4 md:px-10 lg:px-40 py-8">
          {/* Page Title & Primary Filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <h1 className="text-slate-900 dark:text-white text-4xl font-black tracking-tight mb-2">
                Distributor Leaderboard
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base">
                Real-time performance rankings based on Personal Volume (PV).
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button className="px-6 py-1.5 text-sm font-semibold rounded-md bg-white dark:bg-slate-700 shadow-sm text-primary dark:text-white">
                  Monthly
                </button>
                <button className="px-6 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                  Weekly
                </button>
                <button className="px-6 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                  All-time
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Filter Bar (Global/Regional) */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 mb-10 overflow-x-auto whitespace-nowrap">
            {["Global Ranking", "North America", "Europe", "Asia Pacific", "Latin America"].map((region, idx) => (
              <button
                key={region}
                className={`px-6 py-3 border-b-2 text-sm transition-colors ${idx === 0 ? "border-primary text-primary font-bold" : "border-transparent text-slate-500 dark:text-slate-400 font-medium hover:text-primary"}`}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Top 3 Podium Spotlight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 items-end">
            <div className="order-2 md:order-1 h-[280px]">
              <PodiumCard
                rank={2}
                name="Sarah Jenkins"
                pv="42,850"
                change="+8.2%"
                rankTitle="Silver Rank"
                imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCYUM0k6CqKzTLUMK3dzCNB6T_Sm851RhnEJG4ECLrJpbXD4WHMpDo0h-deZgrTKbYxlIlRWwzR9T4wzmFueOPPBgFBt_O-XJVr8RHmC46b8ihDFFSMW8cqdsdlJkALf-NwdmK4ykSL_qpvGN8zKXu2pSluo5rodccYLRWOXQXuWq37XDmeJqKGNxAQVMQGG_y7RHnCkmDm1Nd_-ybTpSh9kDzQM8dsqEIPM-8bOQhG2LtJ9FkP6OpiFSNTvIieAP35zA9vYKqllMI"
              />
            </div>
            <div className="order-1 md:order-2 h-[340px]">
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
            <div className="order-3 md:order-3 h-[280px]">
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

          <RankingTable rankings={tableData} />
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Leaderboard;
