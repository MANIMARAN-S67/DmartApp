import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Package, Wallet, Star, ArrowLeft, ChevronRight, Settings, Phone, Mail, MapPin, Camera, Image as ImageIcon, CheckCircle2, Pencil, SquarePen, CreditCard, Trash2 } from 'lucide-react';
import api from '../utils/api';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Account = () => {
    const [user, setUser] = useState({
        name: localStorage.getItem('userName') || 'DMart User',
        email: localStorage.getItem('userEmail') || '',
        phone: localStorage.getItem('userPhone') || '',
        address: localStorage.getItem('userAddress') || '',
        photo: localStorage.getItem('userPhoto') || null
    });
    const [isOnline, setIsOnline] = useState(true);
    const [orders, setOrders] = useState([]);
    const [isEditingName, setIsEditingName] = useState(false);
    const [toast, setToast] = useState('');
    const [savedCards, setSavedCards] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('dmartPayments') || '[]');
        } catch {
            return [];
        }
    });
    const navigate = useNavigate();

    useEffect(() => {
        const contactId = localStorage.getItem('sfContactId');
        if (contactId) fetchOrders(contactId);

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser && firebaseUser.photoURL) {
                if (!localStorage.getItem('userPhoto')) {
                    localStorage.setItem('userPhoto', firebaseUser.photoURL);
                    setUser(prev => ({ ...prev, photo: firebaseUser.photoURL }));
                    window.dispatchEvent(new Event('storage'));
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchOrders = async (contactId) => {
        try {
            const response = await api.get(`/DmartOrderAPI/${contactId}`);
            if (response.data && response.data.orders) {
                setOrders(response.data.orders);
            } else {
                setOrders([]);
            }
        } catch (err) {
            console.error("Failed to fetch user orders", err);
            setOrders([]);
        }
    };

    const logout = () => {
        localStorage.removeItem('sfContactId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userPhone');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userAddress');
        localStorage.removeItem('userPhoto');
        navigate('/login');
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
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
                window.dispatchEvent(new Event('storage'));
                showToast("✅ Profile photo permanently saved!");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveName = () => {
        if (!user.name.trim()) return;
        localStorage.setItem('userName', user.name);
        setIsEditingName(false);
        window.dispatchEvent(new Event('storage'));
        showToast("✅ Name updated successfully!");
    };

    const handleDeleteCard = (cardId) => {
        const updatedCards = savedCards.filter(c => c.id !== cardId);
        setSavedCards(updatedCards);
        localStorage.setItem('dmartPayments', JSON.stringify(updatedCards));
        const cId = localStorage.getItem('sfContactId');
        if (cId) {
            api.post('/DmartUserAPI_v2/update-profile', {
                userId: cId,
                paymentMethods: JSON.stringify(updatedCards)
            }).catch(e => console.error("Failed to delete saved card", e));
        }
        showToast("💳 Card deleted successfully");
    };

    const highlights = [
        { label: 'Wallet', val: '₹750', icon: Wallet, color: 'bg-green-100 text-green-700' },
        { label: 'Orders', val: orders.length, icon: Package, color: 'bg-blue-100 text-blue-700' },
        { label: 'Rating', val: '4.8', icon: Star, color: 'bg-yellow-100 text-yellow-700' }
    ];

    let displayAddress = user.address;
    if (user.address) {
        try {
            const parsed = JSON.parse(user.address);
            if (Array.isArray(parsed) && parsed.length > 0) {
                const defAddr = parsed.find(a => a.default) || parsed[0];
                displayAddress = `${defAddr.flat}, ${defAddr.street}, ${defAddr.city} - ${defAddr.pin}`;
            }
        } catch (e) {
            console.warn('Failed to parse address data', e);
        }
    }

    return (
        <div className="min-h-full bg-slate-50 pb-32 animate-fadeIn relative overflow-x-hidden transition-all">
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
                    <div className="relative mb-6 group">
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

                            <input type="file" id="photo-upload" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                        </div>

                        <label htmlFor="photo-upload" className="absolute -bottom-2 -right-2 bg-white text-slate-900 px-4 py-2 rounded-2xl flex items-center gap-2 cursor-pointer active:scale-90 transition-all shadow-xl hover:bg-slate-50 border border-slate-100">
                            <SquarePen className="w-4 h-4 text-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Edit</span>
                        </label>
                    </div>

                    <div className="mb-6 group w-full">
                        <div className="flex flex-col items-center justify-center gap-3 mb-2 px-4">
                            {isEditingName ? (
                                <div className="flex items-center gap-2 w-full max-w-[280px] animate-fadeIn">
                                    <input 
                                        autoFocus
                                        value={user.name}
                                        onChange={(e) => setUser({...user, name: e.target.value})}
                                        className="w-full text-center text-2xl font-black text-slate-900 border-b-2 border-blue-500 outline-none pb-1 bg-transparent"
                                        onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
                                    />
                                    <button onClick={handleSaveName} className="p-2 bg-blue-500 text-white rounded-xl shadow-md active:scale-90 shrink-0">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-3 w-full">
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none truncate max-w-[220px]">{user.name}</h2>
                                    <button 
                                        onClick={() => setIsEditingName(true)}
                                        className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-all active:scale-90 hover:text-blue-600 hover:border-blue-100 shadow-sm shrink-0"
                                    >
                                        <SquarePen className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="text-slate-400 text-xs font-bold tracking-tight">{user.email || user.phone || 'Welcome to DMart'}</p>
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
                        {user.phone && (
                            <div className="flex items-center gap-4">
                                <Phone className="w-5 h-5 text-slate-400" />
                                <span className="text-sm font-bold text-slate-700">{user.phone}</span>
                            </div>
                        )}
                        {user.email && (
                            <div className="flex items-center gap-4">
                                <Mail className="w-5 h-5 text-slate-400" />
                                <span className="text-sm font-bold text-slate-700">{user.email}</span>
                            </div>
                        )}
                        {user.address && (
                            <div className="flex items-center gap-4">
                                <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                                <span className="text-sm font-bold text-slate-700 break-words">{displayAddress}</span>
                            </div>
                        )}
                        {!user.phone && !user.email && !user.address && (
                            <p className="text-xs font-bold text-slate-400">No contact details connected.</p>
                        )}
                    </div>
                </div>

                {savedCards.length > 0 && (
                    <div className="bg-white rounded-[40px] p-6 border border-slate-100 shadow-sm mb-6 animate-slideUp delay-200">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-2">Saved Payment Methods</h4>
                        <div className="space-y-3 px-2">
                            {savedCards.map(c => (
                                <div key={c.id} className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-2xl p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center">
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">{c.brand}</p>
                                            <p className="text-sm font-black text-slate-800">•••• {c.cardNumber.slice(-4)}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteCard(c.id)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors active:scale-90"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    onClick={logout}
                    className="w-full bg-red-50 text-red-600 rounded-[32px] py-4.5 font-black text-lg border-2 border-red-100 shadow-xl shadow-red-100/50 flex items-center justify-center gap-3 active:scale-95 transition-all mb-10"
                >
                    Logout Account <LogOut className="w-6 h-6" />
                </button>
            </div>

            {toast && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl font-black text-xs z-[100] whitespace-nowrap animate-slideUp flex items-center gap-3 border border-white/10">
                    {toast}
                </div>
            )}

            <div className="fixed -bottom-12 -right-12 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-40 -z-10"></div>
        </div>
    );
};

export default Account;
