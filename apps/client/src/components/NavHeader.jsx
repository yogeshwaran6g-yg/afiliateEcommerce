import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavHeader = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-4 md:px-10 lg:px-40 py-3 bg-white dark:bg-slate-900 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-primary">
          <div className="size-6">
            <svg
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_6_535)">
                <path
                  clipRule="evenodd"
                  d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_6_535">
                  <rect fill="white" height="48" width="48"></rect>
                </clipPath>
              </defs>
            </svg>
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">
            Fintech MLM
          </h2>
        </div>
        <nav className="hidden md:flex items-center gap-9">
          <Link
            className={`${isActive("/dashboard") ? "text-primary dark:text-white font-bold border-b-2 border-primary pb-1" : "text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white text-sm font-medium transition-colors"}`}
            to="/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className={`${isActive("/inventory") ? "text-primary dark:text-white font-bold border-b-2 border-primary pb-1" : "text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white text-sm font-medium transition-colors"}`}
            to="/inventory"
          >
            Inventory
          </Link>
          <Link
            className={`${isActive("/leaderboard") ? "text-primary dark:text-white font-bold border-b-2 border-primary pb-1" : "text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white text-sm font-medium transition-colors"}`}
            to="/leaderboard"
          >
            Leaderboard
          </Link>
          <Link
            className={`${isActive("/teams") ? "text-primary dark:text-white font-bold border-b-2 border-primary pb-1" : "text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white text-sm font-medium transition-colors"}`}
            to="/teams"
          >
            Teams
          </Link>
        </nav>
      </div>
      <div className="flex flex-1 justify-end gap-4 items-center">
        <div className="flex gap-2">
          <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <span className="material-symbols-outlined text-[20px]">
              notifications
            </span>
          </button>
          <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <span className="material-symbols-outlined text-[20px]">
              settings
            </span>
          </button>
        </div>
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-white dark:border-slate-700 shadow-sm"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAjc_11CXEx2qSBKkmwtcevD0HxgnJwR3pN5mK9wZwNBc5aJZD1ZwNu3Vk8hLnQQHB-yCc-hpN09vG2lbHOpYDkiT0wv9nrnl9vbRDb1-EqbQ4lNyK3vSJA6OWN34C12UNaRZ4E62NwARsWCOqWRqnE2lGjAM3f4Gb_u_53YkXZumTrmPqbh636o5_lpHVeOp--i0A1L5otoGyBiA_Id2AxLfs0fNaE5xVPnUyhw9Z_ANxEkZ3-bFihbX9ztwFHH3ZvD0FjyWAHuss")',
          }}
        ></div>
      </div>
    </header>
  );
};

export default NavHeader;
