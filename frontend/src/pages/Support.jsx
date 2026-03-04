import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Phone,
    Mail,
    MessageCircle,
    ChevronDown,
    ChevronUp,
    Package,
    RefreshCcw,
    CreditCard,
    Truck,
    ShieldAlert,
    Star,
    MapPin,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Send,
    Store,
    ExternalLink,
    ChevronRight,
    Headphones,
    HelpCircle,
    XCircle,
    Zap,
} from 'lucide-react';

/* ─── data ───────────────────────────────────────── */
const CONTACT_CHANNELS = [
    {
        id: 'call',
        icon: <Phone className="w-6 h-6" />,
        label: 'Call Us',
        sub: '1800-890-0001',
        detail: 'Toll Free · 8 AM – 10 PM, All Days',
        color: 'from-green-500 to-emerald-600',
        action: () => window.open('tel:18008900001'),
    },
    {
        id: 'landline',
        icon: <Phone className="w-6 h-6" />,
        label: 'Landline',
        sub: '022-3340-3340',
        detail: 'Mumbai HQ · Mon–Sat 9 AM – 7 PM',
        color: 'from-blue-500 to-blue-700',
        action: () => window.open('tel:02233403340'),
    },
    {
        id: 'email',
        icon: <Mail className="w-6 h-6" />,
        label: 'Email Support',
        sub: 'care@dmart.in',
        detail: 'Reply within 24–48 hours',
        color: 'from-orange-400 to-red-500',
        action: () => window.open('mailto:care@dmart.in?subject=DMart App Support'),
    },
    {
        id: 'whatsapp',
        icon: <MessageCircle className="w-6 h-6" />,
        label: 'WhatsApp',
        sub: '+91 93220 93220',
        detail: 'Chat instantly · 24×7',
        color: 'from-[#25D366] to-[#128C7E]',
        action: () => window.open('https://wa.me/919322093220'),
    },
];

