import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto py-8 border-t border-slate-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500 container mx-auto px-4 md:px-8">
                <div>© {currentYear} Affiliate Ecommerce. All rights reserved.</div>
                <div className="flex items-center gap-6">
                    <Link to="/privacy-terms" className="hover:text-primary transition-colors">
                        Privacy Policy
                    </Link>
                    <Link to="/privacy-terms" className="hover:text-primary transition-colors">
                        Terms & Conditions
                    </Link>
                    <a href="#" className="hover:text-primary transition-colors">
                        Help
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
