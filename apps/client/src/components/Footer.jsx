import React from "react";

const Footer = () => {
  return (
    <footer className="mt-auto px-4 md:px-10 lg:px-40 py-10 border-t border-slate-200 dark:border-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="size-4 text-primary">
            <svg
              fill="currentColor"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"></path>
            </svg>
          </div>
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
            Fintech MLM © 2024
          </span>
        </div>
        <div className="flex gap-8">
          <a
            className="text-slate-400 hover:text-primary text-xs font-medium"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="text-slate-400 hover:text-primary text-xs font-medium"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-slate-400 hover:text-primary text-xs font-medium"
            href="#"
          >
            Help Center
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