const ISSUE_CATEGORIES = [
    { id: 'order', icon: <Package className="w-5 h-5" />, label: 'Order Issues', desc: 'Track, cancel or modify order', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { id: 'payment', icon: <CreditCard className="w-5 h-5" />, label: 'Payment & Refund', desc: 'Failed payment, refund status', color: 'bg-green-50 text-green-600 border-green-100' },
    { id: 'delivery', icon: <Truck className="w-5 h-5" />, label: 'Delivery Issues', desc: 'Late, missing or wrong item', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
    { id: 'product', icon: <RefreshCcw className="w-5 h-5" />, label: 'Returns & Exchange', desc: 'Damaged or wrong product', color: 'bg-purple-50 text-purple-600 border-purple-100' },
    { id: 'account', icon: <ShieldAlert className="w-5 h-5" />, label: 'Account & Login', desc: 'Password reset, profile help', color: 'bg-red-50 text-red-600 border-red-100' },
    { id: 'other', icon: <HelpCircle className="w-5 h-5" />, label: 'Other Queries', desc: 'Anything else we can help', color: 'bg-slate-50 text-slate-600 border-slate-200' },
];

const FAQS = [
    {
        q: 'How do I track my order?',
        a: 'Go to Orders → select your order → tap "Track Order". You\'ll see real-time status and rider details.',
    },
    {
        q: 'How long does delivery take?',
        a: 'We deliver within 25–60 minutes for express slots. Standard slots are within the same day. Timing depends on your area and store availability.',
    },
    {
        q: 'My payment was deducted but order was not placed.',
        a: 'Don\'t worry! If your payment was deducted but the order wasn\'t confirmed, the amount will be automatically refunded to your original payment source within 5–7 business days. Call 1800-890-0001 for faster resolution.',
    },
    {
        q: 'How do I return a product?',
        a: 'Open the order in the app → tap "Return / Exchange" → select the item and reason. Our rider will pick it up within 24 hrs. Perishable items must be reported within 2 hours of delivery.',
    },
    {
        q: 'DMart Wallet cashback is not credited?',
        a: 'Cashback is credited within 24 hrs after order delivery. If it\'s been more than 48 hrs, email care@dmart.in with your order ID.',
    },
    {
        q: 'Can I change my delivery address after placing the order?',
        a: 'You can modify the address within 5 minutes of placing the order by calling our support line 1800-890-0001 immediately.',
    },
    {
        q: 'What are DMart store timings?',
        a: 'Most DMart stores are open 8:00 AM – 10:00 PM, 7 days a week including public holidays. Some locations may vary.',
    },
    {
        q: 'How do I get an invoice or GST receipt?',
        a: 'Tap "View e-Receipt" in your Order Success page or go to Orders → select order → Download Invoice.',
    },
];

const STORES = [
    { name: 'DMart – Lower Parel', phone: '022-2490-1111', hours: '8 AM – 10 PM', city: 'Mumbai' },
    { name: 'DMart – Thane West', phone: '022-2580-2222', hours: '8 AM – 10 PM', city: 'Thane' },
    { name: 'DMart – Andheri East', phone: '022-2683-3333', hours: '8 AM – 10 PM', city: 'Mumbai' },
    { name: 'DMart – Pune Kothrud', phone: '020-2538-4444', hours: '8 AM – 10 PM', city: 'Pune' },
    { name: 'DMart – Ahmedabad SG Hwy', phone: '079-2680-5555', hours: '8 AM – 10 PM', city: 'Ahmedabad' },
    { name: 'DMart – Bengaluru Yelahanka', phone: '080-2855-6666', hours: '8 AM – 10 PM', city: 'Bengaluru' },
];

/* ═══════════════════════════════════════════════════════════ */
const Support = () => {
    const navigate = useNavigate();

    const [activeCategory, setActiveCategory] = useState('');
    const [openFaq, setOpenFaq] = useState(null);
    const [chatMsg, setChatMsg] = useState('');
    const [chatLog, setChatLog] = useState([
        { from: 'bot', text: '👋 Hi! I\'m DMart Support Assistant. How can I help you today?' },
    ]);
    const [callbackName, setCallbackName] = useState('');
    const [callbackPhone, setCallbackPhone] = useState('');
    const [callbackSent, setCallbackSent] = useState(false);
    const [toast, setToast] = useState('');
    const [tab, setTab] = useState('help'); // help | chat | stores

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

    const sendChat = () => {
        if (!chatMsg.trim()) return;
        const userMsg = chatMsg.trim();
        setChatLog(prev => [...prev, { from: 'user', text: userMsg }]);
        setChatMsg('');
        setTimeout(() => {
            let reply = '🤖 Our agent will get back to you shortly. For urgent help, please call 1800-890-0001 (Toll Free).';
            const lower = userMsg.toLowerCase();
            if (lower.includes('order')) reply = '📦 To track your order, go to Orders tab → select your order → Track Order.';
            else if (lower.includes('refund') || lower.includes('payment')) reply = '💳 Refunds are processed within 5–7 business days. Email care@dmart.in with your Order ID for faster help.';
            else if (lower.includes('deliver')) reply = '🚚 Deliveries take 25–60 mins. Track your rider in the Orders tab.';
            else if (lower.includes('return')) reply = '🔄 Open the order → tap Return / Exchange → select reason. Rider picks up within 24 hrs.';
            else if (lower.includes('cancel')) reply = '❌ To cancel: Orders → your order → Cancel Order. Only possible before dispatch.';
            else if (lower.includes('cashback') || lower.includes('wallet')) reply = '🎁 Cashback is credited within 24 hrs of delivery. Check DMart Wallet in your Account page.';
            else if (lower.includes('invoice') || lower.includes('receipt')) reply = '🧾 Tap "View e-Receipt" in Order Success or go to Orders → Download Invoice.';
            setChatLog(prev => [...prev, { from: 'bot', text: reply }]);
        }, 800);
    };

    const requestCallback = () => {
        if (!callbackName.trim() || !callbackPhone.trim()) {
            showToast('Please fill your name and phone number.');
            return;
        }
        setCallbackSent(true);
        showToast('✅ Callback requested! We\'ll call you within 30 mins.');
    };

    /* ─── render ─── */
    return (
        <div className="min-h-screen bg-slate-50 pb-28 font-sans" style={{ maxWidth: 480, margin: '0 auto' }}>

            {/* ── Header ── */}
            <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 pt-12 pb-20 px-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <button onClick={() => navigate(-1)} className="relative z-10 w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center text-white mb-6 active:scale-90 transition-all border border-white/20">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30">
                            <Headphones className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white leading-tight">DMart Support</h1>
                            <p className="text-blue-200 text-xs font-semibold">Helpline · Customer Care · Service</p>
                        </div>
                    </div>
                    <p className="text-blue-100 text-sm font-medium mt-3 leading-relaxed">
                        We're here 24×7 to help with your orders, payments, returns and more.
                    </p>
                    {/* Live indicator */}
                    <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/40 rounded-full px-3 py-1.5 mt-3">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-green-300 text-[11px] font-black uppercase tracking-wide">Support is Live Now</span>
                    </div>
                </div>
            </div>

            {/* ── Quick Contact Cards ── */}
            <div className="px-4 -mt-12 relative z-20 grid grid-cols-2 gap-3 mb-5">
                {CONTACT_CHANNELS.map(ch => (
                    <button
                        key={ch.id}
                        onClick={ch.action}
                        className={`bg-gradient-to-br ${ch.color} rounded-2xl p-4 text-white text-left active:scale-95 transition-all shadow-lg`}
                    >
                        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center mb-3 border border-white/20">
                            {ch.icon}
                        </div>
                        <p className="text-xs font-black uppercase tracking-wide opacity-80 mb-0.5">{ch.label}</p>
                        <p className="text-sm font-black leading-tight">{ch.sub}</p>
                        <p className="text-[10px] opacity-75 font-medium mt-1">{ch.detail}</p>
                    </button>
                ))}
            </div>

            {/* ── Tabs ── */}
            <div className="px-4 mb-4">
                <div className="flex bg-white rounded-2xl p-1 border border-slate-100 shadow-sm gap-1">
                    {[['help', 'Help'], ['chat', 'Live Chat'], ['stores', 'Stores']].map(([id, label]) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${tab === id ? 'bg-blue-900 text-white shadow-md' : 'text-slate-500'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ════════════ TAB: HELP ════════════ */}
            {tab === 'help' && (
                <div className="px-4 space-y-5">

                    {/* Issue Categories */}
                    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 text-yellow-400" /> What do you need help with?
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {ISSUE_CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(activeCategory === cat.id ? '' : cat.id)}
                                    className={`${cat.color} border rounded-2xl p-3.5 text-left transition-all active:scale-95 ${activeCategory === cat.id ? 'ring-2 ring-offset-1 ring-blue-400' : ''}`}
                                >
                                    <div className="mb-2">{cat.icon}</div>
                                    <p className="text-xs font-black leading-tight">{cat.label}</p>
                                    <p className="text-[10px] font-medium opacity-70 mt-0.5 leading-snug">{cat.desc}</p>
                                </button>
                            ))}
                        </div>
                        {activeCategory && (
                            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-4">
                                <p className="text-xs font-black text-blue-700 mb-2 uppercase tracking-wide">
                                    {ISSUE_CATEGORIES.find(c => c.id === activeCategory)?.label}
                                </p>
                                <p className="text-sm text-blue-800 font-medium mb-3">
                                    {activeCategory === 'order' && 'Please call 1800-890-0001 or go to Orders in the app to manage your order status.'}
                                    {activeCategory === 'payment' && 'Failed payments are auto-refunded in 5–7 days. For help: care@dmart.in or call 022-3340-3340.'}
                                    {activeCategory === 'delivery' && 'Call your rider directly from tracking page or contact us at 1800-890-0001 for delivery issues.'}
                                    {activeCategory === 'product' && 'Return a product from Order details within 24 hrs. Perishable items must be reported within 2 hrs.'}
                                    {activeCategory === 'account' && 'Reset password from Login page or email techsupport@dmart.in with your registered mobile number.'}
                                    {activeCategory === 'other' && 'For anything else please reach us via WhatsApp +91 93220 93220 or email care@dmart.in.'}
                                </p>
                                <div className="flex gap-2">
                                    <button onClick={() => window.open('tel:18008900001')} className="flex-1 bg-blue-700 text-white text-xs font-black py-2.5 rounded-xl flex items-center justify-center gap-1 active:scale-95 transition-all">
                                        <Phone className="w-3.5 h-3.5" /> Call Now
                                    </button>
                                    <button onClick={() => setTab('chat')} className="flex-1 bg-white border border-blue-200 text-blue-700 text-xs font-black py-2.5 rounded-xl flex items-center justify-center gap-1 active:scale-95 transition-all">
                                        <MessageCircle className="w-3.5 h-3.5" /> Live Chat
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Emergency contacts */}
                    <div className="bg-red-50 border border-red-100 rounded-3xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <h3 className="text-xs font-black text-red-600 uppercase tracking-widest">Priority / Escalation</h3>
                        </div>
                        <div className="space-y-2.5">
                            {[
                                { label: 'Urgent Orders & Escalation', number: '1800-890-0001', sub: 'Toll Free · Press 1 for Order Issues' },
                                { label: 'Corporate Complaints', number: '022-3340-5000', sub: 'Mon–Fri 10 AM – 6 PM' },
                                { label: 'Food Safety Complaints', number: '1800-110-001', sub: 'FSSAI Helpline (Govt)' },
                                { label: 'Cyber Fraud / Fake Apps', number: '1930', sub: 'National Cyber Crime Helpline' },
                            ].map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => window.open(`tel:${item.number.replace(/\D/g, '')}`)}
                                    className="w-full flex items-center justify-between bg-white rounded-2xl p-3 border border-red-100 active:scale-[0.98] transition-all shadow-sm"
                                >
                                    <div className="text-left">
                                        <p className="text-xs font-black text-slate-800">{item.label}</p>
                                        <p className="text-[10px] font-medium text-slate-500">{item.sub}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 rounded-xl">
                                        <Phone className="w-3 h-3" />
                                        <span className="text-xs font-black">{item.number}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-5 pt-5 pb-3 border-b border-slate-100">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Frequently Asked Questions</h3>
                        </div>
                        {FAQS.map((faq, i) => (
                            <div key={i} className="border-b border-slate-50 last:border-0">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between px-5 py-4 text-left gap-3 active:bg-slate-50 transition-all"
                                >
                                    <span className="text-sm font-bold text-slate-800 leading-snug">{faq.q}</span>
                                    {openFaq === i
                                        ? <ChevronUp className="w-4 h-4 text-blue-500 shrink-0" />
                                        : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                                </button>
                                {openFaq === i && (
                                    <div className="px-5 pb-4">
                                        <p className="text-sm text-slate-600 font-medium leading-relaxed bg-blue-50 rounded-2xl p-3 border border-blue-100">{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Request Callback */}
                    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-green-500" /> Request a Callback
                        </h3>
                        {callbackSent ? (
                            <div className="flex flex-col items-center py-4 gap-3 text-center">
                                <CheckCircle2 className="w-12 h-12 text-green-500" />
                                <p className="font-black text-slate-800">Callback Requested!</p>
                                <p className="text-sm text-slate-500 font-medium">Our agent will call you within <span className="text-green-600 font-black">30 minutes</span>.</p>
                                <button onClick={() => { setCallbackSent(false); setCallbackName(''); setCallbackPhone(''); }} className="text-xs text-blue-600 font-black underline">
                                    Request Again
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <input
                                    value={callbackName}
                                    onChange={e => setCallbackName(e.target.value)}
                                    placeholder="Your Full Name"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all"
                                />
                                <input
                                    value={callbackPhone}
                                    onChange={e => setCallbackPhone(e.target.value)}
                                    placeholder="Mobile Number (10 digits)"
                                    type="tel" maxLength={10}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all"
                                />
                                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 outline-none focus:border-blue-400">
                                    <option>Select Issue Type</option>
                                    {ISSUE_CATEGORIES.map(c => <option key={c.id}>{c.label}</option>)}
                                </select>
                                <button
                                    onClick={requestCallback}
                                    className="w-full bg-blue-900 text-white font-black text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-blue-100"
                                >
                                    <Phone className="w-4 h-4" /> Request Callback
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Operating Hours */}
                    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-blue-500" /> Support Hours
                        </h3>
                        <div className="space-y-2">
                            {[
                                { channel: 'Toll-Free Helpline (1800-890-0001)', hours: '8:00 AM – 10:00 PM · All Days' },
                                { channel: 'WhatsApp Chat (+91 93220 93220)', hours: '24 × 7 · Automated + Live Agent' },
                                { channel: 'Email (care@dmart.in)', hours: 'Response within 24–48 hrs' },
                                { channel: 'Corporate Landline (022-3340-3340)', hours: 'Mon–Sat · 9:00 AM – 7:00 PM' },
                                { channel: 'In-Store Support', hours: '8:00 AM – 10:00 PM · All Days' },
                            ].map((row, i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                                    <span className="text-xs font-bold text-slate-700 flex-1 leading-snug">{row.channel}</span>
                                    <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg ml-2 shrink-0">{row.hours}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ════════════ TAB: LIVE CHAT ════════════ */}
            {tab === 'chat' && (
                <div className="px-4 space-y-4">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col" style={{ minHeight: 420 }}>
                        {/* Chat header */}
                        <div className="bg-blue-900 px-5 py-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30 relative">
                                <Headphones className="w-5 h-5 text-white" />
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-blue-900 rounded-full" />
                            </div>
                            <div>
                                <p className="text-white font-black text-sm">DMart Support Bot</p>
                                <p className="text-blue-200 text-[10px] font-bold">● Online now · Avg reply &lt; 1 min</p>
                            </div>
                        </div>
                        {/* Chat messages */}
                        <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto bg-slate-50" style={{ maxHeight: 340 }}>
                            {chatLog.map((msg, i) => (
                                <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium leading-snug shadow-sm ${msg.from === 'user'
                                        ? 'bg-blue-900 text-white rounded-br-sm'
                                        : 'bg-white text-slate-800 border border-slate-100 rounded-bl-sm'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Input */}
                        <div className="px-4 py-3 bg-white border-t border-slate-100 flex gap-2">
                            <input
                                value={chatMsg}
                                onChange={e => setChatMsg(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && sendChat()}
                                placeholder="Type your message..."
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all"
                            />
                            <button onClick={sendChat} className="w-11 h-11 bg-blue-900 text-white rounded-xl flex items-center justify-center active:scale-90 transition-all shadow-md">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    {/* Quick questions */}
                    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Quick Questions</p>
                        <div className="flex flex-wrap gap-2">
                            {['Where is my order?', 'Refund status', 'Return a product', 'Cashback not credited', 'Cancel my order', 'Invoice / GST bill'].map(q => (
                                <button
                                    key={q}
                                    onClick={() => { setChatMsg(q); }}
                                    className="bg-blue-50 text-blue-700 text-xs font-black px-3 py-2 rounded-xl border border-blue-100 active:scale-95 transition-all"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ════════════ TAB: STORES ════════════ */}
            {tab === 'stores' && (
                <div className="px-4 space-y-4">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-5 pt-5 pb-3 border-b border-slate-100">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Store className="w-3.5 h-3.5 text-blue-500" /> DMart Store Contacts
                            </h3>
                        </div>
                        {STORES.map((store, i) => (
                            <div key={i} className="px-5 py-4 border-b border-slate-50 last:border-0 flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-black text-slate-800 leading-tight">{store.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{store.city}</span>
                                        <span className="text-[10px] font-bold text-green-600 flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{store.hours}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => window.open(`tel:${store.phone.replace(/\D/g, '')}`)}
                                    className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-100 px-3 py-2 rounded-xl active:scale-95 transition-all"
                                >
                                    <Phone className="w-3.5 h-3.5" />
                                    <span className="text-xs font-black">{store.phone}</span>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Find nearest store */}
                    <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-3xl p-5 text-white">
                        <div className="flex items-center gap-3 mb-3">
                            <MapPin className="w-6 h-6 text-blue-300" />
                            <div>
                                <p className="font-black">Find Nearest DMart Store</p>
                                <p className="text-blue-200 text-xs font-medium">View map, hours & contact</p>
                            </div>
                        </div>
                        <button
                            onClick={() => window.open('https://www.dmart.in/store-locator', '_blank')}
                            className="w-full bg-white text-blue-900 font-black text-sm py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                        >
                            <ExternalLink className="w-4 h-4" /> Open Store Locator
                        </button>
                    </div>

                    {/* Head Office */}
                    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Corporate / Head Office</p>
                        <div className="space-y-3 text-sm">
                            <div className="flex gap-3">
                                <Store className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-black text-slate-800">Avenue Supermarts Ltd.</p>
                                    <p className="text-slate-500 font-medium text-xs leading-snug mt-0.5">Anjaneya CHS Ltd., Orchard Avenue, Opp. Hiranandani Foundation School, Powai, Mumbai – 400 076</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Phone className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-bold text-slate-800">022-7125-0000</p>
                                    <p className="text-slate-500 font-medium text-xs">Corporate Landline</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Mail className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-bold text-slate-800">investor@dmart.in</p>
                                    <p className="text-slate-500 font-medium text-xs">Investor Relations</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <ShieldAlert className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-bold text-slate-800">compliance@dmart.in</p>
                                    <p className="text-slate-500 font-medium text-xs">Grievance / Compliance Officer</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => window.open('https://www.dmart.in', '_blank')}
                            className="mt-4 w-full border-2 border-slate-100 text-slate-600 font-black text-sm py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all hover:border-blue-300 hover:text-blue-700"
                        >
                            <ExternalLink className="w-4 h-4" /> Visit dmart.in
                        </button>
                    </div>
                </div>
            )}

            {/* ── Bottom CTA ── */}
            <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white/90 backdrop-blur-xl border-t border-slate-100 px-4 py-4 flex gap-3 z-50">
                <button
                    onClick={() => window.open('tel:18008900001')}
                    className="flex-1 bg-green-600 text-white font-black text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-green-100"
                >
                    <Phone className="w-4 h-4" /> Call 1800-890-0001
                </button>
                <button
                    onClick={() => window.open('https://wa.me/919322093220')}
                    className="flex-1 bg-[#25D366] text-white font-black text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-green-100"
                >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                </button>
            </div>

            {/* ── Toast ── */}
            {toast && (
                <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm z-[100] whitespace-nowrap border border-white/10">
                    {toast}
                </div>
            )}
        </div>
    );
};

export default Support;
