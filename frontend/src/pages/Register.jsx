import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, ChevronLeft, ArrowRight, CheckCircle } from 'lucide-react';
import api from '../utils/api';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

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
            const response = await api.post('/users/register', formData);
            if (response.data.id) {
                localStorage.setItem('sfContactId', response.data.id);
                localStorage.setItem('userName', `${formData.firstName} ${formData.lastName}`);
                localStorage.setItem('userEmail', formData.email);
            } else {
                // Demo mode fallback
                localStorage.setItem('sfContactId', 'DEMO_' + Date.now());
                localStorage.setItem('userName', `${formData.firstName} ${formData.lastName}`);
                localStorage.setItem('userEmail', formData.email);
            }
        } catch (err) {
            // Works offline — save to localStorage
            localStorage.setItem('sfContactId', 'DEMO_' + Date.now());
            localStorage.setItem('userName', `${formData.firstName} ${formData.lastName}`);
            localStorage.setItem('userEmail', formData.email);
        }

        setSuccess(true);
        setLoading(false);
        setTimeout(() => navigate('/home'), 1500);
    };

    // eslint-disable-next-line no-unused-vars
    const InputRow = ({ icon: Icon, type, name, placeholder, label, required = false }) => (
        <div className="relative group mb-5">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 absolute left-4 -top-2.5 bg-white px-2 z-10 transition-colors group-focus-within:text-green-600">
                {label} {required && <span className="text-green-500">*</span>}
            </label>
            <div className="flex items-center gap-3 bg-slate-50 border-2 border-slate-100 group-focus-within:border-green-400 group-focus-within:bg-white rounded-2xl px-4 transition-all">
                <Icon className="w-5 h-5 text-slate-400 group-focus-within:text-green-600 shrink-0" />
                <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full py-4 text-sm font-bold bg-transparent outline-none text-slate-800 placeholder:text-slate-300"
                    required={required}
                />
            </div>
        </div>
    );

    if (success) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8 animate-fadeIn">
                <div className="w-28 h-28 bg-green-50 rounded-full flex items-center justify-center mb-8 border-4 border-green-100 shadow-2xl shadow-green-100 animate-bounce">
                    <CheckCircle className="w-14 h-14 text-green-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Account Created!</h2>
                <p className="text-slate-500 font-medium text-lg text-center">Welcome to DMart Online, {formData.firstName}! Taking you to the store...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white px-8 pt-10 pb-12 animate-fadeIn overflow-x-hidden relative">
            <button onClick={() => navigate('/login')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 mb-8 active:scale-90 transition-all">
                <ChevronLeft className="w-6 h-6 text-slate-700" />
            </button>

            <div className="mb-8">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                    Create <br /><span className="text-green-600">Account</span>
                </h1>
                <p className="text-slate-500 font-medium">Join DMart Online and start shopping fresh groceries.</p>
            </div>

            <form onSubmit={handleRegister}>
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <InputRow icon={User} type="text" name="firstName" placeholder="First" label="First Name" required />
                    </div>
                    <div className="w-1/2">
                        <InputRow icon={User} type="text" name="lastName" placeholder="Last" label="Last Name" required />
                    </div>
                </div>

                <InputRow icon={Mail} type="email" name="email" placeholder="you@example.com" label="Email Address" required />
                <InputRow icon={Phone} type="tel" name="phone" placeholder="+91 XXXXX XXXXX" label="Mobile Number" required />
                <InputRow icon={Lock} type="password" name="password" placeholder="Min 6 characters" label="Password" required />
                <InputRow icon={Lock} type="password" name="confirmPassword" placeholder="Confirm password" label="Confirm Password" required />

                {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold mb-6">
                        <span className="mr-2">⚠️</span>{error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-slate-900 text-white rounded-2xl py-4 font-black text-lg shadow-2xl shadow-slate-200/50 flex items-center justify-center gap-3 transition-all active:scale-95 mt-2 ${loading ? 'opacity-70' : 'hover:bg-slate-800'}`}
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

            <div className="mt-8 text-center">
                <p className="text-slate-400 font-bold tracking-tight mb-1">Already have an account?</p>
                <Link to="/login" className="text-green-600 font-black text-lg hover:underline decoration-4 underline-offset-4">
                    Sign In →
                </Link>
            </div>

            <div className="absolute top-0 right-0 -translate-y-24 translate-x-24 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-30 -z-10 pointer-events-none" />
        </div>
    );
};

export default Register;
