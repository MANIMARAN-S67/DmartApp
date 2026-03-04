import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShieldCheck, ArrowLeft, ArrowRight, CheckCircle,
    Loader2, Lock, CreditCard, Smartphone, Wallet,
    Package, ChevronRight, BadgeCheck, Zap, Tag,
} from 'lucide-react';
import api from '../utils/api';

/* ─── UPI app options ─── */
const UPI_APPS = [
    {
        id: 'GPay',
        label: 'Google Pay',
        color: 'from-white to-slate-50',
        border: 'border-blue-100',
        logo: (
            <svg viewBox="0 0 48 48" className="w-8 h-8">
                <path fill="#4285F4" d="M24 9.5c3.4 0 6.4 1.2 8.8 3.1l6.6-6.6C35.3 2.3 30 0 24 0 14.6 0 6.6 5.3 2.6 13.1l7.7 6C12.1 13 17.7 9.5 24 9.5z" />
                <path fill="#34A853" d="M46.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8C43.8 37.6 46.5 31.5 46.5 24.5z" />
                <path fill="#FBBC05" d="M10.3 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-7.7-6C.9 16.6 0 20.2 0 24s.9 7.4 2.6 10.6l7.7-6z" />
                <path fill="#EA4335" d="M24 48c6 0 11.1-2 14.8-5.4l-7.5-5.8c-2 1.4-4.6 2.2-7.3 2.2-6.3 0-11.9-3.5-14.3-8.7l-7.7 6C6.6 42.7 14.6 48 24 48z" />
            </svg>
        ),
    },
    {
        id: 'PhonePe',
        label: 'PhonePe',
        color: 'from-purple-600 to-indigo-700',
        border: 'border-purple-200',
        logo: (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center">
                <span className="text-white font-black text-xs">Pe</span>
            </div>
        ),
    },
    {
        id: 'Paytm',
        label: 'Paytm',
        color: 'from-sky-400 to-blue-500',
        border: 'border-sky-200',
        logo: (
            <div className="w-8 h-8 rounded-xl bg-sky-500 flex items-center justify-center">
                <span className="text-white font-black text-[10px]">Pay</span>
            </div>
        ),
    },
    {
        id: 'Other',
        label: 'Other UPI',
        color: 'from-slate-100 to-slate-200',
        border: 'border-slate-200',
        logo: (
            <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-slate-600" />
            </div>
        ),
    },
];

const WALLETS = [
    { id: 'paytm_w', label: 'Paytm Wallet', emoji: '💙', cashback: '₹5 cashback' },
    { id: 'amazon', label: 'Amazon Pay', emoji: '🛒', cashback: '2% back' },
    { id: 'mobikwik', label: 'MobiKwik', emoji: '💜', cashback: '₹3 cashback' },
];

