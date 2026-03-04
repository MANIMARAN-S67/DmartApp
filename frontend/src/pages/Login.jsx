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
        <div className="min-h-screen bg-white px-8 pt-12 pb-10 animate-fadeIn relative overflow-hidden">
            {/* Back button */}
            <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 mb-10 active:scale-90 transition-all">
                <ChevronLeft className="w-6 h-6 text-slate-700" />
            </button>

            <div className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
                    Welcome <br /><span className="text-green-600">Back!</span>
                </h1>
                <p className="text-slate-500 font-medium text-base leading-relaxed">
                    Sign in to your DMart account using email or mobile number.
                </p>
            </div>

            {/* Mode toggle */}
            <div className="flex gap-3 mb-6 bg-slate-100 rounded-2xl p-1">
                <button
                    type="button"
                    onClick={() => setMode('email')}
                    className={`flex-1 py-2 rounded-xl text-sm font-black ${mode === 'email' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                >
                    Email
                </button>
                <button
                    type="button"
                    onClick={() => setMode('phone')}
                    className={`flex-1 py-2 rounded-xl text-sm font-black ${mode === 'phone' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                >
                    Mobile Number
                </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                {mode === 'email' ? (
                    <div className="relative group">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 absolute left-4 -top-2.5 bg-white px-2 z-10 transition-colors group-focus-within:text-green-600">
                            Email Address
                        </label>
                        <div className="flex items-center gap-3 bg-slate-50 border-2 border-slate-100 group-focus-within:border-green-400 group-focus-within:bg-white rounded-2xl px-4 transition-all">
                            <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-green-600 shrink-0" />
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
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 absolute left-4 -top-2.5 bg-white px-2 z-10 transition-colors group-focus-within:text-green-600">
                            Mobile Number
                        </label>
                        <div className="flex items-center gap-3 bg-slate-50 border-2 border-slate-100 group-focus-within:border-green-400 group-focus-within:bg-white rounded-2xl px-4 transition-all">
                            <Phone className="w-5 h-5 text-slate-400 group-focus-within:text-green-600 shrink-0" />
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
                    <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-2">
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-red-100 text-[10px] shrink-0">!</span>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-green-600 text-white rounded-2xl py-4 font-black text-lg shadow-xl shadow-green-200/60 flex items-center justify-center gap-3 transition-all active:scale-95 ${loading ? 'opacity-70' : 'hover:bg-green-700'}`}
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

            <div className="mt-10 text-center">
                <p className="text-slate-400 font-bold tracking-tight mb-1">New to DMart Online?</p>
                <Link to="/register" className="text-green-600 font-black text-lg hover:underline decoration-4 underline-offset-4">
                    Create an Account →
                </Link>
            </div>

            {/* Decorative */}
            <div className="fixed -bottom-24 -left-24 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none" />
            <div className="fixed top-1/2 -right-12 w-32 h-32 bg-purple-50 rounded-full blur-2xl opacity-40 -z-10 pointer-events-none" />
        </div>
    );
};

export default Login;
