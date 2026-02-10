import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const CommunicationCenter = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      icon: "payments",
      iconBg: "bg-green-50",
      iconColor: "text-success",
      title: "Commission Received",
      description: "$50.00 USD from Level 2 referral has been added to your wallet.",
      time: "Just now",
      unread: true
    },
    {
      id: 2,
      icon: "person_add",
      iconBg: "bg-blue-50",
      iconColor: "text-primary",
      title: "New Direct Referral",
      description: "Welcome Sarah Jenkins to your network. Send a welcome message!",
      time: "15 mins ago",
      unread: true
    },
    {
      id: 3,
      icon: "local_shipping",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      title: "Order Shipped",
      description: "Your physical marketing kit (Order #MLM-928) is on its way.",
      time: "2 hours ago",
      unread: true
    },
    {
      id: 4,
      icon: "security",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-500",
      title: "Password Changed Successfully",
      description: "Your security profile was updated yesterday.",
      time: "Yesterday at 4:30 PM",
      unread: false
    },
    {
      id: 5,
      icon: "verified",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-500",
      title: "KYC Verified",
      description: "Your identity verification has been approved by our compliance team.",
      time: "2 days ago",
      unread: false
    }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-display">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header toggleSidebar={() => setIsSidebarOpen(true)} />

        <div className="flex-1 flex overflow-hidden">
          {/* Left Pane: Activity Feed */}
          <section className="w-full lg:w-5/12 border-r border-slate-200 bg-white flex flex-col">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-slate-900">Activity Feed</h3>
                <span className="bg-primary/10 text-primary text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">
                  12 New
                </span>
              </div>
              <div className="flex border-b border-slate-200 gap-6">
                {["All", "Unread", "Earnings"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-semibold transition-colors ${activeTab === tab
                      ? "border-b-2 border-primary text-primary"
                      : "text-slate-500 hover:text-slate-700"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-xl border shadow-sm cursor-pointer hover:border-primary/30 transition-all ${notif.unread
                    ? "bg-white border-slate-100"
                    : "bg-white/60 border-slate-100 grayscale-[0.5] opacity-80"
                    }`}
                >
                  <div className="flex gap-4">
                    <div className={`size-10 rounded-lg ${notif.iconBg} flex items-center justify-center ${notif.iconColor} shrink-0`}>
                      <span className="material-symbols-outlined">{notif.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-bold text-slate-900">{notif.title}</p>
                        {notif.unread && <div className="size-2 bg-primary rounded-full"></div>}
                      </div>
                      <p className="text-sm text-slate-600 mt-0.5">{notif.description}</p>
                      <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 uppercase tracking-tight">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {notif.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Right Pane: Company Announcements */}
          <section className="flex-1 bg-slate-50 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-8">
              <div className="mb-8">
                <h3 className="font-bold text-3xl text-slate-900 tracking-tight">
                  Company Announcements
                </h3>
                <p className="text-slate-500 mt-1">
                  Stay informed with the latest news and updates from headquarters.
                </p>
              </div>

              <div className="space-y-8">
                {/* Featured Announcement */}
                <article className="group rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all">
                  <div className="aspect-video relative overflow-hidden bg-black">
                    <img
                      alt="Convention Stage"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcKwEp-JzfC5eoU-KM62_PZkMQPfCLlstLlp1GtPUFO7VpfRSB5NZ6x1vBw05MMkvNWSelrZ6-CSJY_RpQ5s5YOzWkA8TmqYbKeOh7ODaOzHkHP4VpxawgY9GatzNfUja7p3Yt6Kk59QJmhdwQG-_edC4tjXFCqw3i4vYdOdBZnSIFU4D9lkKjcVIMZtTmhqa-2h4sx8hFl44NeO3KKiQItAeoWK33CW9cw6r4IZ-LxgYFWIlIGcXgCvAbIGqDNPXshnumEEoSJAM"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-white text-[10px] uppercase font-black px-3 py-1 rounded-full">
                        Global Event
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        Oct 24, 2024
                      </span>
                      <span className="size-1 bg-slate-200 rounded-full"></span>
                      <span className="text-xs font-semibold text-primary">Limited Tickets</span>
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-3">
                      Global Convention 2024: The Future of Fintech
                    </h4>
                    <p className="text-slate-600 leading-relaxed mb-6">
                      Join thousands of top distributors in Dubai for our biggest annual event yet. Featuring keynote speakers from the top 1% of the industry, exclusive product reveals, and networking opportunities that will transform your business.
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                      <div className="flex -space-x-2">
                        <img
                          alt="Attendee 1"
                          className="size-8 rounded-full border-2 border-white object-cover"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmc3NqomMtX46DhBCo3QCEzPcb7ARCqZJKp7xxqIVCsb_yOyPCGutDKCfj36Rulug7MBomMmXnKdLyllzPIiuPUPOQM4I7ueTGf6ziV3mgqNwaOdAKEr5aUiJ2JLG66XtMGj_yS_ahzKrb_oBUc_H5r2oyQHBBamy3-C1cgx09zM6yoQKImbI8JF8FXc3mMHuUDYYyijivqgVwDBsmdn132BXTHLwaco2Q6g4D80UhHdkhZf47uybm2hGfoYdWVUPOD8oos523ttQ"
                        />
                        <img
                          alt="Attendee 2"
                          className="size-8 rounded-full border-2 border-white object-cover"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGHgiAffcS3DXYdHdaxvzoHFeLUqNYpNkQ4eBUN-RbGELMc79mTGFCjvM5t6CjJvbuL_tpeiSW0uwDcU6MRIkEwZ-RSGINZ6G9vvkbAKIafESg7m8cSIwlLRTBq1_eqtPh7t8q0KVBwE7fnwqguulrIxqJt2zhVEveVeFLQBZkraOJG2dADHI8ND_EERALZuaq12kSfpsTSeNglPl3EvviyfrgKCPgATgA1oYh9QMUhV7tAAThE2Qcypzo0GKk7cE7_cwqrVE3MJM"
                        />
                        <div className="size-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                          +1.2k
                        </div>
                      </div>
                      <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all">
                        Register Now
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </article>

                {/* Secondary Announcements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Launch Card */}
                  <article className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-primary/20 transition-all flex flex-col">
                    <div className="mb-4">
                      <span className="bg-success/10 text-success text-[10px] uppercase font-bold px-2 py-0.5 rounded-md">
                        Product Launch
                      </span>
                    </div>
                    <h5 className="text-lg font-bold mb-2">New: Crypto Yield Portfolios</h5>
                    <p className="text-sm text-slate-500 mb-6 flex-1 line-clamp-2">
                      We are excited to announce three new diversified portfolio options for your clients, featuring optimized risk management tools.
                    </p>
                    <button className="text-primary text-sm font-bold flex items-center gap-1 group">
                      Read Full Update
                      <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                        chevron_right
                      </span>
                    </button>
                  </article>

                  {/* Training Card */}
                  <article className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-primary/20 transition-all flex flex-col">
                    <div className="mb-4">
                      <span className="bg-primary/10 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-md">
                        Training
                      </span>
                    </div>
                    <h5 className="text-lg font-bold mb-2">Quarterly Leadership Webinar</h5>
                    <p className="text-sm text-slate-500 mb-6 flex-1 line-clamp-2">
                      Save the date for our intensive leadership training session with Founder and CEO Marcus Thorne on Oct 30th.
                    </p>
                    <button className="text-primary text-sm font-bold flex items-center gap-1 group">
                      Add to Calendar
                      <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                        chevron_right
                      </span>
                    </button>
                  </article>
                </div>

                {/* Support Banner */}
                <div className="bg-primary/5 rounded-2xl p-6 flex items-center gap-6 border border-primary/10">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary">support_agent</span>
                  </div>
                  <div className="flex-1">
                    <h6 className="font-bold text-slate-900">Need help?</h6>
                    <p className="text-sm text-slate-500">
                      Our support team is available 24/7 for all account and technical inquiries.
                    </p>
                  </div>
                  <button className="bg-white border border-slate-200 px-5 py-2 rounded-lg text-sm font-bold whitespace-nowrap hover:bg-slate-50 transition-colors">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default CommunicationCenter;
