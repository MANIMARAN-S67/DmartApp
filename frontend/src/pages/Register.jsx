import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ChevronLeft, ArrowRight, CheckCircle } from 'lucide-react';
import api, { logActivity } from '../utils/api';

// eslint-disable-next-line no-unused-vars
const InputRow = ({ icon: Icon, type, name, placeholder, label, value, onChange, required = false, inputMode }) => (
    <div className="relative group mb-5">
        <label className="text-xs font-black uppercase tracking-widest text-slate-400 absolute left-4 -top-2.5 bg-white px-2 z-10 transition-colors group-focus-within:text-green-600">
            {label} {required && <span className="text-green-500">*</span>}
        </label>
        <div className="flex items-center gap-3 bg-slate-50 border-2 border-slate-100 group-focus-within:border-green-400 group-focus-within:bg-white rounded-2xl px-4 transition-all shadow-sm">
            <Icon className="w-5 h-5 text-slate-400 group-focus-within:text-green-600 shrink-0" />
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                inputMode={inputMode}
                className="w-full py-4 text-base font-bold bg-transparent outline-none text-slate-800 placeholder:text-slate-300"
                required={required}
            />
        </div>
    </div>
);

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '', state: '', password: '', confirmPassword: ''
    });
    const states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
    ];
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const val = value.replace(/\D/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: val }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.state) {
            setError('Please select your state');
            setLoading(false);
            return;
        }

        if (formData.phone.length !== 10 || !/^\d{10}$/.test(formData.phone)) {
            setError('Please enter a correct 10-digit mobile number');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/DmartUserAPI_v2/register', formData);
            const u = response.data.user;
            if (u && u.id) {
                localStorage.setItem('sfContactId', u.id);
                localStorage.setItem('userName', u.name || `${formData.firstName} ${formData.lastName}`);
                localStorage.setItem('userEmail', u.email || formData.email);
                if (u.phone) localStorage.setItem('userPhone', u.phone);
                
                // Save password to enforce on next login
                const normalizedEmail = (u.email || formData.email).toLowerCase();
                const savedCredentialsStr = localStorage.getItem('dmartCredentials');
                const savedCredentials = savedCredentialsStr ? JSON.parse(savedCredentialsStr) : {};
                savedCredentials[normalizedEmail] = formData.password;
                localStorage.setItem('dmartCredentials', JSON.stringify(savedCredentials));

                logActivity(u.id, 'REGISTER', '/register', `New user registered: ${formData.email}`);
                setSuccess(true);
            } else {
                setError(response.data.message || 'Registration failed');
            }
        } catch (err) {
            console.error("Salesforce Registration Error:", err);
            setError(err.response?.data?.message || 'Salesforce Connection Failed. Check Backend .env Config.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        setTimeout(() => navigate('/home'), 2000);
        return (
            <div className="min-h-full bg-white flex flex-col items-center justify-center px-8 animate-fadeIn">
                <div className="w-28 h-28 bg-green-50 rounded-full flex items-center justify-center mb-8 border-4 border-green-100 shadow-2xl shadow-green-100 animate-bounce">
                    <CheckCircle className="w-14 h-14 text-green-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Account Created!</h2>
                <p className="text-slate-500 font-medium text-lg text-center">Welcome to DMart Online, {formData.firstName}! Taking you to the store...</p>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-white px-6 pt-10 pb-12 animate-fadeIn overflow-x-hidden relative max-w-[480px] mx-auto">
            <button onClick={() => navigate('/login')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 mb-8 active:scale-90 transition-all">
                <ChevronLeft className="w-6 h-6 text-slate-700" />
            </button>

            <div className="mb-8 pl-1">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                    Create <br /><span className="text-green-600">Account</span>
                </h1>
                <p className="text-slate-500 font-medium">Join DMart Online and start shopping fresh groceries.</p>
            </div>

            <form onSubmit={handleRegister}>
                <InputRow icon={User} type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} label="First Name" required />
                <InputRow icon={User} type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} label="Last Name" required />
                <InputRow icon={Mail} type="email" name="email" placeholder="you@example.com" label="Email Address" value={formData.email} onChange={handleChange} required />

                <div className="relative group mb-5">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 absolute left-4 -top-2.5 bg-white px-2 z-10 transition-colors group-focus-within:text-green-600">
                        Select State <span className="text-green-500">*</span>
                    </label>
                    <div className="flex items-center gap-3 bg-slate-50 border-2 border-slate-100 group-focus-within:border-green-400 group-focus-within:bg-white rounded-2xl px-4 transition-all shadow-sm">
                        <select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full py-4 text-base font-bold bg-transparent outline-none text-slate-800 appearance-none cursor-pointer"
                            required
                        >
                            <option value="">Choose State...</option>
                            {states.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                <div className="relative group mb-5">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 absolute left-4 -top-2.5 bg-white px-2 z-10 transition-colors group-focus-within:text-green-600">
                        Mobile Number <span className="text-green-500">*</span>
                    </label>
                    <div className="flex items-center gap-3 bg-slate-50 border-2 border-slate-100 group-focus-within:border-green-400 group-focus-within:bg-white rounded-2xl px-4 transition-all shadow-sm">
                        <span className="text-slate-800 font-bold border-r border-slate-300 pr-3">+91</span>
                        <input
                            type="tel"
                            maxLength="10"
                            name="phone"
                            placeholder="10 digit number"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                            inputMode="numeric"
                            className="w-full py-4 text-base font-bold bg-transparent outline-none text-slate-800 placeholder:text-slate-300"
                            required
                        />
                    </div>
                </div>

                <InputRow icon={Lock} type="password" name="password" placeholder="Min 6 characters" label="Password" value={formData.password} onChange={handleChange} required />
                <InputRow icon={Lock} type="password" name="confirmPassword" placeholder="Confirm password" label="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />

                {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold mb-6 flex items-center gap-2">
                        <span>⚠️</span>{error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 text-white rounded-2xl py-5 font-black text-lg shadow-2xl shadow-slate-200/50 flex items-center justify-center gap-3 transition-all active:scale-95 mt-2"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            Creating Account...
                        </span>
                    ) : (
                        <>Create Account <ArrowRight className="w-6 h-6" /></>
                    )}
                </button>
            </form>

            <div className="mt-10 text-center">
                <p className="text-slate-400 font-bold tracking-tight mb-1">Already have an account?</p>
                <Link to="/login" className="text-green-600 font-black text-xl hover:underline decoration-4 underline-offset-4">
                    Sign In →
                </Link>
            </div>

            <div className="absolute top-0 right-0 -translate-y-24 translate-x-24 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-30 -z-10 pointer-events-none" />
        </div>
    );
};

export default Register;
