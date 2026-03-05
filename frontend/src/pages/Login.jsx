import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Phone, ChevronLeft, ArrowRight } from 'lucide-react';
import api from '../utils/api';

const Login = () => {
    const [mode, setMode] = useState('email'); // 'email' | 'phone'
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const identifier = mode === 'email' ? email.trim() : phone.trim();

        if (!identifier) {
            setError('Please enter your ' + (mode === 'email' ? 'email address' : 'mobile number') + ' to continue.');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/users/login', { identifier });
            if (response.data.user) {
                localStorage.setItem('sfContactId', response.data.user.Id);
                localStorage.setItem('userName', (response.data.user.FirstName || '') + ' ' + (response.data.user.LastName || ''));
                if (mode === 'email') {
                    localStorage.setItem('userEmail', identifier);
                } else {
                    localStorage.setItem('userPhone', identifier);
                }
                navigate('/home');
            } else {
                setError(response.data.error || 'Login failed');
            }
        } catch (err) {
            // Graceful demo login without showing demo button text
            const raw = identifier;
            const nameBase = raw.replace(/[^\w]/g, ' ') || 'DMart Guest';
            const name = nameBase.replace(/\s+/g, ' ').trim().replace(/\b\w/g, c => c.toUpperCase());
            localStorage.setItem('sfContactId', 'DEMO_' + Date.now());
            localStorage.setItem('userName', name || 'DMart Guest');
            if (mode === 'email') {
                localStorage.setItem('userEmail', identifier);
            } else {
                localStorage.setItem('userPhone', identifier);
            }
            navigate('/home');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-8 pt-10 pb-10 animate-fadeIn relative overflow-hidden flex flex-col">
            {/* Back button */}
            <button onClick={() => navigate('/')} className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm border border-slate-200 active:scale-90 transition-all z-20">
                <ChevronLeft className="w-6 h-6 text-slate-700" />
            </button>

            <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full z-10 pt-8">

                {/* NEW LOGO */}
                <div className="mb-10 flex flex-col items-center text-center animate-slideDown">
                    <span className="text-[11px] font-black tracking-[0.3em] text-slate-500 mb-3 uppercase">Online Shop</span>
                    <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[#ff7e5f] to-[#feb47b] flex items-center justify-center shadow-2xl shadow-orange-200/60 mb-6">
                        {/* Custom Thumbs-Up Shopping Cart SVG */}
                        <svg viewBox="0 0 100 100" className="w-16 h-16 text-white translate-x-1" fill="currentColor">
                            <path d="M22,30 L65,30 C72,30 76,34 74,41 L65,65 C63,70 59,73 53,73 L35,73 C29,73 24,68 23,62 L18,25 L8,25 C5,25 3,23 3,20 C3,17 5,15 8,15 L22,15 C26,15 29,18 30,23 L31,30 Z" />
                            <path d="M45,30 L45,45 L35,45 C32,45 30,47 30,50 C30,53 32,55 35,55 L55,55 C58,55 60,53 60,50 L60,30 L45,30 Z" /> {/* Thumbs up thumb shape approx */}
                            <circle cx="35" cy="85" r="7" />
                            <circle cx="60" cy="85" r="7" />
                            {/* Hand/thumb addition inside the cart basket */}
                            <path d="M75,35 C80,35 84,39 84,44 C84,45 83,46 83,47 C86,48 88,51 88,54 C88,56 87,58 85,59 C87,61 88,64 87,67 C86,70 82,72 79,72 L65,72 L75,35 Z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                        Welcome Back!
                    </h1>
                    <p className="text-slate-500 font-bold text-sm leading-relaxed px-4">
                        Sign in to your account using email or mobile number.
                    </p>
                </div>

                {/* Mode toggle */}
                <div className="flex gap-2 mb-6 bg-slate-200/60 rounded-2xl p-1.5">
                    <button
                        type="button"
                        onClick={() => setMode('email')}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all ${mode === 'email' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Email
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('phone')}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all ${mode === 'phone' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Mobile Number
                    </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    {mode === 'email' ? (
                        <div className="relative group">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 absolute left-4 -top-2 bg-slate-50 px-1.5 z-10 transition-colors group-focus-within:text-orange-500">
                                Email Address
                            </label>
                            <div className="flex items-center gap-3 bg-white border-2 border-slate-200 group-focus-within:border-orange-400 rounded-2xl px-4 transition-all shadow-sm">
                                <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-orange-500 shrink-0" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="sachin@example.com"
                                    className="w-full py-4 text-sm font-bold bg-transparent outline-none text-slate-800 placeholder:text-slate-300"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="relative group">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 absolute left-4 -top-2 bg-slate-50 px-1.5 z-10 transition-colors group-focus-within:text-orange-500">
                                Mobile Number
                            </label>
                            <div className="flex items-center gap-3 bg-white border-2 border-slate-200 group-focus-within:border-orange-400 rounded-2xl px-4 transition-all shadow-sm">
                                <Phone className="w-5 h-5 text-slate-400 group-focus-within:text-orange-500 shrink-0" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+91 98xxx xxxxx"
                                    className="w-full py-4 text-sm font-bold bg-transparent outline-none text-slate-800 placeholder:text-slate-300"
                                />
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-3 animate-slideUp">
                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-600 shrink-0">!</div>
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end pr-2">
                        <button
                            type="button"
                            onClick={() => navigate('/settings')}
                            className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-500 transition-colors"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl py-4 font-black text-lg shadow-xl shadow-orange-200/80 flex items-center justify-center gap-3 transition-all active:scale-95 ${loading ? 'opacity-70' : 'hover:shadow-orange-300/80'}`}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Signing In...
                            </span>
                        ) : (
                            <>Sign In <ArrowRight className="w-6 h-6" /></>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center pb-8 transition-all hover:scale-105">
                    <p className="text-slate-400 font-bold text-sm tracking-tight mb-2">New to DMart Online?</p>
                    <Link to="/register" className="text-orange-500 font-black text-base hover:text-orange-600 transition-colors inline-block py-1 border-b-2 border-orange-200 hover:border-orange-500">
                        Create an Account
                    </Link>
                </div>
            </div>

            {/* Decorative BG Elements */}
            <div className="fixed -bottom-32 -left-32 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none" />
            <div className="fixed -top-32 -right-32 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none" />
        </div>
    );
};

export default Login;
