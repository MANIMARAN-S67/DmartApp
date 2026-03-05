import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Lock, ChevronRight, Shield, Save, Edit3, CheckCircle2, X } from 'lucide-react';

const Settings = () => {
    const navigate = useNavigate();

    const [name, setName] = useState(localStorage.getItem('userName') || 'DMart User');
    const [email, setEmail] = useState(localStorage.getItem('userEmail') || 'guest@dmart.in');
    const [phone, setPhone] = useState(localStorage.getItem('userPhone') || '+91 98765 43210');
    const [isEditing, setIsEditing] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');

    // Modal states
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // Password flow states
    const [passwordStep, setPasswordStep] = useState('phone'); // 'phone' | 'otp' | 'newPassword'
    const [otp, setOtp] = useState(['', '', '', '']);
    const [newPassword, setNewPassword] = useState('');

    const handleSave = () => {
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPhone', phone);
        setSaveStatus('success');
        setIsEditing(false);
        setTimeout(() => setSaveStatus(''), 2000);
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);
        // Auto focus next
        if (value && index < 3) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
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
                        <div
                            onClick={() => { setShowPasswordModal(true); setPasswordStep('phone'); }}
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer active:scale-95 transition-all group hover:border-red-200"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-black text-slate-800">Change Password</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-red-400 transition-colors" />
                        </div>

                        <div
                            onClick={() => setShowPrivacy(true)}
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer active:scale-95 transition-all group hover:border-purple-200"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-black text-slate-800">Privacy & Terms</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-purple-400 transition-colors" />
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

            {/* Privacy & Terms Modal */}
            {showPrivacy && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center max-w-[480px] mx-auto overflow-hidden animate-fadeIn">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowPrivacy(false)}></div>
                    <div className="relative w-full bg-white rounded-t-[40px] p-8 pb-10 shadow-2xl animate-slideUp border-t border-slate-100 max-h-[85vh] overflow-y-auto">
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8"></div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-slate-900">Privacy <span className="text-green-600">& Terms</span></h2>
                            <button onClick={() => setShowPrivacy(false)} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400"><X /></button>
                        </div>
                        <div className="space-y-6 text-slate-600 text-sm font-bold leading-relaxed">
                            <section>
                                <h3 className="text-slate-900 font-black uppercase tracking-widest text-xs mb-3">1. Information Collection</h3>
                                <p>We collect information you provide directly to us when you create an account, make a purchase, or communicate with us in Salesforce.</p>
                            </section>
                            <section>
                                <h3 className="text-slate-900 font-black uppercase tracking-widest text-xs mb-3">2. Data Usage</h3>
                                <p>Your data is used to process orders, manage deliveries, and provide personalized DMart offers based on your shopping history.</p>
                            </section>
                            <section>
                                <h3 className="text-slate-900 font-black uppercase tracking-widest text-xs mb-3">3. Security</h3>
                                <p>We implement professional security measures to protect your account details and payment information.</p>
                            </section>
                            <section>
                                <h3 className="text-slate-900 font-black uppercase tracking-widest text-xs mb-3">4. Cookies</h3>
                                <p>We use local storage and session identifiers to keep you logged in and remember your shopping cart items.</p>
                            </section>
                        </div>
                        <button onClick={() => setShowPrivacy(false)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black mt-10">I Understand</button>
                    </div>
                </div>
            )}

            {/* Password Change Modal / Flow */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center max-w-[480px] mx-auto animate-fadeIn">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)}></div>
                    <div className="relative w-full bg-white rounded-t-[40px] p-8 pb-10 shadow-2xl animate-slideUp border-t border-slate-100">
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8"></div>

                        {passwordStep === 'phone' && (
                            <div className="animate-slideUp">
                                <h2 className="text-2xl font-black text-slate-900 mb-2">Verify <span className="text-red-500">Phone</span></h2>
                                <p className="text-slate-500 text-sm font-bold mb-8">We will send a 4-digit OTP to your registered number.</p>
                                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 mb-8 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-red-500">
                                        <Phone />
                                    </div>
                                    <span className="text-lg font-black text-slate-800 tracking-tight">{phone}</span>
                                </div>
                                <button
                                    onClick={() => setPasswordStep('otp')}
                                    className="w-full bg-red-500 text-white py-4.5 rounded-2xl font-black shadow-lg shadow-red-200"
                                >
                                    Get OTP via SMS
                                </button>
                            </div>
                        )}

                        {passwordStep === 'otp' && (
                            <div className="animate-slideUp text-center">
                                <h2 className="text-2xl font-black text-slate-900 mb-2">Enter <span className="text-orange-500">OTP</span></h2>
                                <p className="text-slate-500 text-sm font-bold mb-8">Code sent to {phone.slice(-4).padStart(phone.length, '*')}</p>

                                <div className="flex justify-center gap-4 mb-10">
                                    {otp.map((digit, idx) => (
                                        <input
                                            key={idx}
                                            id={`otp-${idx}`}
                                            type="number"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                                            className="w-14 h-16 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center font-black text-2xl focus:border-orange-400 outline-none transition-all"
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={() => setPasswordStep('newPassword')}
                                    disabled={otp.some(d => !d)}
                                    className="w-full bg-orange-500 text-white py-4.5 rounded-2xl font-black shadow-lg shadow-orange-200 disabled:opacity-50"
                                >
                                    Verify Code
                                </button>
                                <p className="mt-6 text-xs font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-orange-600">Resend Code in 00:45</p>
                            </div>
                        )}

                        {passwordStep === 'newPassword' && (
                            <div className="animate-slideUp">
                                <h2 className="text-2xl font-black text-slate-900 mb-2">New <span className="text-green-600">Password</span></h2>
                                <p className="text-slate-500 text-sm font-bold mb-8">Set a strong secure password for your DMart account.</p>

                                <div className="space-y-4 mb-8">
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-4.5 text-slate-400 w-5 h-5" />
                                        <input
                                            type="password"
                                            placeholder="Enter New Password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 outline-none focus:border-green-400 transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-4.5 text-slate-400 w-5 h-5" />
                                        <input
                                            type="password"
                                            placeholder="Confirm Password"
                                            className="w-full pl-12 pr-4 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 outline-none focus:border-green-400 transition-all"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setSaveStatus('success');
                                        setShowPasswordModal(false);
                                        setTimeout(() => setSaveStatus(''), 2000);
                                    }}
                                    className="w-full bg-green-600 text-white py-4.5 rounded-2xl font-black shadow-lg shadow-green-200"
                                >
                                    Update Password
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
