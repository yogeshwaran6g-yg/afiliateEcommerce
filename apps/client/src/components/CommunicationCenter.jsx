import React from "react";
import { Link, useLocation } from "react-router-dom";

const CommunicationCenter = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex w-full font-display">
      {/* Left Navigation Bar (SideNavBar Component modified) */}
      <aside
        className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col h-screen sticky top-0"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div
              className="size-10 bg-primary rounded-lg flex items-center justify-center text-white"
            >
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <div className="flex flex-col">
              <h1
                className="text-slate-900 dark:text-white text-base font-bold leading-none"
              >
                Distributor Pro
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                ID: 9928341
              </p>
            </div>
          </div>
          <nav className="space-y-1">
            <Link
              className={`${isActive("/dashboard") ? "bg-primary/10 text-primary" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"} flex items-center gap-3 px-3 py-2 rounded-lg transition-colors`}
              to="/dashboard"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <Link
              className={`${isActive("/wallet") ? "bg-primary/10 text-primary" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"} flex items-center gap-3 px-3 py-2 rounded-lg transition-colors`}
              to="/wallet"
            >
              <span className="material-symbols-outlined">account_balance_wallet</span>
              <span className="text-sm font-medium">Wallet</span>
            </Link>
            <Link
              className={`${isActive("/network") ? "bg-primary/10 text-primary" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"} flex items-center gap-3 px-3 py-2 rounded-lg transition-colors`}
              to="/network"
            >
              <span className="material-symbols-outlined">group</span>
              <span className="text-sm font-medium">Network</span>
            </Link>
            <Link
              className={`${isActive("/notifications") ? "bg-primary/10 text-primary font-semibold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"} flex items-center gap-3 px-3 py-2 rounded-lg`}
              to="/notifications"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >notifications</span>
              <span className="text-sm">Notifications</span>
            </Link>
            <Link
              className={`${isActive("/announcements") ? "bg-primary/10 text-primary" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"} flex items-center gap-3 px-3 py-2 rounded-lg transition-colors`}
              to="/announcements"
            >
              <span className="material-symbols-outlined">campaign</span>
              <span className="text-sm font-medium">Announcements</span>
            </Link>
            <Link
              className={`${isActive("/settings") ? "bg-primary/10 text-primary" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"} flex items-center gap-3 px-3 py-2 rounded-lg transition-colors`}
              to="/settings"
            >
              <span className="material-symbols-outlined">settings</span>
              <span className="text-sm font-medium">Settings</span>
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden"
            >
              <img
                alt="User Profile"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLhoVFgqycJ3pe-Efn-BFvaDeMoB4ZK9pEYe7m9wrizdbGHwPdQL49Os8BwQfBmCBo0f2rguJ8w-iAi7-2fwPEzBXvXU7VmkwofUzHiiDJ75Wh64h7oeceZRZbN-SahpLrUk6N2DU7-r2CfWdu5kDszyQxdXEgIJx1T5Kjp_X_8M6YiasBkmZ2YHt2TzSncmt6RQV4SyenI3Cj80zpTf2H4h17J-F6wcAItr2nbmKWuZ-4A8-j54TAkCNiyJCAp-l3YyT7l3wU12A"
              />
            </div>
            <div>
              <p className="text-sm font-semibold">Alex Johnson</p>
              <p className="text-xs text-slate-500">Platinum Tier</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Bar */}
        <header
          className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 flex items-center justify-between shrink-0"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Communication Center
          </h2>
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 text-sm font-semibold text-primary hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-base">done_all</span>
              Mark all as read
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
            <div className="relative">
              <span
                className="material-symbols-outlined text-slate-500 dark:text-slate-400 cursor-pointer"
              >search</span>
            </div>
          </div>
        </header>

        {/* Split Pane Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Pane: Notifications */}
          <section
            className="w-full lg:w-5/12 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex flex-col h-full"
          >
            <div className="p-6 pb-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Activity Feed</h3>
                <span
                  className="bg-primary/10 text-primary text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full"
                >12 New</span>
              </div>
              <div
                className="flex border-b border-slate-200 dark:border-slate-800 gap-6 mb-4"
              >
                <button
                  className="border-b-2 border-primary text-primary pb-3 text-sm font-bold"
                >
                  All
                </button>
                <button
                  className="border-b-2 border-transparent text-slate-500 pb-3 text-sm font-medium hover:text-slate-700"
                >
                  Unread
                </button>
                <button
                  className="border-b-2 border-transparent text-slate-500 pb-3 text-sm font-medium hover:text-slate-700"
                >
                  Earnings
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-3">
              {/* Notification Card 1 */}
              <div
                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm relative group cursor-pointer hover:border-primary/30 transition-all"
              >
                <div className="flex gap-4">
                  <div
                    className="size-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-success shrink-0"
                  >
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Commission Received
                      </p>
                      <div className="size-2 bg-primary rounded-full"></div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                      $50.00 USD from Level 2 referral has been added to your
                      wallet.
                    </p>
                    <p
                      className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 uppercase tracking-tight"
                    >
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      Just now
                    </p>
                  </div>
                </div>
              </div>

              {/* Notification Card 2 */}
              <div
                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm relative group cursor-pointer hover:border-primary/30 transition-all"
              >
                <div className="flex gap-4">
                  <div
                    className="size-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary shrink-0"
                  >
                    <span className="material-symbols-outlined">person_add</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        New Direct Referral
                      </p>
                      <div className="size-2 bg-primary rounded-full"></div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                      Welcome <span className="font-semibold">Sarah Jenkins</span> to
                      your network. Send a welcome message!
                    </p>
                    <p
                      className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 uppercase tracking-tight"
                    >
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      15 mins ago
                    </p>
                  </div>
                </div>
              </div>

              {/* Notification Card 3 */}
              <div
                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm relative group cursor-pointer hover:border-primary/30 transition-all"
              >
                <div className="flex gap-4">
                  <div
                    className="size-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 shrink-0"
                  >
                    <span className="material-symbols-outlined">local_shipping</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Order Shipped
                      </p>
                      <div className="size-2 bg-primary rounded-full"></div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                      Your physical marketing kit (Order #MLM-928) is on its way.
                    </p>
                    <p
                      className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 uppercase tracking-tight"
                    >
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      2 hours ago
                    </p>
                  </div>
                </div>
              </div>

              {/* Notification Card 4 (Read State) */}
              <div
                className="bg-white/60 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm relative group cursor-pointer grayscale-[0.5] opacity-80"
              >
                <div className="flex gap-4">
                  <div
                    className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0"
                  >
                    <span className="material-symbols-outlined">security</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Password Changed Successfully
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                      Your security profile was updated yesterday.
                    </p>
                    <p
                      className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 uppercase tracking-tight"
                    >
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      Yesterday at 4:30 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Notification Card 5 (Read State) */}
              <div
                className="bg-white/60 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm relative group cursor-pointer grayscale-[0.5] opacity-80"
              >
                <div className="flex gap-4">
                  <div
                    className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0"
                  >
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        KYC Verified
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                      Your identity verification has been approved by our
                      compliance team.
                    </p>
                    <p
                      className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 uppercase tracking-tight"
                    >
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      2 days ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Right Pane: Announcements */}
          <section
            className="flex-1 bg-white dark:bg-slate-900 h-full overflow-y-auto"
          >
            <div className="max-w-4xl mx-auto p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3
                    className="font-black text-3xl text-slate-900 dark:text-white tracking-tight"
                  >
                    Company Announcements
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Stay informed with the latest news and updates from
                    headquarters.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-8">
                {/* Featured Announcement 1 */}
                <article
                  className="group rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      alt="Convention Stage"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcKwEp-JzfC5eoU-KM62_PZkMQPfCLlstLlp1GtPUFO7VpfRSB5NZ6x1vBw05MMkvNWSelrZ6-CSJY_RpQ5s5YOzWkA8TmqYbKeOh7ODaOzHkHP4VpxawgY9GatzNfUja7p3Yt6Kk59QJmhdwQG-_edC4tjXFCqw3i4vYdOdBZnSIFU4D9lkKjcVIMZtTmhqa-2h4sx8hFl44NeO3KKiQItAeoWK33CW9cw6r4IZ-LxgYFWIlIGcXgCvAbIGqDNPXshnumEEoSJAM"
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className="bg-primary text-white text-[10px] uppercase font-black px-3 py-1 rounded-full"
                      >Global Event</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="text-xs font-semibold text-slate-400 uppercase tracking-widest"
                      >Oct 24, 2024</span>
                      <span className="size-1 bg-slate-200 rounded-full"></span>
                      <span className="text-xs font-semibold text-primary"
                      >Limited Tickets</span>
                    </div>
                    <h4
                      className="text-2xl font-bold text-slate-900 dark:text-white mb-3"
                    >
                      Global Convention 2024: The Future of Fintech
                    </h4>
                    <p
                      className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6"
                    >
                      Join thousands of top distributors in Dubai for our biggest
                      annual event yet. Featuring keynote speakers from the top 1%
                      of the industry, exclusive product reveals, and networking
                      opportunities that will transform your business.
                    </p>
                    <div
                      className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800"
                    >
                      <div className="flex -space-x-2">
                        <img
                          alt="Attendee 1"
                          className="size-8 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmc3NqomMtX46DhBCo3QCEzPcb7ARCqZJKp7xxqIVCsb_yOyPCGutDKCfj36Rulug7MBomMmXnKdLyllzPIiuPUPOQM4I7ueTGf6ziV3mgqNwaOdAKEr5aUiJ2JLG66XtMGj_yS_ahzKrb_oBUc_H5r2oyQHBBamy3-C1cgx09zM6yoQKImbI8JF8FXc3mMHuUDYYyijivqgVwDBsmdn132BXTHLwaco2Q6g4D80UhHdkhZf47uybm2hGfoYdWVUPOD8oos523ttQ"
                        />
                        <img
                          alt="Attendee 2"
                          className="size-8 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGHgiAffcS3DXYdHdaxvzoHFeLUqNYpNkQ4eBUN-RbGELMc79mTGFCjvM5t6CjJvbuL_tpeiSW0uwDcU6MRIkEwZ-RSGINZ6G9vvkbAKIafESg7m8cSIwlLRTBq1_eqtPh7t8q0KVBwE7fnwqguulrIxqJt2zhVEveVeFLQBZkraOJG2dADHI8ND_EERALZuaq12kSfpsTSeNglPl3EvviyfrgKCPgATgA1oYh9QMUhV7tAAThE2Qcypzo0GKk7cE7_cwqrVE3MJM"
                        />
                        <div
                          className="size-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold"
                        >
                          +1.2k
                        </div>
                      </div>
                      <button
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
                      >
                        Register Now
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </article>

                {/* Secondary Announcement Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 2 */}
                  <article
                    className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:border-primary/20 transition-all flex flex-col"
                  >
                    <div className="mb-4">
                      <span
                        className="bg-success/10 text-success text-[10px] uppercase font-bold px-2 py-0.5 rounded-md"
                      >Product Launch</span>
                    </div>
                    <h5 className="text-lg font-bold mb-2">
                      New: Crypto Yield Portfolios
                    </h5>
                    <p
                      className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1 line-clamp-2"
                    >
                      We are excited to announce three new diversified portfolio
                      options for your clients, featuring optimized risk
                      management tools.
                    </p>
                    <Link
                      className="text-primary text-sm font-bold flex items-center gap-1 group"
                      to="#"
                    >
                      Read Full Update
                      <span
                        className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform"
                      >chevron_right</span>
                    </Link>
                  </article>

                  {/* Card 3 */}
                  <article
                    className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:border-primary/20 transition-all flex flex-col"
                  >
                    <div className="mb-4">
                      <span
                        className="bg-primary/10 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-md"
                      >Training</span>
                    </div>
                    <h5 className="text-lg font-bold mb-2">
                      Quarterly Leadership Webinar
                    </h5>
                    <p
                      className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1 line-clamp-2"
                    >
                      Save the date for our intensive leadership training session
                      with Founder and CEO Marcus Thorne on Oct 30th.
                    </p>
                    <Link
                      className="text-primary text-sm font-bold flex items-center gap-1 group"
                      to="#"
                    >
                      Add to Calendar
                      <span
                        className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform"
                      >chevron_right</span>
                    </Link>
                  </article>
                </div>

                {/* Info Banner */}
                <div
                  className="bg-primary/5 rounded-2xl p-6 flex items-center gap-6 border border-primary/10"
                >
                  <div
                    className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
                  >
                    <span className="material-symbols-outlined text-primary">support_agent</span>
                  </div>
                  <div className="flex-1">
                    <h6 className="font-bold text-slate-900 dark:text-white">
                      Need help?
                    </h6>
                    <p className="text-sm text-slate-500">
                      Our support team is available 24/7 for all account and
                      technical inquiries.
                    </p>
                  </div>
                  <button
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-5 py-2 rounded-lg text-sm font-bold whitespace-nowrap"
                  >
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
