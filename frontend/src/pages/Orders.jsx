import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Share2, Phone, RotateCcw, Bell, Star, AlertTriangle, Apple, UtensilsCrossed, CupSoda, Leaf, Headset, Home, Package, Tag, ShoppingCart, User, Receipt, MessageCircle } from 'lucide-react';

const Orders = () => {
    const [activeTab, setActiveTab] = useState('active');
    const navigate = useNavigate();
    const [toast, setToast] = useState('');

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 2500);
    };

    const shareWA = () => {
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        const msg = [
            '🧾 *DMart e‑Receipt*',
            '',
            '*Order ID:* #DM-81029',
            `*Date:* ${dateStr} · ${timeStr}`,
            '*Store:* DMart Online – Andheri West',
            '',
            '*Items:*',
            '• Fresh Pomegranate × 1 – ₹100',
            '• Mixed Cashews × 1 – ₹340',
            '• Bisleri Water × 2 – ₹40',
            '• Mango Juice × 1 – ₹45',
            '',
            '*Subtotal:* ₹525',
            '*GST (5%):* ₹26.25',
            '*Delivery:* ₹40',
            '*Bill Total:* ₹591.25',
            '',
            'Thank you for shopping with *DMart Online*!'
        ].join('\n');
        window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col animate-fadeIn">
            {/* Scrollable body + bottom nav clearance */}
            <div className="flex-1 overflow-y-auto pb-24">
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-5 py-4 max-w-[480px] mx-auto shadow-sm">
                    <button onClick={() => navigate('/home')} className="w-10 h-10 bg-slate-100 border border-slate-200 flex items-center justify-center rounded-xl text-slate-700 active:scale-90 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">My Orders</h1>
                    <button onClick={() => navigate('/products')} className="w-10 h-10 bg-slate-100 border border-slate-200 flex items-center justify-center rounded-xl text-slate-700 active:scale-90 transition-all">
                        <Search className="w-5 h-5" />
                    </button>
                </header>

                <div className="flex border-b-2 border-slate-200 bg-white">
                    {['active', 'completed', 'cancelled'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-green-600' : 'text-slate-400'}`}
                        >
                            {tab}
                            {activeTab === tab && <div className="absolute bottom-[-2px] left-1/4 right-1/4 h-1 bg-green-600 rounded-t-full"></div>}
                        </button>
                    ))}
                </div>

                <div className="px-5 py-6">
                    {activeTab === 'active' && (
                        <div className="animate-slideUp space-y-4">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
                                <div className="w-10 h-10 bg-yellow-100 text-yellow-600 border border-yellow-200 rounded-xl flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-yellow-800 text-sm mb-1">Some items are out of stock</h4>
                                    <p className="text-xs font-semibold text-yellow-700 leading-snug">Organic Oranges & Whole Wheat Bread are unavailable.</p>
                                </div>
                            </div>

                            <div className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">1 active order</div>

                            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                                <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                                    <div>
                                        <h3 className="font-black text-slate-900 text-sm">#DM-87234</h3>
                                        <p className="text-xs font-bold text-slate-400 mt-0.5">Feb 25, 2026 · 2:30 PM</p>
                                    </div>
                                    <span className="bg-blue-100 text-blue-700 font-black text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-xl border border-blue-200 flex items-center gap-1">🚚 Out for Delivery</span>
                                </div>
                                <div className="p-5 border-b border-slate-50 flex gap-2 overflow-x-auto scrollbar-hide">
                                    {[Leaf, CupSoda, UtensilsCrossed, Apple].map((Icon, i) => (
                                        <div key={i} className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                                            <Icon className="w-6 h-6 text-slate-600" />
                                        </div>
                                    ))}
                                    <div className="h-12 flex items-center text-xs font-black text-slate-400 px-2 shrink-0">+3 more</div>
                                </div>
                                <div className="p-5 bg-white">
                                    <p className="text-xs font-medium text-slate-500 mb-4">7 items · Total: <span className="font-black text-slate-900">₹845.00</span> · Cashback: <span className="font-black text-purple-600">₹17</span></p>
                                    <div className="flex gap-2">
                                        <button onClick={() => navigate('/tracking')} className="flex-1 bg-green-600 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-100 active:scale-95 transition-all"><MapPin className="w-4 h-4" /> Track Live</button>
                                        <button onClick={shareWA} className="flex-1 bg-[#25D366] text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-100 active:scale-95 transition-all"><Share2 className="w-4 h-4" /> Share</button>
                                        <button onClick={() => navigate('/support')} className="flex-[0.6] bg-slate-100 text-slate-700 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"><Phone className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'completed' && (
                        <div className="animate-slideUp space-y-4">
                            <div className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">2 completed orders</div>

                            {[
                                { id: '#DM-81029', date: 'Feb 20, 2026', icons: [Apple, Leaf, UtensilsCrossed], items: 3, total: 378 },
                                { id: '#DM-76543', date: 'Feb 15, 2026', icons: [Leaf, CupSoda, UtensilsCrossed, Apple], items: 4, total: 629 }
                            ].map((order, index) => (
                                <div key={index} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                                    <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                                        <div>
                                            <h3 className="font-black text-slate-900 text-sm">{order.id}</h3>
                                            <p className="text-xs font-bold text-slate-400 mt-0.5">{order.date}</p>
                                        </div>
                                        <span className="bg-green-100 text-green-700 font-black text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-xl border border-green-200 flex items-center gap-1">✅ Delivered</span>
                                    </div>
                                    <div className="p-5 border-b border-slate-50 flex gap-2 overflow-x-auto scrollbar-hide">
                                        {order.icons.map((Icon, i) => (
                                            <div key={i} className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                                                <Icon className="w-6 h-6 text-slate-600" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-5 bg-white">
                                        <p className="text-xs font-medium text-slate-500 mb-4">{order.items} items · Total: <span className="font-black text-slate-900">₹{order.total}.00</span></p>
                                        <div className="flex gap-2">
                                            <button onClick={() => navigate('/products')} className="flex-1 bg-slate-900 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-slate-200 active:scale-95 transition-all"><RotateCcw className="w-4 h-4" /> Reorder</button>
                                            <button onClick={() => navigate('/e-receipt')} className="flex-1 bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"><Receipt className="w-4 h-4" /> Receipt</button>
                                            <button onClick={() => showToast('⭐ Rate submitted!')} className="flex-[0.6] bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"><Star className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'cancelled' && (
                        <div className="animate-slideUp space-y-4">
                            <div className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">1 cancelled order</div>

                            <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                                <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                                    <div>
                                        <h3 className="font-black text-slate-900 text-sm">#DM-70012</h3>
                                        <p className="text-xs font-bold text-slate-400 mt-0.5">Feb 10, 2026</p>
                                    </div>
                                    <span className="bg-red-50 text-red-600 font-black text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-xl border border-red-200 flex items-center gap-1">❌ Cancelled</span>
                                </div>
                                <div className="p-5 border-b border-slate-50 flex gap-2 overflow-x-auto scrollbar-hide">
                                    {[Apple, UtensilsCrossed].map((Icon, i) => (
                                        <div key={i} className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                                            <Icon className="w-6 h-6 text-slate-600" />
                                        </div>
                                    ))}
                                </div>
                                <div className="p-5 bg-white">
                                    <p className="text-xs font-medium text-slate-500 mb-4">2 items · Refund: <span className="font-black text-green-600">₹210 (processed)</span></p>
                                    <div className="flex gap-2">
                                        <button onClick={() => navigate('/support')} className="w-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"><Headset className="w-4 h-4" /> Reach Support</button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
                                <h4 className="font-extrabold text-slate-800 text-sm mb-4">📦 Delivery Stock Status</h4>
                                <div className="space-y-4">
                                    {[
                                        { emoji: '🍊', name: 'Nagpur Oranges', pct: 0, status: 'Out of Stock', color: 'red' },
                                        { emoji: '🥐', name: 'Butter Croissant', pct: 15, status: '15%', color: 'yellow' },
                                        { emoji: '🥦', name: 'Organic Broccoli', pct: 72, status: '72%', color: 'green' },
                                        { emoji: '🥛', name: 'Amul Milk', pct: 90, status: '90%', color: 'green' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="text-2xl w-10 flex justify-center shrink-0">{item.emoji}</div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <p className="text-xs font-bold text-slate-700">{item.name}</p>
                                                    <span className={`text-[10px] font-black ${item.color === 'red' ? 'text-red-500' : item.color === 'yellow' ? 'text-orange-500' : 'text-green-600'}`}>{item.status}</span>
                                                </div>
                                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full transition-all duration-1000 ${item.color === 'red' ? 'bg-red-500' : item.color === 'yellow' ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${item.pct}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => navigate('/products')} className="w-full mt-6 bg-slate-50 border border-slate-200 text-slate-700 font-black text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"><Bell className="w-4 h-4" /> Notify when in stock</button>
                            </div>
                        </div>
                    )}
                </div>

            </div>{/* end scrollable */}

            {/* ── BOTTOM NAV ── */}
            <nav className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t border-slate-100 flex items-center justify-around px-2 h-[60px] z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.07)]">
                <NavLink to="/home" className={({ isActive }) => `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${isActive ? 'text-orange-500' : 'text-slate-400'}`}>
                    <Home className="w-5 h-5" />
                    <span className="text-[9px] font-black">Home</span>
                </NavLink>
                <NavLink to="/products" className={({ isActive }) => `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${isActive ? 'text-orange-500' : 'text-slate-400'}`}>
                    <Package className="w-5 h-5" />
                    <span className="text-[9px] font-black">Products</span>
                </NavLink>
                <NavLink to="/offers" className={({ isActive }) => `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${isActive ? 'text-orange-500' : 'text-slate-400'}`}>
                    <Tag className="w-5 h-5" />
                    <span className="text-[9px] font-black">Offers</span>
                </NavLink>
                <NavLink to="/cart" className={({ isActive }) => `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${isActive ? 'text-orange-500' : 'text-slate-400'}`}>
                    <ShoppingCart className="w-5 h-5" />
                    <span className="text-[9px] font-black">Cart</span>
                </NavLink>
                <NavLink to="/account" className={({ isActive }) => `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${isActive ? 'text-orange-500' : 'text-slate-400'}`}>
                    <User className="w-5 h-5" />
                    <span className="text-[9px] font-black">Account</span>
                </NavLink>
            </nav>

            {toast && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm z-50 animate-slideUp flex items-center gap-2 whitespace-nowrap">
                    {toast}
                </div>
            )}
        </div>
    );
};

export default Orders;
