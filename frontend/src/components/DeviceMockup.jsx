import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';

const DeviceMockup = ({ children }) => {
    const [device, setDevice] = useState('iphone'); // 'iphone' | 'android' | 'none'
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth > 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!isDesktop) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 sm:p-8 relative">
            {/* Controls */}
            <div className="absolute top-4 sm:top-8 right-4 sm:right-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-2 z-[9999]">
                <button 
                    onClick={() => setDevice('iphone')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${device === 'iphone' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <Smartphone className="w-4 h-4" /> iPhone
                </button>
                <button 
                    onClick={() => setDevice('android')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${device === 'android' ? 'bg-green-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <Smartphone className="w-4 h-4" /> Android
                </button>
                <button 
                    onClick={() => setDevice('none')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${device === 'none' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <Monitor className="w-4 h-4" /> Web
                </button>
            </div>

            {/* Mockup Frame */}
            {device === 'none' ? (
                <div className="w-full max-w-[480px] bg-white min-h-[100dvh] shadow-2xl relative overflow-hidden border-x border-slate-200 mx-auto">
                    {children}
                </div>
            ) : (
                <div className={`relative transition-all duration-500 mx-auto ${
                    device === 'iphone' 
                    ? 'w-[400px] h-[830px] rounded-[55px] border-[14px] border-slate-900 bg-slate-900 shadow-2xl shadow-slate-900/50' 
                    : 'w-[400px] h-[830px] rounded-[40px] border-[10px] border-slate-800 bg-black shadow-2xl shadow-green-900/20'
                }`}>
                    
                    {/* iPhone Physical Buttons */}
                    {device === 'iphone' && (
                        <>
                            {/* Silence switch */}
                            <div className="absolute left-[-17px] top-[110px] w-[3px] h-[28px] bg-slate-700 rounded-l-sm border-r border-slate-800"></div>
                            {/* Volume Up */}
                            <div className="absolute left-[-17px] top-[160px] w-[3px] h-[55px] bg-slate-700 rounded-l-md border-r border-slate-800"></div>
                            {/* Volume Down */}
                            <div className="absolute left-[-17px] top-[230px] w-[3px] h-[55px] bg-slate-700 rounded-l-md border-r border-slate-800"></div>
                            {/* Power Button */}
                            <div className="absolute right-[-17px] top-[180px] w-[3px] h-[80px] bg-slate-700 rounded-r-md border-l border-slate-800"></div>
                        </>
                    )}

                    {/* Device Notch/Camera */}
                    {device === 'iphone' && (
                        <div className="absolute top-0 inset-x-0 flex justify-center z-[100] pointer-events-none">
                            <div className="w-[150px] h-[30px] bg-slate-900 rounded-b-[20px] flex items-center justify-center gap-3 px-3 relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-transparent before:-left-4 before:top-0 before:rounded-tr-xl before:shadow-[5px_0_0_0_#0f172a] after:content-[''] after:absolute after:w-4 after:h-4 after:bg-transparent after:-right-4 after:top-0 after:rounded-tl-xl after:shadow-[-5px_0_0_0_#0f172a]">
                                {/* Speaker slit */}
                                <div className="w-12 h-[5px] bg-slate-800 rounded-full border border-slate-950"></div>
                                {/* Camera lens */}
                                <div className="w-3.5 h-3.5 bg-slate-800 rounded-full border-2 border-slate-950 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-blue-900/30 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    {device === 'android' && (
                        <div className="absolute top-2 inset-x-0 h-6 flex justify-center z-[100] pointer-events-none">
                            <div className="w-4 h-4 bg-slate-900 rounded-full border border-slate-800"></div>
                        </div>
                    )}

                    <div className={`w-full h-full bg-white overflow-hidden relative flex flex-col ${device === 'android' ? 'rounded-[30px]' : 'rounded-[40px]'}`} style={{ transform: 'translateZ(0)' }}>
                        
                        {/* Status Bar */}
                        {device === 'iphone' && (
                            <div className="w-full h-12 flex items-center justify-between px-7 pt-2 shrink-0 bg-transparent text-slate-900 z-50 pointer-events-none">
                                <span className="text-[14px] font-bold tracking-tight pl-1">9:41</span>
                                <div className="flex items-center gap-2 pr-1">
                                    <Signal className="w-4 h-4" />
                                    <Wifi className="w-4 h-4" />
                                    <Battery className="w-[22px] h-[22px]" />
                                </div>
                            </div>
                        )}

                        <div className={`w-full h-full overflow-y-auto hide-scrollbar relative bg-slate-50 ${device === 'iphone' ? '-mt-12' : ''}`}>
                            {device === 'iphone' && <div className="w-full h-12 shrink-0"></div> /* Spacer for status bar content offset */}
                            {children}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeviceMockup;
