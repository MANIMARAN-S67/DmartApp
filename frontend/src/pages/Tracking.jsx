import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Phone, Shield, ShieldCheck, CheckCircle,
    Package, Truck, Home as HomeIcon, MessageSquare, Navigation
} from 'lucide-react';

const Tracking = () => {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [eta, setEta] = useState(25);
    const [toast, setToast] = useState('');
    const [delivered, setDelivered] = useState(false);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 2500);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(timer);
                    setDelivered(true);
                    showToast('✅ Order Delivered successfully!');
                    return 100;
                }
                return p + 1.5;
            });
            setEta(e => e > 0 ? Math.max(0, e - 0.4) : 0);
        }, 800);
        return () => clearInterval(timer);
    }, []);

    // Calculate scooter position on map overlay (keeps within bounds)
    const scooterTop = Math.min(15 + progress * 0.45, 58);
    const scooterLeft = Math.min(12 + progress * 0.55, 72);

    const steps = [
        { icon: <CheckCircle className="w-5 h-5 text-white" />, label: 'Order Confirmed', time: '12:30 PM', done: true },
        { icon: <Package className="w-5 h-5" />, label: 'Order Packed & Ready', time: '12:45 PM', done: progress > 25 },
        { icon: <Truck className="w-5 h-5" />, label: 'Out for Delivery', time: '01:10 PM', done: progress > 55 },
        { icon: <HomeIcon className="w-5 h-5" />, label: 'Delivered', time: 'ETA 01:40 PM', done: progress >= 100 },
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans max-w-[480px] mx-auto overflow-hidden animate-fadeIn">

            {/* ── MAP SECTION ── */}
            <div className="relative w-full overflow-hidden bg-blue-50" style={{ minHeight: '340px' }}>

                {/* Real OpenStreetMap embed */}
                <iframe
                    title="Delivery Map"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=72.8197%2C19.0560%2C72.8997%2C19.1160&layer=mapnik&marker=19.0760%2C72.8577"
                    style={{ width: '100%', height: '340px', border: 'none', opacity: 0.92 }}
                    loading="lazy"
                    allowFullScreen
                />

                {/* Semi-transparent overlay for style */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/30 pointer-events-none" />

                {/* SVG Route line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>
                    <path
                        d="M 80 290 C 120 240 150 180 200 140 S 260 90 310 60"
                        fill="none" stroke="#2563eb" strokeWidth="5"
                        strokeLinecap="round" strokeDasharray="14 8" opacity="0.85"
                        filter="url(#glow)"
                    />
                </svg>

                {/* Moving delivery scooter */}
                <div
                    className="absolute z-20 transition-all duration-700 ease-linear"
                    style={{ top: `${scooterTop}%`, left: `${scooterLeft}%` }}
                >
                    <div className="relative">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-blue-500">
                            <span className="text-2xl">🛵</span>
                        </div>
                        <div className="absolute inset-0 border-4 border-blue-400 rounded-full animate-ping opacity-30" />
                        {/* ETA bubble */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-lg whitespace-nowrap shadow-lg">
                            {Math.ceil(eta)} min
                        </div>
                    </div>
                </div>

                {/* Store pin */}
                <div className="absolute bottom-[68%] left-[10%] flex flex-col items-center z-10">
                    <div className="bg-white p-2 text-xl rounded-full shadow-lg border-2 border-slate-300">🏪</div>
                    <div className="bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded-md mt-1 shadow-md">DMart Hub</div>
                </div>

                {/* Home drop-off pin */}
                <div className="absolute top-[12%] right-[10%] flex flex-col items-center z-10">
                    <div className="relative bg-white p-2 text-xl rounded-full shadow-lg border-2 border-green-500">
                        🏠
                        <div className="absolute inset-0 border-2 border-green-400 rounded-full animate-ping opacity-40" />
                    </div>
                    <div className="bg-green-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md mt-1 shadow-md">Your Home</div>
                </div>

                {/* Top bar */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-30">
                    <button
                        onClick={() => navigate('/orders')}
                        className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-slate-100 active:scale-90 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-800" />
                    </button>

                    <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-white/50 flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-blue-600" />
                        <div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Arriving in</div>
                            <div className="text-xl font-black text-slate-900 leading-tight">
                                {Math.ceil(eta)} <span className="text-sm text-slate-500 font-bold">mins</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="bg-white/95 backdrop-blur-md px-3 py-2.5 rounded-2xl shadow-xl border border-white/50 text-center min-w-[60px]">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Progress</div>
                        <div className="text-lg font-black text-green-600 leading-tight">{Math.round(progress)}%</div>
                    </div>
                </div>
            </div>

            {/* ── INFO BOTTOM SHEET ── */}
            <div className="flex-1 bg-white rounded-t-[32px] -mt-6 z-20 shadow-[0_-20px_40px_rgba(0,0,0,0.08)] p-6 flex flex-col">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5" />

                {/* Order ID Banner */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 flex items-center justify-between mb-5">
                    <div>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Order</p>
                        <p className="font-black text-blue-900 text-sm">#DM-87234</p>
                    </div>
                    <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-xl">🚚 Out for Delivery</span>
                </div>

                {/* Delivery Partner */}
                <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-3xl shadow-sm mb-5">
                    <div className="relative">
                        <img
                            src="https://i.pravatar.cc/150?img=11"
                            alt="Driver"
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md border border-white shadow-sm">4.8★</div>
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Delivery Partner</p>
                        <h3 className="font-extrabold text-slate-900 text-lg leading-tight">Rajesh Kumar</h3>
                        <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                            Vaccinated <Shield className="w-3 h-3 inline text-green-500" fill="currentColor" />
                        </p>
                    </div>
                    <button
                        onClick={() => showToast('📞 Calling Rajesh...')}
                        className="w-10 h-10 bg-green-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-200 active:scale-90 transition-all"
                    >
                        <Phone className="w-4 h-4" />
                    </button>
                </div>

                {/* Delivery PIN */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between mb-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-0.5">Delivery PIN</p>
                            <p className="text-xs font-bold text-blue-900">Show this to the rider</p>
                        </div>
                    </div>
                    <div className="text-2xl font-black tracking-[0.2em] text-blue-700 bg-white px-4 py-2 rounded-xl shadow-sm border border-blue-100">
                        0824
                    </div>
                </div>

                {/* Live Progress Bar */}
                <div className="mb-5">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Delivery Progress</span>
                        <span className="text-xs font-black text-green-600">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-700 shadow-sm"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Timeline */}
                <div className="space-y-3 mb-6">
                    {steps.map((step, i) => (
                        <div key={i} className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${step.done ? 'bg-green-50 border border-green-100' : 'bg-slate-50 border border-slate-100'}`}>
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${step.done ? 'bg-green-500 text-white shadow-md shadow-green-200' : 'bg-white border border-slate-200 text-slate-400'}`}>
                                {step.icon}
                            </div>
                            <div className="flex-1">
                                <h4 className={`font-bold text-xs ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</h4>
                                <p className="text-[10px] font-semibold text-slate-400">{step.time}</p>
                            </div>
                            {step.done && <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button
                        onClick={() => navigate('/support')}
                        className="bg-slate-50 border border-slate-200 text-slate-700 font-black text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm hover:bg-slate-100"
                    >
                        <MessageSquare className="w-4 h-4" /> Support
                    </button>
                    <button
                        onClick={() => {
                            window.open(
                                'https://www.google.com/maps/dir/?api=1&destination=19.0760,72.8777',
                                '_blank'
                            );
                        }}
                        className="bg-slate-900 text-white font-black text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-slate-200 hover:bg-slate-800"
                    >
                        Open in Google Maps
                    </button>
                </div>

                {/* Delivered CTA */}
                {delivered && (
                    <button
                        onClick={() => navigate('/order-success')}
                        className="mt-4 w-full bg-green-600 text-white font-black text-sm py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-green-200 animate-slideUp"
                    >
                        ✅ Delivered! View Order Details →
                    </button>
                )}
            </div>

            {/* Toast */}
            {toast && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm z-50 animate-slideUp flex items-center gap-2 whitespace-nowrap">
                    {toast}
                </div>
            )}
        </div>
    );
};

export default Tracking;
