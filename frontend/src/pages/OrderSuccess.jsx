import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Share2, Receipt, Star, Home, ArrowRight, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [toast, setToast] = useState('');
    const paymentMethod = localStorage.getItem('lastPaymentMethod') || 'UPI (GPay)';

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 2500);
    };

    useEffect(() => {
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }, []);

    const shareWA = () => {
        const msg = `🛒 *Order Placed Successfully!*\n\nApp: DMart Online\nOrder ID: #DM-81029\nTotal: ₹845\nExpected Delivery: 25 mins\n\nTrack your order here: https://dmart-app.com/track/DM-81029`;
        window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
    };

    const handleRate = (r) => {
        setRating(r);
        showToast('⭐ Thank you for your feedback!');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans max-w-[480px] mx-auto animate-fadeIn pb-10 overflow-x-hidden">
            <div className="bg-green-600 pt-16 pb-24 px-6 relative rounded-b-[40px] shadow-lg overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20px 20px, white 2px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                <div className="relative z-10 flex flex-col items-center text-center animate-slideUp">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-white/30 relative shadow-2xl">
                        <CheckCircle className="w-12 h-12 text-white" />
                        <div className="absolute inset-0 border-4 border-white/40 rounded-full animate-ping"></div>
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2 leading-tight">Order Successful!</h1>
                    <p className="text-green-100 font-medium text-sm">Your order #DM-81029 has been placed.</p>
                </div>
            </div>

            <div className="px-5 -mt-16 relative z-20 space-y-4">
                <div className="bg-white rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-slate-100">
                    <h3 className="font-black text-slate-900 text-lg mb-4 border-b border-slate-100 pb-3">Order Details</h3>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-slate-500">Total Amount</span>
                        <span className="text-lg font-black text-slate-900">₹845.00</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-slate-500">Payment Mode</span>
                        <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5"><div className="w-2 h-2 bg-green-500 rounded-full"></div> {paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-bold text-slate-500">Items Expected</span>
                        <span className="text-sm font-bold text-slate-900">7 Items</span>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-2xl shrink-0">🛵</div>
                        <div>
                            <p className="text-[10px] font-black tracking-widest uppercase text-blue-500 mb-0.5">Estimated Delivery</p>
                            <h4 className="font-extrabold text-blue-900 text-sm">Today, 2:30 PM - 3:00 PM</h4>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => navigate('/tracking')} className="flex-[1.5] bg-slate-900 text-white font-black text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-slate-200">
                            Track Order <ArrowRight className="w-4 h-4" />
                        </button>
                        <button onClick={shareWA} className="flex-1 bg-[#25D366] text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-green-100">
                            <Share2 className="w-4 h-4" /> Share
                        </button>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg overflow-hidden relative">
                    <Gift className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-10" />
                    <div className="relative z-10">
                        <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 backdrop-blur-sm border border-white/20">Reward Unlocked</div>
                        <h3 className="text-xl font-black mb-1">You won ₹17 Cashback!</h3>
                        <p className="text-xs font-medium text-purple-100 mb-4 opacity-90">Added to your DMart Wallet for next purchase.</p>
                        <button onClick={() => showToast('Wallet checked')} className="bg-white text-purple-700 font-bold text-xs px-4 py-2 rounded-lg shadow-sm active:scale-95 transition-all">Check Wallet</button>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center">
                    <h3 className="font-bold text-slate-800 text-sm mb-1">How was your experience?</h3>
                    <p className="text-xs text-slate-400 mb-4 font-medium">Rate your ordering process</p>
                    <div className="flex justify-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button key={star} onClick={() => handleRate(star)} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${rating >= star ? 'bg-yellow-50 text-yellow-400 scale-110' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'}`}>
                                <Star className="w-6 h-6" fill={rating >= star ? 'currentColor' : 'none'} />
                            </button>
                        ))}
                    </div>
                    {rating > 0 && <p className="text-[10px] font-black text-green-600 uppercase tracking-widest animate-fadeIn">Feedback Submitted!</p>}
                </div>
            </div>

            <div className="px-5 mt-8 flex flex-col gap-3">
                <button onClick={() => navigate('/home')} className="w-full bg-white border-2 border-slate-100 text-slate-700 font-black text-sm py-4 rounded-full flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm hover:border-slate-200">
                    <Home className="w-4 h-4" /> Continue Shopping
                </button>
                <button onClick={() => navigate('/e-receipt')} className="w-full text-slate-400 font-bold text-xs py-2 hover:text-slate-600 transition-colors flex items-center justify-center gap-1 group">
                    View e-Receipt <Receipt className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {toast && (
                <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm z-50 animate-slideUp flex items-center gap-2 whitespace-nowrap border border-white/10">
                    {toast}
                </div>
            )}
        </div>
    );
};

export default OrderSuccess;
