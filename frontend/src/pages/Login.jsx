import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Phone, ChevronLeft, ChevronRight, ArrowRight, Lock, ShoppingBag, MapPin, CheckCircle2 } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import api, { logActivity } from '../utils/api';

const Login = () => {
    const [mode, setMode] = useState('email'); // 'email' | 'phone'
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [countryCode, setCountryCode] = useState('+91');
    const [showCompleteProfile, setShowCompleteProfile] = useState(false);
    const [pendingUser, setPendingUser] = useState(null);
    const [formData, setFormData] = useState({ mob: '', flat: '', street: '', city: '', pin: '' });
    const [pendingPhoto, setPendingPhoto] = useState(null);
    const [isGoogleLogin, setIsGoogleLogin] = useState(false);

    const completeLogin = (u, loginMode, identifier, photoUrl) => {
        localStorage.setItem('sfContactId', u.id);
        localStorage.setItem('userName', u.name || 'DMart User');
        localStorage.setItem('userEmail', u.email || '');
        if (u.phone) localStorage.setItem('userPhone', u.phone);
        if (u.address) {
            localStorage.setItem('userAddress', u.address);
            try {
                const parsed = JSON.parse(u.address);
                if (Array.isArray(parsed)) {
                    localStorage.setItem('dmartAddresses', u.address);
                }
            } catch (e) {
                console.warn('Failed to parse address data', e);
            }
        }
        if (u.paymentMethods) {
            try {
                const parsed = JSON.parse(u.paymentMethods);
                if (Array.isArray(parsed)) {
                    localStorage.setItem('dmartPayments', u.paymentMethods);
                }
            } catch (e) {
                console.warn('Failed to parse payment data', e);
            }
        }
        if (loginMode === 'phone' && identifier) localStorage.setItem('userPhone', identifier);
        if (photoUrl) localStorage.setItem('userPhoto', photoUrl);
        
        // Save password if logging in via email
        if (loginMode === 'email' && identifier && password) {
            const normalizedEmail = identifier.toLowerCase();
            const savedCredentialsStr = localStorage.getItem('dmartCredentials');
            const savedCredentials = savedCredentialsStr ? JSON.parse(savedCredentialsStr) : {};
            savedCredentials[normalizedEmail] = password;
            localStorage.setItem('dmartCredentials', JSON.stringify(savedCredentials));
        }
        
        logActivity(u.id, loginMode === 'google' ? 'GOOGLE_LOGIN' : 'LOGIN', '/login', `User logged in`);
        navigate('/home');
    };

    const countries = [
        { code: '+91', name: 'India', flag: '🇮🇳' },
        { code: '+1', name: 'USA/Canada', flag: '🇺🇸' },
        { code: '+44', name: 'UK', flag: '🇬🇧' },
        { code: '+971', name: 'UAE', flag: '🇦🇪' },
        { code: '+61', name: 'Australia', flag: '🇦🇺' },
        { code: '+65', name: 'Singapore', flag: '🇸🇬' }
    ];

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');

        if (mode === 'phone') {
            if (!/^\d{10}$/.test(phone)) {
                setError('Please enter a valid 10-digit mobile number.');
                setLoading(false);
                return;
            }
        }

        if (mode === 'email') {
            if (!email.trim()) {
                setError('Please enter your email address to continue.');
                setLoading(false);
                return;
            }
            if (!password) {
                setError('Please enter your password.');
                setLoading(false);
                return;
            }
            
            // Password verification using localStorage
            const savedCredentialsStr = localStorage.getItem('dmartCredentials');
            const savedCredentials = savedCredentialsStr ? JSON.parse(savedCredentialsStr) : {};
            const normalizedEmail = email.trim().toLowerCase();
            
            if (savedCredentials[normalizedEmail]) {
                if (savedCredentials[normalizedEmail] !== password) {
                    setError('Incorrect password for this email address.');
                    setLoading(false);
                    return;
                }
            } else {
                setError('Invalid credentials or user not found on this device.');
                setLoading(false);
                return;
            }
        }

        const identifier = mode === 'email' ? email.trim() : `${countryCode}${phone.trim()}`;

        try {
            const loginData = mode === 'email' ? { identifier, password } : { identifier };
            const response = await api.post('/DmartUserAPI_v2/login', loginData);
            const u = response.data.user;
            if (u) {
                if (!u.phone || !u.address) {
                    setPendingUser(u);
                    setPendingPhoto(null);
                    setIsGoogleLogin(false);
                    setShowCompleteProfile(true);
                } else {
                    completeLogin(u, mode, identifier, null);
                }
            } else {
                setError(response.data.message || 'User not found in Salesforce');
            }
        } catch (err) {
            console.error("Salesforce Login Error:", err);
            setError(err.response?.data?.message || err.message || 'Salesforce Error. Check Backend .env Config.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;
            const idToken = await firebaseUser.getIdToken();

            const response = await api.post('/DmartUserAPI_v2/google-login', {
                idToken: idToken
            });

            const u = response.data.user;
            if (u) {
                if (!u.phone || !u.address) {
                    setPendingUser(u);
                    setPendingPhoto(firebaseUser.photoURL);
                    setIsGoogleLogin(true);
                    setShowCompleteProfile(true);
                } else {
                    completeLogin(u, 'google', null, firebaseUser.photoURL);
                }
            } else {
                setError(response.data.message || 'User not found in Salesforce');
            }
        } catch (err) {
            console.error("Google/Salesforce Login Error:", err);
            setError(err.response?.data?.message || err.message || 'Google Sign-In failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.mob || !formData.flat || !formData.city || !formData.pin || (isGoogleLogin && !formData.password)) {
            setError('Please fill all required fields.');
            setLoading(false);
            return;
        }

        if (isGoogleLogin && (!formData.password || formData.password.length < 6)) {
            setError('Password must be at least 6 characters.');
            setLoading(false);
            return;
        }

        if (!/^\d{10}$/.test(formData.mob.replace(/\D/g, ''))) {
            setError('Please enter a valid 10-digit mobile number.');
            setLoading(false);
            return;
        }

        try {
            const formattedPhone = formData.mob.replace(/\D/g, '').slice(0, 10);
            const newAddress = {
                id: Date.now(),
                type: 'home',
                name: pendingUser?.name || 'DMart User',
                flat: formData.flat,
                street: formData.street,
                city: formData.city,
                pin: formData.pin,
                phone: formattedPhone,
                default: true
            };

            const response = await api.post('/DmartUserAPI_v2/update-profile', {
                userId: pendingUser.id,
                phone: formattedPhone,
                address: JSON.stringify([newAddress]),
                password: isGoogleLogin ? formData.password : undefined
            });
            const updatedUser = response.data.user;
            if (updatedUser) {
                completeLogin(updatedUser, pendingPhoto ? 'google' : mode, null, pendingPhoto);
            } else {
                setError('Failed to update profile.');
            }
        } catch (err) {
            console.error("Profile Update Error:", err);
            setError(err.response?.data?.message || err.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    if (showCompleteProfile) {
        return (
            <div className="h-full bg-slate-50 px-6 sm:px-8 pt-6 pb-6 animate-fadeIn relative overflow-hidden flex flex-col justify-center max-w-[480px] mx-auto">
                <div className="z-10 w-full max-w-[360px] mx-auto">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border-2 border-green-200">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Almost There!</h1>
                        <p className="text-slate-500 font-bold text-sm">Please provide your contact details to complete your profile.</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border-2 border-red-100 text-red-600 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-center animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleCompleteProfile} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Mobile Number</label>
                            <input type="tel" maxLength="10" value={formData.mob} onChange={e => setFormData({ ...formData, mob: e.target.value.replace(/\D/g, '').slice(0, 10) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-green-500 outline-none transition-all" placeholder="10-digit number" />
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

                        {isGoogleLogin && (
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Set a Password (For Email Login)</label>
                                <input type="password" value={formData.password || ''} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-green-500 outline-none transition-all" placeholder="Min 6 characters" />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl py-4 font-black text-base shadow-lg shadow-green-200 flex items-center justify-center gap-3 transition-all active:scale-95 ${loading ? 'opacity-70' : 'hover:shadow-green-300'}`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </span>
                            ) : (
                                <>Save & Continue <ArrowRight className="w-5 h-5" /></>
                            )}
                        </button>
                    </form>
                </div>
                <div className="fixed -top-32 -right-32 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none" />
            </div>
        );
    }

    return (
        <div className="h-full bg-slate-50 px-6 sm:px-8 pt-4 pb-4 animate-fadeIn relative overflow-hidden flex flex-col justify-between max-w-[480px] mx-auto">
            <header className="flex items-center justify-between mb-2 z-10">
                <button
                    onClick={() => navigate('/')}
                    className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 hover:text-orange-500 transition-all active:scale-90 border border-slate-100"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            </header>

            <div className="flex-1 flex flex-col justify-center z-10 w-full max-w-[360px] mx-auto">
                <div className="text-center mb-4">
                    <div className="relative w-16 h-16 mx-auto mb-2 flex items-center justify-center group">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl rotate-3 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-green-200 opacity-90"></div>
                        <div className="absolute inset-0 bg-white rounded-2xl -rotate-3 group-hover:-rotate-0 transition-all duration-300 shadow-inner flex items-center justify-center overflow-hidden border-4 border-green-50">
                            <div className="flex flex-col items-center">
                                <ShoppingBag className="w-6 h-6 text-emerald-500 mb-0.5" strokeWidth={2.5} />
                                <span className="font-black text-emerald-600 text-[12px] leading-none tracking-tighter">DMART</span>
                            </div>
                        </div>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Sign In</h1>
                    <p className="text-slate-400 font-bold text-[11px] tracking-tight px-4">Access your DMart account securely.</p>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 border-2 border-red-100 text-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-center animate-shake">
                        {error}
                    </div>
                )}

                <div className="mb-3 text-center bg-blue-50 border border-blue-100 py-2 px-4 rounded-xl">
                    <p className="text-blue-600 font-bold text-[11px]">First time here? Please sign up with Google.</p>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className={`w-full bg-white border-2 border-slate-200 text-slate-700 rounded-xl py-2.5 font-bold text-sm flex items-center justify-center gap-3 transition-all ${loading ? 'opacity-70' : 'hover:border-slate-300 hover:bg-slate-50 active:scale-95'} mb-3`}
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                <div className="relative flex items-center py-1.5 mb-3">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-400 text-[9px] font-bold uppercase tracking-widest">Or login with</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <div className="bg-slate-100 p-1 rounded-[16px] flex mb-4 border border-slate-200/50">
                    <button
                        onClick={() => setMode('email')}
                        className={`flex-1 py-2.5 text-sm font-black rounded-[16px] transition-all ${mode === 'email' ? 'bg-white text-orange-600 shadow-sm shadow-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Email
                    </button>
                    <button
                        onClick={() => setMode('phone')}
                        className={`flex-1 py-2.5 text-sm font-black rounded-[16px] transition-all ${mode === 'phone' ? 'bg-white text-orange-600 shadow-sm shadow-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Phone
                    </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {mode === 'email' ? (
                        <div className="space-y-2.5">
                            <div className="relative group">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 absolute left-3 -top-1.5 bg-slate-50 px-1.5 z-10 transition-colors group-focus-within:text-orange-500">
                                    Email Address
                                </label>
                                <div className="flex items-center gap-3 bg-white border-2 border-slate-200 group-focus-within:border-orange-400 rounded-xl px-4 transition-all shadow-sm">
                                    <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-orange-500 shrink-0" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full py-2.5 text-sm font-bold bg-transparent outline-none text-slate-800 placeholder:text-slate-300"
                                    />
                                </div>
                            </div>

                            <div className="relative group">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 absolute left-3 -top-1.5 bg-slate-50 px-1.5 z-10 transition-colors group-focus-within:text-orange-500">
                                    Password
                                </label>
                                <div className="flex items-center gap-3 bg-white border-2 border-slate-200 group-focus-within:border-orange-400 rounded-xl px-4 transition-all shadow-sm">
                                    <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-orange-500 shrink-0" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full py-2.5 text-sm font-bold bg-transparent outline-none text-slate-800 placeholder:text-slate-300"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            <div className="relative group">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 absolute left-3 -top-1.5 bg-slate-50 px-1.5 z-10 transition-colors group-focus-within:text-orange-500">
                                    Phone Number
                                </label>
                                <div className="flex items-center gap-2 bg-white border-2 border-slate-200 group-focus-within:border-orange-400 rounded-xl pl-3 pr-4 transition-all shadow-sm">
                                    <div className="relative flex items-center border-r border-slate-200 pr-2">
                                        <select
                                            value={countryCode}
                                            onChange={(e) => setCountryCode(e.target.value)}
                                            className="appearance-none bg-transparent outline-none text-sm font-black text-slate-800 cursor-pointer py-2 pr-5 z-10"
                                        >
                                            {countries.map(c => (
                                                <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                                            ))}
                                        </select>
                                        <ChevronRight className="w-3 h-3 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 rotate-90" />
                                    </div>
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength="10"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        placeholder="9876543210"
                                        className="w-full py-2.5 text-sm font-bold bg-transparent outline-none text-slate-800 placeholder:text-slate-300 tracking-widest"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full mt-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl py-2.5 font-black text-sm shadow-lg shadow-orange-200 flex items-center justify-center gap-2 transition-all active:scale-95 ${loading ? 'opacity-70' : 'hover:shadow-orange-300'}`}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Connecting...
                            </span>
                        ) : (
                            <>Confirm Sign In <ArrowRight className="w-4 h-4" /></>
                        )}
                    </button>
                </form>
            </div>

            <div className="mt-auto text-center pt-2 relative z-10 pb-1">
                <p className="text-slate-400 font-bold text-[11px] tracking-tight mb-0.5">Want to join DMart?</p>
                <Link to="/register" className="text-orange-500 font-black text-[13px] hover:text-orange-600 transition-colors inline-block py-0.5 border-b-2 border-orange-200 hover:border-orange-500">
                    Create an Account
                </Link>
            </div>
            <div className="fixed -top-32 -right-32 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none" />
        </div>
    );
};

export default Login;
