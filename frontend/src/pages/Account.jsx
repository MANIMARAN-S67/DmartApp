import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Package, Wallet, Star, ArrowLeft, ChevronRight, Settings, Phone, Mail, Camera, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';

const Account = () => {
    const [user, setUser] = useState({
        name: localStorage.getItem('userName') || 'Guest User',
        email: localStorage.getItem('userEmail') || 'guest@dmart.in',
        phone: localStorage.getItem('userPhone') || '+91 98765 43210',
        photo: localStorage.getItem('userPhoto') || null
    });
    const [isOnline, setIsOnline] = useState(true);
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
        localStorage.removeItem('userPhone');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userPhoto');
        navigate('/login');
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                const updated = { ...user, photo: base64String };
                setUser(updated);
                localStorage.setItem('userPhoto', base64String);
            };
            reader.readAsDataURL(file);
        }
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
                    <div className="relative mb-6">
                        <div
                            className="w-32 h-32 rounded-[44px] bg-gradient-to-br from-green-500 via-emerald-400 to-teal-500 p-1.5 shadow-2xl relative transition-all animate-fadeIn"
                        >
                            <div className="w-full h-full bg-white rounded-[40px] flex items-center justify-center overflow-hidden border-4 border-white">
                                {user.photo ? (
                                    <div className="relative w-full h-full">
                                        <img src={user.photo} alt="Profile" className="w-full h-full object-cover" />
                                        <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 shadow-lg border-2 border-white">
                                            <CheckCircle2 className="w-3 h-3" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-slate-200">
                                        <ImageIcon className="w-12 h-12 mb-1" />
                                        <span className="text-[9px] font-black uppercase tracking-tighter">Add Photo</span>
                                    </div>
                                )}
                            </div>

                            {/* Hidden File Input */}
                            <input
                                type="file"
                                id="photo-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handlePhotoChange}
                            />
                        </div>

                        {/* Separate Change Button */}
                        <label
                            htmlFor="photo-upload"
                            className="absolute -bottom-2 -right-2 bg-white text-slate-900 px-4 py-2 rounded-2xl flex items-center gap-2 cursor-pointer active:scale-90 transition-all shadow-xl hover:bg-slate-50 border border-slate-100"
                        >
                            <Camera className="w-4 h-4 text-green-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Change</span>
                        </label>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">{user.name}</h2>
                        <p className="text-slate-400 text-xs font-bold tracking-tight">{user.email}</p>
                    </div>

                    <div className="flex items-center gap-2 mb-8 cursor-pointer group" onClick={() => setIsOnline(!isOnline)}>
                        <div className={`w-3 h-3 rounded-full transition-all ${isOnline ? 'bg-green-500 animate-pulse shadow-xl shadow-green-200' : 'bg-slate-300'}`}></div>
                        <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isOnline ? 'text-green-600' : 'text-slate-400 group-hover:text-slate-500'}`}>
                            {isOnline ? 'Connected • OnlineNow' : 'Disconnected • Offline'}
                        </p>
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

            <div className="fixed -bottom-12 -right-12 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-40 -z-10"></div>
        </div>
    );
};

export default Account;
