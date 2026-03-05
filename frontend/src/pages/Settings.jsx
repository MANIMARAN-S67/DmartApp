import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Lock, Bell, Globe, ChevronRight, Shield, Save, Edit3, CheckCircle2 } from 'lucide-react';

const Settings = () => {
    const navigate = useNavigate();

    const [name, setName] = useState(localStorage.getItem('userName') || 'DMart User');
    const [email, setEmail] = useState(localStorage.getItem('userEmail') || 'guest@dmart.in');
    const [phone, setPhone] = useState(localStorage.getItem('userPhone') || '+91 98765 43210');
    const [isEditing, setIsEditing] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');

    const handleSave = () => {
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPhone', phone);
        setSaveStatus('success');
        setIsEditing(false);
        setTimeout(() => setSaveStatus(''), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 animate-fadeIn relative">
            <header className="fixed top-0 left-0 right-0 z-50 bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between max-w-[480px] mx-auto shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-50 border border-slate-100 flex items-center justify-center rounded-xl text-slate-700 active:scale-90 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Account <span className="text-green-600">Settings</span></h1>
                </div>
                {saveStatus === 'success' && (
                    <div className="flex items-center gap-1 text-green-600 font-black text-xs animate-bounce">
                        Saved <CheckCircle2 className="w-3 h-3" />
                    </div>
                )}
            </header>

            <div className="px-5 pt-24 animate-slideUp">

                {/* Personal Details Section */}
                <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm mb-6 mt-2 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Personal Details</h4>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`flex items-center gap-1 text-[10px] font-black uppercase px-3 py-1 rounded-lg transition-all ${isEditing ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}
                        >
                            {isEditing ? 'Cancel' : 'Edit Info'} <Edit3 className="w-3 h-3" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className={`p-4 rounded-2xl border transition-all ${isEditing ? 'border-green-400 bg-green-50/30' : 'border-slate-100 bg-slate-50'}`}>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Full Name</p>
                            <div className="flex items-center gap-3">
                                <User className={`w-4 h-4 ${isEditing ? 'text-green-600' : 'text-slate-400'}`} />
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-transparent text-sm font-bold text-slate-800 outline-none w-full"
                                    />
                                ) : (
                                    <span className="text-sm font-bold text-slate-800">{name}</span>
                                )}
                            </div>
                        </div>

                        <div className={`p-4 rounded-2xl border transition-all ${isEditing ? 'border-green-400 bg-green-50/30' : 'border-slate-100 bg-slate-50'}`}>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Mobile Number</p>
                            <div className="flex items-center gap-3">
                                <Phone className={`w-4 h-4 ${isEditing ? 'text-green-600' : 'text-slate-400'}`} />
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="bg-transparent text-sm font-bold text-slate-800 outline-none w-full"
                                    />
                                ) : (
                                    <span className="text-sm font-bold text-slate-800">{phone}</span>
                                )}
                            </div>
                        </div>

                        <div className={`p-4 rounded-2xl border transition-all ${isEditing ? 'border-green-400 bg-green-50/30' : 'border-slate-100 bg-slate-50'}`}>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Email Address</p>
                            <div className="flex items-center gap-3">
                                <Mail className={`w-4 h-4 ${isEditing ? 'text-green-600' : 'text-slate-400'}`} />
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-transparent text-sm font-bold text-slate-800 outline-none w-full"
                                    />
                                ) : (
                                    <span className="text-sm font-bold text-slate-800 truncate">{email}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm mb-6">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Security</h4>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer active:scale-95 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-black text-slate-800">Change Password</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-300" />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer active:scale-95 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-black text-slate-800">Privacy & Terms</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-300" />
                        </div>
                    </div>
                </div>

                <button
                    onClick={isEditing ? handleSave : () => navigate(-1)}
                    className={`w-full ${isEditing ? 'bg-green-600 shadow-green-200/50' : 'bg-slate-800 shadow-slate-200/50'} text-white rounded-[24px] py-4.5 font-black text-lg shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all mb-10`}
                >
                    {isEditing ? (
                        <>Save Changes <Save className="w-5 h-5" /></>
                    ) : (
                        <>Go Back</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Settings;
