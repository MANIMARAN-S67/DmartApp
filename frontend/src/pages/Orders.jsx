import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Share2, Phone, RotateCcw, Bell, Star, AlertTriangle, Apple, UtensilsCrossed, CupSoda, Leaf, Headset, Home, Package, Tag, ShoppingCart, User, Receipt, MessageCircle, Loader2 } from 'lucide-react';
import api from '../utils/api';

const Orders = () => {
    const [activeTab, setActiveTab] = useState('active');
    const navigate = useNavigate();
    const [toast] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const contactId = localStorage.getItem('sfContactId');

    useEffect(() => {
        const loadOrders = async () => {
            if (!contactId) {
                setLoading(false);
                return;
            }
            try {
                const res = await api.get(`/DmartOrderAPI/${contactId}`);
                let apiOrders = res.data?.orders || [];
                const localOrders = JSON.parse(localStorage.getItem('localOrders') || '[]');
                setOrders([...localOrders, ...apiOrders]);
            } catch (err) {
                console.warn("Order fetch failed", err);
                const localOrders = JSON.parse(localStorage.getItem('localOrders') || '[]');
                setOrders(localOrders);
            } finally {
                setLoading(false);
            }
        };
        loadOrders();
    }, [contactId]);


    return (
        <div className="min-h-full bg-slate-50 flex flex-col animate-fadeIn">
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
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
                            <p className="text-slate-500 font-bold">Fetching your orders from Salesforce...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                                <Package className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="font-black text-slate-800 text-lg mb-2">No orders found</h3>
                            <p className="text-slate-400 text-sm mb-6">You haven't placed any orders yet.</p>
                            <button onClick={() => navigate('/products')} className="bg-green-600 text-white font-black px-8 py-3 rounded-2xl shadow-lg shadow-green-100 active:scale-95 transition-all">Start Shopping</button>
                        </div>
                    ) : (
                        <div className="animate-slideUp space-y-4">
                            <div className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">
                                {orders.length} order{orders.length > 1 ? 's' : ''} found
                            </div>

                            {orders.map((order) => (
                                <div key={order.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                                    <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                                        <div>
                                            <h3 className="font-black text-slate-900 text-sm">{order.id?.length > 10 ? `#${order.id.slice(-8).toUpperCase()}` : `#${order.id}`}</h3>
                                            <p className="text-xs font-bold text-slate-400 mt-0.5">
                                                {new Date(order.createdDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <span className={`font-black text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-xl border flex items-center gap-1 ${order.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' :
                                            order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-blue-100 text-blue-700 border-blue-200'
                                            }`}>
                                            {order.status === 'Delivered' ? '✅ Delivered' :
                                                order.status === 'Cancelled' ? '❌ Cancelled' : `🚚 ${order.status || 'Processing'}`}
                                        </span>
                                    </div>
                                    <div className="p-5 bg-white">
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="text-xs font-medium text-slate-500">Total Amount</p>
                                            <p className="font-black text-slate-900 text-lg">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => navigate('/tracking', { state: { order } })} className="flex-1 bg-green-600 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-100 active:scale-95 transition-all">
                                                <MapPin className="w-4 h-4" /> Track
                                            </button>
                                            <button onClick={() => navigate('/e-receipt', { state: { order } })} className="flex-1 bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                                                <Receipt className="w-4 h-4" /> Receipt
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
