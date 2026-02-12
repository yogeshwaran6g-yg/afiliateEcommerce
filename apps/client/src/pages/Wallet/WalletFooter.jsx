import React from 'react';

export default function WalletFooter() {
    return (
        <footer className="bg-white border-t border-slate-200 mt-auto py-6">
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-slate-500">
                <div className="text-center md:text-left">© 2024 Fintech MLM Dashboard. All rights reserved.</div>
                <div className="flex items-center gap-4 md:gap-6">
                    <a href="#" className="hover:text-primary">Privacy Policy</a>
                    <a href="#" className="hover:text-primary">Terms of Service</a>
                    <a href="#" className="hover:text-primary">Help Center</a>
                </div>
            </div>
        </footer>
    );
}
