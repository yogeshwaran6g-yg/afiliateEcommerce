import React, { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success', duration = 3000, onClose }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for exit animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColor = type === 'success' ? 'bg-emerald-500' : 'bg-rose-500';
    const icon = type === 'success' ? 'check_circle' : 'error';

    return (
        <div className={`fixed bottom-8 right-8 z-100 transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className={`${bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px]`}>
                <span className="material-symbols-outlined">{icon}</span>
                <p className="font-bold text-sm">{message}</p>
                <button onClick={() => setIsVisible(false)} className="ml-auto hover:opacity-70 transition-opacity">
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>
            </div>
        </div>
    );
}
