import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState({});

  const navigationGroups = [
    {
      title: "Overview",
      items: [
        { icon: "dashboard", label: "Dashboard", path: "/dashboard" },
        {
          icon: "notifications",
          label: "Notifications",
          path: "/notifications",
        },
      ],
    },
    {
      title: "Store",
      items: [
        { icon: "storefront", label: "Products", path: "/products" },
        { icon: "shopping_bag", label: "Orders", path: "/orders" },
      ],
    },
    {
      title: "Network",
      items: [
        {
          icon: "share",
          label: "Network",
          isParent: true,
          subItems: [
            {
              icon: "person",
              label: "Direct Referrals",
              path: "/network/direct-referrals",
            },
            {
              icon: "groups",
              label: "My Team",
              path: "/network/tree",
            },
          ],
        },
      ],
    },
    {
      title: "Finance",
      items: [
        { icon: "account_balance_wallet", label: "Wallet", path: "/wallet" },
        { icon: "payments", label: "Withdrawals", path: "/withdrawals" },
      ],
    },
    {
      title: "System",
      items: [
        { icon: "person", label: "Profile", path: "/profile" },
        { icon: "settings", label: "Setting", path: "/settings" },
        { icon: "help_center", label: "Help Center", path: "/support" },
      ],
    },
  ];

  const isActive = (path) => {
    if (path === "/network/tree") {
      return (
        location.pathname === "/network/tree" ||
        location.pathname === "/network/my-team"
      );
    }
    return location.pathname === path;
  };

  // Track active submenus based on current path
  useEffect(() => {
    const newExpanded = { ...expandedGroups };
    navigationGroups.forEach((group) => {
      group.items.forEach((item) => {
        if (item.subItems) {
          const isSubActive = item.subItems.some((sub) => {
            if (sub.path === "/network/tree") {
              return (
                location.pathname === "/network/tree" ||
                location.pathname === "/network/my-team"
              );
            }
            return location.pathname.startsWith(sub.path);
          });
          if (isSubActive) {
            newExpanded[item.label] = true;
          }
        }
      });
    });
    setExpandedGroups(newExpanded);
  }, [location.pathname]);

  const toggleGroup = (label) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      ></div>

      {/* Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transform transition-transform duration-300 flex flex-col h-screen ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo & Close Button */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
              F
            </div>
            <div>
              <div className="font-bold text-lg dark:text-white">FinMLM</div>
              <div className="text-xs text-slate-500">DISTRIBUTOR</div>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden text-slate-500"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar pb-6">
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              <h3 className="px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item, itemIdx) => (
                  <div key={itemIdx}>
                    {item.isParent ? (
                      <div>
                        <button
                          onClick={() => toggleGroup(item.label)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all group ${expandedGroups[item.label]
                            ? "text-primary bg-primary/5"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                        >
                          <span
                            className={`material-symbols-outlined text-xl transition-colors ${expandedGroups[item.label] ? "text-primary" : "text-slate-400 group-hover:text-slate-600"}`}
                          >
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                          <span
                            className={`material-symbols-outlined ml-auto text-lg transition-transform duration-300 ${expandedGroups[item.label] ? "rotate-180" : ""}`}
                          >
                            expand_more
                          </span>
                        </button>

                        <div
                          className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ${expandedGroups[item.label] ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                        >
                          {item.subItems.map((subItem, subIdx) => (
                            <Link
                              key={subIdx}
                              to={subItem.path}
                              onClick={() => {
                                if (window.innerWidth < 1024) onClose();
                              }}
                              className={`w-full flex items-center gap-3 pl-11 pr-4 py-2 rounded-lg text-xs font-semibold transition-all ${isActive(subItem.path)
                                ? "text-primary bg-primary/10"
                                : "text-slate-500 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                                }`}
                            >
                              <span>{subItem.label}</span>
                              {isActive(subItem.path) && (
                                <div className="ml-auto w-1 h-1 rounded-full bg-primary"></div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={() => {
                          if (window.innerWidth < 1024) onClose();
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all group ${isActive(item.path)
                          ? "bg-primary/10 text-primary"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                      >
                        <span
                          className={`material-symbols-outlined text-xl transition-colors ${isActive(item.path) ? "text-primary" : "text-slate-400 group-hover:text-slate-600"}`}
                        >
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                        {isActive(item.path) && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"></div>
                        )}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Invite Button */}
        {user?.account_activation_status === 'ACTIVATED' ? (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/network/my-team"
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-lg">
                person_add
              </span>
              <span className="text-sm">Invite Member</span>
            </Link>
          </div>
        ) : (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-[10px] text-amber-700 font-bold uppercase leading-tight">Activation Required</p>
              <p className="text-xs text-amber-600 mt-1">Activate your account to start referring members.</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