/* ══════════════════════════════════════════════════════ */
const Payment = () => {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('dmartCart') || '[]'));
    const [status, setStatus] = useState('idle');
    const [payMethod, setPayMethod] = useState('');
    const [upiApp, setUpiApp] = useState('GPay');
    const [wallet, setWallet] = useState('');
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [saveCard, setSaveCard] = useState(false);
    const navigate = useNavigate();

    const subtotal = cart.reduce((a, i) => a + i.qty * i.price, 0);
    const gst = Math.round(subtotal * 0.05);
    const delivery = subtotal > 499 ? 0 : 56;
    const total = subtotal + delivery + gst;
    const savings = cart.reduce((a, i) => a + ((i.mrp || i.price) - i.price) * i.qty, 0);

    useEffect(() => {
        if (cart.length === 0 && status === 'idle') navigate('/products');
    }, [cart, status, navigate]);

    const isPayReady = () => {
        if (!payMethod) return false;
        if (payMethod === 'CARD' && (!cardNumber || !cardExpiry || !cardCvv || !cardName)) return false;
        return true;
    };

    const handlePayment = async () => {
        if (!isPayReady()) return;
        const contactId = localStorage.getItem('sfContactId');
        if (!contactId) {
            localStorage.setItem('sfContactId', 'DEMO_' + Date.now());
            localStorage.setItem('userName', 'Guest User');
        }
        setStatus('processing');

        let paymentModeName = '';
        if (payMethod === 'UPI') paymentModeName = `UPI (${upiApp})`;
        else if (payMethod === 'CARD') paymentModeName = 'Credit/Debit Card';
        else if (payMethod === 'WALLET') paymentModeName = wallet ? WALLETS.find(w => w.id === wallet)?.label || 'Wallet' : 'Wallet';
        else paymentModeName = 'Pay on Delivery';
        localStorage.setItem('lastPaymentMethod', paymentModeName);
        localStorage.setItem('dmartLastCart', localStorage.getItem('dmartCart') || '[]');

        const finalize = (orderId) => {
            localStorage.setItem('lastOrderId', orderId);
            localStorage.setItem('lastOrderTotal', total.toString());
            localStorage.removeItem('dmartCart');
            setCart([]);
            setStatus('success');
            setTimeout(() => navigate('/order-success'), 1500);
        };

        try {
            const cId = localStorage.getItem('sfContactId');
            const res = await api.post('/orders', { contactId: cId, totalAmount: total, items: cart });
            finalize(res.data?.orderId || 'DM-' + Math.floor(Math.random() * 90000 + 10000));
        } catch {
            finalize('DM-' + Math.floor(Math.random() * 90000 + 10000));
        }
    };

    const formatCard = (v) => v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);

    /* ── Success screen ── */
    if (status === 'success') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-100 border-4 border-green-100 animate-bounce">
                    <CheckCircle className="w-14 h-14 text-green-500" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">Payment <span className="text-green-600">Successful!</span></h2>
                <p className="text-slate-500 font-medium text-base mb-6">Your order is confirmed. Redirecting…</p>
                <div className="w-8 h-8 border-4 border-green-100 border-t-green-500 rounded-full animate-spin" />
            </div>
        );
    }

    /* ── Main ── */
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col font-sans" style={{ maxWidth: 480, margin: '0 auto' }}>

            {/* ── HERO HEADER ── */}
            <div className="bg-gradient-to-br from-red-700 via-red-600 to-orange-500 pt-12 pb-20 px-5 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 24px 24px, white 2px, transparent 0)', backgroundSize: '48px 48px' }} />
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
                <div className="absolute top-6 right-12 w-20 h-20 bg-white/5 rounded-full" />

                <div className="relative z-10 flex items-center gap-3 mb-6">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white border border-white/30 active:scale-90 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-white leading-tight">Secure Payment</h1>
                        <p className="text-red-100 text-xs font-bold">256-bit SSL encrypted checkout</p>
                    </div>
                    <div className="ml-auto w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center border border-white/30">
                        <Lock className="w-4 h-4 text-white" />
                    </div>
                </div>

                {/* Trust badges */}
                <div className="relative z-10 flex gap-2 flex-wrap">
                    {['🔒 SSL Secured', '✅ 100% Safe', '💳 PCI Compliant'].map(b => (
                        <span key={b} className="bg-white/20 border border-white/30 text-white text-[10px] font-black px-3 py-1 rounded-full backdrop-blur-sm">{b}</span>
                    ))}
                </div>
            </div>

            {/* ── SCROLLABLE CONTENT ── */}
            <div className="flex-1 overflow-y-auto -mt-12 pb-36">

                {/* ── Order Summary Card ── */}
                <div className="mx-4 mb-4 bg-white rounded-3xl shadow-lg overflow-hidden">
                    <div className="px-5 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Package className="w-3.5 h-3.5 text-orange-400" /> Order Summary
                        </span>
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="px-5 py-4 space-y-2.5">
                        <div className="flex justify-between text-sm">
                            <span className="font-bold text-slate-500">Cart Value ({cart.length} items)</span>
                            <span className="font-black text-slate-800">₹{subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-bold text-slate-500">GST (5%)</span>
                            <span className="font-bold text-slate-700">₹{gst.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-bold text-slate-500">Delivery Fee</span>
                            <span className={`font-black ${delivery === 0 ? 'text-green-600' : 'text-slate-700'}`}>
                                {delivery === 0 ? 'FREE 🎉' : `₹${delivery}`}
                            </span>
                        </div>
                        {savings > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="font-bold text-green-600 flex items-center gap-1"><Tag className="w-3 h-3" />You Save</span>
                                <span className="font-black text-green-600">–₹{savings.toLocaleString('en-IN')}</span>
                            </div>
                        )}
                        <div className="h-px bg-slate-100 my-1" />
                        <div className="flex justify-between items-center">
                            <span className="text-base font-black text-slate-900">To Pay</span>
                            <div className="text-right">
                                <span className="text-2xl font-black text-slate-900">₹{total.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Payment Methods ── */}
                <div className="mx-4 mb-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-3">Choose Payment Method</p>

                    {/* ── UPI ── */}
                    <div
                        onClick={() => setPayMethod('UPI')}
                        className={`bg-white rounded-2xl mb-3 border-2 transition-all cursor-pointer overflow-hidden ${payMethod === 'UPI' ? 'border-red-500 shadow-lg shadow-red-100' : 'border-transparent shadow-sm'}`}
                    >
                        <div className="px-4 py-4 flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="font-black text-slate-800 text-sm">UPI / QR Pay</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-0.5">GPay · PhonePe · Paytm · Any UPI</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${payMethod === 'UPI' ? 'border-red-500 bg-red-500' : 'border-slate-200'}`}>
                                {payMethod === 'UPI' && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                        </div>

                        {payMethod === 'UPI' && (
                            <div className="px-4 pb-4 border-t border-slate-50 pt-3 space-y-4">
                                {/* UPI App Selector */}
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Select App</p>
                                    <div className="grid grid-cols-4 gap-2">
                                        {UPI_APPS.map(app => (
                                            <button
                                                key={app.id}
                                                onClick={(e) => { e.stopPropagation(); setUpiApp(app.id); }}
                                                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border-2 transition-all active:scale-95 ${upiApp === app.id ? 'border-red-500 bg-red-50 shadow-md shadow-red-100' : 'border-slate-100 bg-white'}`}
                                            >
                                                {app.logo}
                                                <span className="text-[9px] font-black text-slate-700 leading-tight text-center">{app.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* UPI ID input */}
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Or Enter UPI ID</p>
                                    <div className="flex gap-2">
                                        <input
                                            value={upiId}
                                            onChange={e => setUpiId(e.target.value)}
                                            onClick={e => e.stopPropagation()}
                                            placeholder="yourname@upi"
                                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-red-400 focus:bg-white transition-all"
                                        />
                                        <button onClick={e => e.stopPropagation()} className="bg-red-600 text-white text-xs font-black px-3 rounded-xl active:scale-95 transition-all">Verify</button>
                                    </div>
                                </div>

                                {/* QR hint */}
                                <div className="bg-slate-900 rounded-2xl p-4 flex gap-3 items-center">
                                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shrink-0">
                                        <img
                                            src="data:image/png;base64,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"
                                            alt="QR"
                                            className="w-12 h-12"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">Scan & Pay</p>
                                        <p className="text-white font-bold text-xs leading-snug mt-0.5">Scan with {upiApp} to pay ₹{total.toLocaleString('en-IN')}</p>
                                        <div className="flex gap-1.5 mt-1.5">
                                            <span className="bg-white/20 text-white text-[9px] font-black px-2 py-0.5 rounded-full">Instant</span>
                                            <span className="bg-white/20 text-white text-[9px] font-black px-2 py-0.5 rounded-full">No Charges</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Credit/Debit Card ── */}
                    <div
                        onClick={() => setPayMethod('CARD')}
                        className={`bg-white rounded-2xl mb-3 border-2 transition-all cursor-pointer overflow-hidden ${payMethod === 'CARD' ? 'border-red-500 shadow-lg shadow-red-100' : 'border-transparent shadow-sm'}`}
                    >
                        <div className="px-4 py-4 flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md">
                                <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="font-black text-slate-800 text-sm">Credit / Debit Card</p>
                                <div className="flex gap-1 mt-0.5">
                                    {['VISA', 'MC', 'RuPay', 'Amex'].map(n => (
                                        <span key={n} className="text-[8px] font-black text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{n}</span>
                                    ))}
                                </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${payMethod === 'CARD' ? 'border-red-500 bg-red-500' : 'border-slate-200'}`}>
                                {payMethod === 'CARD' && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                        </div>

                        {payMethod === 'CARD' && (
                            <div className="px-4 pb-4 border-t border-slate-50 pt-3 space-y-3" onClick={e => e.stopPropagation()}>
                                {/* Card Preview */}
                                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl p-4 text-white relative overflow-hidden mb-3">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                    <p className="text-[9px] font-black opacity-60 uppercase tracking-widest mb-2">Your Card</p>
                                    <p className="font-black text-lg tracking-[0.18em] mb-3">
                                        {cardNumber ? cardNumber : '•••• •••• •••• ••••'}
                                    </p>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[9px] opacity-60 uppercase">Card Holder</p>
                                            <p className="font-black text-sm">{cardName || 'YOUR NAME'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] opacity-60 uppercase">Expires</p>
                                            <p className="font-black text-sm">{cardExpiry || 'MM/YY'}</p>
                                        </div>
                                    </div>
                                </div>

                                <input
                                    value={cardNumber}
                                    onChange={e => setCardNumber(formatCard(e.target.value))}
                                    placeholder="Card Number  •  16 digits"
                                    maxLength={19}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-red-400 focus:bg-white transition-all tracking-widest"
                                />
                                <div className="flex gap-3">
                                    <input
                                        value={cardExpiry}
                                        onChange={e => setCardExpiry(e.target.value)}
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-red-400 focus:bg-white transition-all"
                                    />
                                    <input
                                        value={cardCvv}
                                        onChange={e => setCardCvv(e.target.value)}
                                        placeholder="CVV"
                                        maxLength={3}
                                        type="password"
                                        className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-red-400 focus:bg-white transition-all"
                                    />
                                </div>
                                <input
                                    value={cardName}
                                    onChange={e => setCardName(e.target.value)}
                                    placeholder="Name on Card"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-red-400 focus:bg-white transition-all"
                                />
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <div
                                        onClick={() => setSaveCard(!saveCard)}
                                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${saveCard ? 'bg-red-500 border-red-500' : 'border-slate-300'}`}
                                    >
                                        {saveCard && <BadgeCheck className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className="text-xs font-bold text-slate-600">Save card for faster checkout</span>
                                </label>
                                <p className="text-[10px] text-slate-400 font-medium"><Lock className="w-3 h-3 inline mr-1" />Demo only — no real payment processed.</p>
                            </div>
                        )}
                    </div>

                    {/* ── Wallets ── */}
                    <div
                        onClick={() => setPayMethod('WALLET')}
                        className={`bg-white rounded-2xl mb-3 border-2 transition-all cursor-pointer overflow-hidden ${payMethod === 'WALLET' ? 'border-red-500 shadow-lg shadow-red-100' : 'border-transparent shadow-sm'}`}
                    >
                        <div className="px-4 py-4 flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-md">
                                <Wallet className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="font-black text-slate-800 text-sm">Digital Wallets</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Paytm · Amazon Pay · MobiKwik</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${payMethod === 'WALLET' ? 'border-red-500 bg-red-500' : 'border-slate-200'}`}>
                                {payMethod === 'WALLET' && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                        </div>

                        {payMethod === 'WALLET' && (
                            <div className="px-4 pb-4 border-t border-slate-50 pt-3 space-y-2" onClick={e => e.stopPropagation()}>
                                {WALLETS.map(w => (
                                    <button
                                        key={w.id}
                                        onClick={() => setWallet(w.id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${wallet === w.id ? 'border-red-400 bg-red-50' : 'border-slate-100 bg-slate-50'}`}
                                    >
                                        <span className="text-2xl">{w.emoji}</span>
                                        <div className="flex-1 text-left">
                                            <p className="text-sm font-black text-slate-800">{w.label}</p>
                                            <p className="text-[10px] text-green-600 font-bold">{w.cashback}</p>
                                        </div>
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${wallet === w.id ? 'border-red-500 bg-red-500' : 'border-slate-300'}`}>
                                            {wallet === w.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Pay on Delivery ── */}
                    <div
                        onClick={() => setPayMethod('COD')}
                        className={`bg-white rounded-2xl mb-3 border-2 transition-all cursor-pointer overflow-hidden ${payMethod === 'COD' ? 'border-red-500 shadow-lg shadow-red-100' : 'border-transparent shadow-sm'}`}
                    >
                        <div className="px-4 py-4 flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                                <Package className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="font-black text-slate-800 text-sm">Pay on Delivery</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Cash · Card · UPI at doorstep</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${payMethod === 'COD' ? 'border-red-500 bg-red-500' : 'border-slate-200'}`}>
                                {payMethod === 'COD' && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                        </div>

                        {payMethod === 'COD' && (
                            <div className="px-4 pb-4 border-t border-slate-50 pt-3">
                                <div className="bg-green-50 border border-green-100 rounded-2xl p-3 space-y-1">
                                    {['💵 Pay with cash when order arrives', '💳 Rider carries card machine', '📲 Show QR code for UPI payment'].map(t => (
                                        <p key={t} className="text-xs font-bold text-green-800">{t}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Security assurance ── */}
                <div className="mx-4 mb-4 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-xs font-black text-blue-800 mb-0.5">Your payment is 100% secure</p>
                        <p className="text-[10px] font-medium text-blue-600 leading-snug">All transactions are encrypted and protected by 256-bit SSL. DMart never stores your card details.</p>
                    </div>
                </div>

                {/* ── Bill items preview ── */}
                {cart.length > 0 && (
                    <div className="mx-4 mb-4 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-3 border-b border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Items in your Order</p>
                        </div>
                        <div className="px-5 py-3 max-h-44 overflow-y-auto space-y-2">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 bg-orange-100 text-orange-600 font-black text-[10px] rounded-md flex items-center justify-center">{item.qty}</span>
                                        <span className="font-medium text-slate-700">{item.name}</span>
                                    </div>
                                    <span className="font-black text-slate-900">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── STICKY PAY BUTTON ── */}
            <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white/80 backdrop-blur-2xl border-t border-slate-100 px-5 py-4 z-50">
                <button
                    onClick={handlePayment}
                    disabled={!isPayReady() || status === 'processing'}
                    className={`w-full h-16 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 ${isPayReady() && status !== 'processing'
                            ? 'bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white shadow-xl shadow-red-200/60 active:scale-95'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    {status === 'processing'
                        ? <><Loader2 className="w-6 h-6 animate-spin" /> Processing…</>
                        : <><ShieldCheck className="w-6 h-6" /> Pay ₹{total.toLocaleString('en-IN')} Securely</>
                    }
                </button>
                {!isPayReady() && (
                    <p className="text-center text-[10px] text-slate-400 font-bold mt-2">Please select a payment method to continue</p>
                )}
            </div>
        </div>
    );
};

export default Payment;
