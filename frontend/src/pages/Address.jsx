import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, MapPin, Phone, Home as HomeIcon, Briefcase, MapIcon, Check, Edit2, Trash2 } from 'lucide-react';

const Address = () => {
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState(JSON.parse(localStorage.getItem('dmartAddresses')) || [
        { id: 1, type: 'home', name: 'Sachin Kumar', flat: '12, Green Park Colony', street: 'MG Road, Andheri West', city: 'Mumbai', pin: '400053', phone: '+91 98765 43210', default: true },
        { id: 2, type: 'work', name: 'DMart Corp Office', flat: 'Level 5, Trade Tower', street: 'BKC, Bandra East', city: 'Mumbai', pin: '400051', phone: '+91 98765 00000', default: false },
    ]);
    const [showForm, setShowForm] = useState(false);
    const [selType, setSelType] = useState('home');
    const [formData, setFormData] = useState({ fn: '', ln: '', mob: '', flat: '', street: '', city: '', pin: '', isDefault: false });
    const [toast, setToast] = useState('');

    useEffect(() => {
        localStorage.setItem('dmartAddresses', JSON.stringify(addresses));
    }, [addresses]);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 2500);
    };

    const setDefault = (id) => {
        setAddresses(addresses.map(a => ({ ...a, default: a.id === id })));
        showToast('✅ Default address updated!');
    };

    const deleteAddr = (id) => {
        if (window.confirm('Delete this address?')) {
            setAddresses(addresses.filter(a => a.id !== id));
            showToast('🗑️ Address deleted');
        }
    };

    const handleSave = () => {
        if (!formData.fn || !formData.mob || !formData.flat || !formData.city || !formData.pin) {
            showToast('⚠️ Please fill all required fields');
            return;
        }

        let newAddresses = [...addresses];
        if (formData.isDefault) {
            newAddresses = newAddresses.map(a => ({ ...a, default: false }));
        }

        const newAddress = {
            id: Date.now(),
            type: selType,
            name: `${formData.fn} ${formData.ln}`.trim(),
            flat: formData.flat,
            street: formData.street,
            city: formData.city,
            pin: formData.pin,
            phone: formData.mob,
            default: formData.isDefault || newAddresses.length === 0
        };

        setAddresses([...newAddresses, newAddress]);
        setShowForm(false);
        setFormData({ fn: '', ln: '', mob: '', flat: '', street: '', city: '', pin: '', isDefault: false });
        showToast('✅ Address saved successfully!');
    };

    return (
        <div className="min-h-screen bg-slate-50 animate-fadeIn relative pb-20">
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center px-5 py-4 max-w-[480px] mx-auto shadow-sm">
                <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-100 border border-slate-200 flex items-center justify-center rounded-xl text-slate-700 active:scale-90 transition-all mr-4">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="flex-1 text-xl font-black text-slate-900 tracking-tight">My Addresses</h1>
                <button onClick={() => setShowForm(true)} className="w-10 h-10 bg-green-100 border border-green-200 flex items-center justify-center rounded-xl text-green-700 active:scale-90 transition-all">
                    <Plus className="w-5 h-5" />
                </button>
            </header>

            <div className="p-5 space-y-4">
                {addresses.map(a => (
                    <div key={a.id} className={`bg-white rounded-3xl p-5 border-2 transition-all shadow-sm ${a.default ? 'border-green-500 shadow-green-100' : 'border-transparent'}`}>
                        <div className="flex items-center justify-between mb-3">
                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${a.type === 'home' ? 'bg-green-100 text-green-700' : a.type === 'work' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {a.type === 'home' ? <HomeIcon className="w-3 h-3" /> : a.type === 'work' ? <Briefcase className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                                {a.type}
                            </div>
                            {a.default && <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">Default</span>}
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-sm mb-1">{a.name}</h4>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed mb-3">{a.flat}, {a.street}, {a.city} – {a.pin}</p>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-4 bg-slate-50 w-max px-3 py-1.5 rounded-lg border border-slate-100">
                            <Phone className="w-3.5 h-3.5 text-green-600" /> {a.phone}
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-slate-100">
                            {!a.default && (
                                <button onClick={() => setDefault(a.id)} className="flex-1 bg-green-50 text-green-700 border border-green-200 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1 active:scale-95 transition-all">
                                    <Check className="w-3.5 h-3.5" /> Set Default
                                </button>
                            )}
                            <button onClick={() => showToast('✏️ Edit mode')} className="flex-1 bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1 active:scale-95 transition-all">
                                <Edit2 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button onClick={() => deleteAddr(a.id)} className="w-10 bg-red-50 text-red-500 border border-red-200 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center shrink-0 active:scale-95 transition-all">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="px-5 mb-4">
                <button onClick={() => setShowForm(true)} className="w-full bg-slate-900 text-white font-black text-[13px] py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-slate-200 active:scale-95 transition-all mb-3">
                    <Plus className="w-4 h-4" /> Add New Address
                </button>
                <button onClick={() => navigate('/order-success')} className="w-full bg-green-600 text-white font-black text-[13px] py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-green-200 active:scale-95 transition-all">
                    ✅ Proceed to Order Summary →
                </button>
            </div>

            {/* Form Overlay */}
            {showForm && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fadeIn" onClick={() => setShowForm(false)}></div>}

            {/* Add Address Bottom Sheet */}
            <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] max-h-[90vh] overflow-y-auto z-50 transition-transform duration-300 max-w-[480px] mx-auto p-6 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] ${showForm ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">📍 Add New Address</h3>

                <div onClick={() => { showToast('📍 Location pinned'); }} className="w-full h-28 bg-blue-50 rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center text-4xl cursor-pointer border-2 border-blue-100 group">
                    <iframe title="Map Picker" src="https://www.openstreetmap.org/export/embed.html?bbox=72.8197%2C19.0560%2C72.8997%2C19.1160&layer=mapnik&marker=19.0760%2C72.8577" style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }} loading="lazy" />
                    <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                        <MapIcon className="w-3 h-3" /> Tap to pick location
                    </div>
                </div>

                <div className="flex gap-2 mb-6">
                    {['home', 'work', 'other'].map(t => (
                        <button key={t} onClick={() => setSelType(t)} className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all border-2 border-transparent ${selType === t ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                            {t}
                        </button>
                    ))}
                </div>

                <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">First Name</label>
                            <input value={formData.fn} onChange={e => setFormData({ ...formData, fn: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-green-500 outline-none transition-all" placeholder="John" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Last Name</label>
                            <input value={formData.ln} onChange={e => setFormData({ ...formData, ln: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-green-500 outline-none transition-all" placeholder="Doe" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Mobile Number</label>
                        <input type="tel" value={formData.mob} onChange={e => setFormData({ ...formData, mob: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-green-500 outline-none transition-all" placeholder="+91 XXXXX XXXXX" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Flat / House No.</label>
                        <input value={formData.flat} onChange={e => setFormData({ ...formData, flat: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-green-500 outline-none transition-all" placeholder="12, Green Park" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Street / Area</label>
                        <input value={formData.street} onChange={e => setFormData({ ...formData, street: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-green-500 outline-none transition-all" placeholder="MG Road" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">City</label>
                            <input value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-green-500 outline-none transition-all" placeholder="Mumbai" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Pincode</label>
                            <input type="number" value={formData.pin} onChange={e => setFormData({ ...formData, pin: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-green-500 outline-none transition-all" placeholder="400053" />
                        </div>
                    </div>
                </div>

                <label className="flex items-center gap-3 mb-8 cursor-pointer pl-1 group">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all ${formData.isDefault ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-slate-300 group-hover:border-green-400'}`}>
                        {formData.isDefault && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={formData.isDefault} onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })} />
                    <span className="text-sm font-bold text-slate-700">Set as default address</span>
                </label>

                <button onClick={handleSave} className="w-full bg-green-600 text-white font-black text-lg py-4 rounded-2xl shadow-xl shadow-green-200 active:scale-95 transition-all">
                    Save Address
                </button>
            </div>

            {toast && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm z-[100] animate-slideUp flex items-center gap-2 whitespace-nowrap">
                    {toast}
                </div>
            )}
        </div>
    );
};

export default Address;
