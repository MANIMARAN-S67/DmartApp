import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const TopNav = ({ title, showBack = true, children }) => {
    const navigate = useNavigate();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 py-3 border-b border-slate-100 max-w-[480px] mx-auto">
            <div className="flex items-center gap-3">
                {showBack && (
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-slate-700" />
                    </button>
                )}
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h1>
            </div>
            <div className="flex items-center">
                {children}
            </div>
        </header>
    );
};

export default TopNav;
