import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Package, Wallet, Star, ArrowLeft, ChevronRight, Settings, Phone, Mail } from 'lucide-react';
import api from '../utils/api';

const Account = () => {
    const [user] = useState({
        name: localStorage.getItem('userName') || 'Guest User',
        email: localStorage.getItem('userEmail') || 'guest@dmart.in',
        phone: '+91 98765 43210'
    });
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const contactId = localStorage.getItem('sfContactId');
        if (contactId) fetchOrders(contactId);
    }, []);

    const fetchOrders = async (contactId) => {
        try {
            const response = await api.get(`/orders/${contactId}`);
            setOrders(response.data.orders || []);
        } catch (err) {
            console.error("Failed to fetch user orders", err);
        }
    };

    const logout = () => {
        localStorage.removeItem('sfContactId');
        localStorage.removeItem('userName');
        navigate('/login');
    };

    const highlights = [
        { label: 'Wallet', val: '₹750', icon: Wallet, color: 'bg-green-100 text-green-700' },
        { label: 'Orders', val: orders.length, icon: Package, color: 'bg-blue-100 text-blue-700' },
        { label: 'Rating', val: '4.8', icon: Star, color: 'bg-yellow-100 text-yellow-700' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-20 animate-fadeIn relative">
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl px-5 py-4 border-b border-slate-100 flex items-center justify-between max-w-[480px] mx-auto shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/home')} className="w-10 h-10 bg-slate-100 border border-slate-200 flex items-center justify-center rounded-xl text-slate-700 active:scale-90 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Profile <span className="text-green-600">Sync</span></h1>
                </div>
                <button
                    onClick={() => navigate('/settings')}
                    className="w-10 h-10 bg-slate-50 border border-slate-100 flex items-center justify-center rounded-xl text-slate-500 active:scale-90 transition-all"
                >
                    <Settings className="w-5 h-5" />
                </button>
            </header>

            <div className="px-5 pt-24 animate-slideUp">
                <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm mb-6 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-600 to-green-400 p-1 mb-4 shadow-xl">
                        <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">{user.name}</h2>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Active Salesforce Profile</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 w-full">
                        {highlights.map(h => (
                            <div key={h.label} className="bg-slate-50 rounded-3xl p-4 border border-slate-100 flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-xl mb-2 flex items-center justify-center ${h.color}`}>
                                    <h.icon className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-black text-slate-900">{h.val}</span>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{h.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[40px] p-6 border border-slate-100 shadow-sm mb-6 animate-slideUp">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-2">Quick Actions</h4>
                    <div className="space-y-3">
                        <div onClick={() => navigate('/orders')} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:border-green-200 transition-all active:scale-95">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                                    <Package className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-black text-slate-800 tracking-tight">My Orders</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-green-500 transition-colors" />
                        </div>
                        <div onClick={() => navigate('/address')} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:border-blue-200 transition-all active:scale-95">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-black text-slate-800 tracking-tight">Saved Addresses</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <div onClick={() => navigate('/offers')} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:border-purple-200 transition-all active:scale-95">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                                    <Wallet className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-black text-slate-800 tracking-tight">Offers & Deals</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-purple-500 transition-colors" />
                        </div>
                        {/* Orders preview */}
                        {orders.length > 0 && (
                            <div className="mt-2 space-y-2">
                                {orders.slice(0, 3).map(o => (
                                    <div key={o.Id} className="flex justify-between items-center px-4 py-3 bg-white border border-slate-100 rounded-xl">
                                        <div>
                                            <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Order #{o.Id.slice(-6)}</p>
                                            <p className="text-xs font-bold text-slate-800">{new Date(o.CreatedDate).toLocaleDateString()}</p>
                                        </div>
                                        <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black rounded-lg border border-green-100">{o.Status__c || o.Status || 'Active'}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-[40px] p-6 border border-slate-100 shadow-sm mb-6 animate-slideUp delay-100">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-2">Connected Details</h4>
                    <div className="space-y-5 px-2">
                        <div className="flex items-center gap-4">
                            <Phone className="w-5 h-5 text-slate-400" />
                            <span className="text-sm font-bold text-slate-700">{user.phone}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Mail className="w-5 h-5 text-slate-400" />
                            <span className="text-sm font-bold text-slate-700">{user.email}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="w-full bg-red-50 text-red-600 rounded-[32px] py-4.5 font-black text-lg border-2 border-red-100 shadow-xl shadow-red-100/50 flex items-center justify-center gap-3 active:scale-95 transition-all mb-10"
                >
                    Logout Account <LogOut className="w-6 h-6" />
                </button>
            </div>

            {/* Decorative */}
            <div className="fixed -bottom-12 -right-12 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-40 -z-10"></div>
        </div>
    );
};

export default Account;
