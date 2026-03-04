import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Printer,
    Share2,
    Download,
    ShieldCheck,
    CheckCircle2,
    Store,
    Phone,
    Mail,
    MapPin,
    CalendarDays,
    Clock,
    User,
    CreditCard,
    Package,
    ChevronDown,
    ChevronUp,
    Copy,
    Star,
} from 'lucide-react';

/* ─── helpers ─────────────────────────────────────────────── */
const fmt = (n) => Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
const now = new Date();
const pad = (x) => String(x).padStart(2, '0');
const receiptDate = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
const receiptTime = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

/* ─── role tabs ────────────────────────────────────────────── */
const ROLES = ['Customer', 'Staff', 'Owner'];

/* ═══════════════════════════════════════════════════════════ */
const EReceipt = () => {
    const navigate = useNavigate();
    const receiptRef = useRef(null);

    /* pull saved data */
    const orderId = localStorage.getItem('lastOrderId') || 'DM-' + Math.floor(Math.random() * 90000 + 10000);
    const savedTotal = parseFloat(localStorage.getItem('lastOrderTotal') || '0');
    const payMethod = localStorage.getItem('lastPaymentMethod') || 'UPI (GPay)';
    const userName = localStorage.getItem('userName') || 'Guest User';
    const userPhone = localStorage.getItem('userPhone') || '+91 98765 43210';
    const userEmail = localStorage.getItem('userEmail') || 'customer@dmart.in';
    const savedCart = JSON.parse(localStorage.getItem('dmartLastCart') || localStorage.getItem('dmartCart') || '[]');

    const subtotal = savedCart.reduce((a, i) => a + i.qty * i.price, 0) || (savedTotal * 0.9);
    const gst = Math.round((savedTotal * 0.9) * 0.05) || Math.round(savedTotal * 0.04);
    const delivery = savedTotal - subtotal - gst > 0 ? savedTotal - subtotal - gst : 0;
    const cashback = Math.round(savedTotal * 0.02);

    /* UI state */
    const [role, setRole] = useState('Customer');
    const [showItems, setShowItems] = useState(true);
    const [toast, setToast] = useState('');
    const [copied, setCopied] = useState(false);

    /* editable fields for staff/owner */
    const [staffNote, setStaffNote] = useState('');
    const [staffName, setStaffName] = useState('');
    const [storeId, setStoreId] = useState('DMT-MUM-042');
    const [cashierName, setCashierName] = useState('Rahul S.');
    const [terminalId, setTerminalId] = useState('TRM-0042');

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 2500);
    };

    const handleCopyId = () => {
        navigator.clipboard?.writeText(orderId).catch(() => { });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        showToast('Order ID copied!');
    };

    const handlePrint = () => window.print();

    const handleShareWA = () => {
        const lines = savedCart.map(i => `  • ${i.name} x${i.qty} — ₹${fmt(i.price * i.qty)}`).join('\n');
        const msg =
            `🧾 *DMart e-Receipt*
━━━━━━━━━━━━━━━━━━━
🏬 Avenue Supermarts Ltd. (DMart)
📍 Mumbai, Maharashtra

📋 Order ID  : ${orderId}
📅 Date      : ${receiptDate}  ${receiptTime}
👤 Customer  : ${userName}

🛒 Items:
${lines || '  • (See app for details)'}

💰 Subtotal  : ₹${fmt(subtotal)}
🚚 Delivery  : ₹${fmt(delivery)}
🏛️ GST (5%) : ₹${fmt(gst)}
─────────────────────
✅ TOTAL PAID: ₹${fmt(savedTotal)}
💳 Mode      : ${payMethod}
🎁 Cashback  : ₹${cashback} added to Wallet!
━━━━━━━━━━━━━━━━━━━
Thank you for shopping at DMart! 🛍️`;
        window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
    };

    /* ── dummy items if cart is empty ── */
    const displayItems = savedCart.length > 0 ? savedCart : [
        { id: 1, name: 'Fresh Red Apples (1 kg)', qty: 2, price: 120 },
        { id: 2, name: 'Amul Full Cream Milk 1L', qty: 3, price: 68 },
        { id: 3, name: 'Parle G Biscuits (800g)', qty: 1, price: 55 },
    ];

    /* ────────────────── RENDER ────────────────── */
    return (
        <div className="min-h-screen bg-slate-100 pb-20 font-sans" style={{ maxWidth: 480, margin: '0 auto' }}>

            {/* ── Header ── */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm px-5 py-4 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 active:scale-90 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-black text-slate-900 leading-tight">e-Receipt</h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">DMart Official Receipt</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handlePrint} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 active:scale-90 transition-all">
                        <Printer className="w-4 h-4" />
                    </button>
                    <button onClick={handleShareWA} className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-600 active:scale-90 transition-all">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* ── Role Tabs ── */}
            <div className="flex gap-2 px-5 pt-4 pb-2">
                {ROLES.map(r => (
                    <button
                        key={r}
                        onClick={() => setRole(r)}
                        className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${role === r ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'bg-white text-slate-500 border border-slate-100'}`}
                    >
                        {r}
                    </button>
                ))}
            </div>

            {/* ══════════════════════════════════════
                RECEIPT CARD (print target)
            ══════════════════════════════════════ */}
            <div ref={receiptRef} className="mx-4 my-3 bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden border border-slate-100 print:shadow-none print:rounded-none">

                {/* ── Store Header ── */}
                <div className="bg-gradient-to-br from-blue-900 to-blue-700 px-6 pt-8 pb-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                    <div className="relative z-10 flex items-start gap-4">
                        {/* DMart Logo Block */}
                        <div className="w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center shadow-lg shrink-0 overflow-hidden">
                            <div className="w-full h-3 bg-red-600" />
                            <div className="flex-1 flex items-center justify-center">
                                <span className="text-blue-900 font-black text-xl leading-none">D</span>
                                <span className="text-blue-700 font-black text-xl leading-none">-</span>
                                <span className="text-blue-900 font-black text-xl leading-none">Mart</span>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black mb-0.5">Avenue Supermarts Ltd.</h2>
                            <p className="text-blue-200 text-xs font-semibold">CIN: L51900MH2000PLC126473</p>
                            <div className="flex items-center gap-1 mt-2 text-blue-100 text-[11px]">
                                <MapPin className="w-3 h-3" />
                                <span>Lower Parel, Mumbai, MH – 400013</span>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-blue-200 text-[11px]">
                                <span className="flex items-center gap-1"><Phone className="w-3 h-3" />1800-890-0001</span>
                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" />care@dmart.in</span>
                            </div>
                        </div>
                    </div>

                    {/* GSTIN row */}
                    <div className="relative z-10 mt-4 flex gap-4 border-t border-blue-600 pt-3 text-[10px] text-blue-200 font-bold">
                        <span>GSTIN: 27AABCA1234Z1ZA</span>
                        <span>FSSAI: 10016011002253</span>
                    </div>
                </div>

                {/* ── Receipt Title Bar ── */}
                <div className="bg-red-600 text-white text-center py-2">
                    <p className="text-sm font-black uppercase tracking-[0.2em]">◆ Tax Invoice / e-Receipt ◆</p>
                </div>

                {/* ── Order Meta ── */}
                <div className="px-5 pt-5 pb-4 grid grid-cols-2 gap-y-3 gap-x-4 border-b border-dashed border-slate-200">
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Order ID</p>
                        <div className="flex items-center gap-1">
                            <span className="text-sm font-black text-slate-900">{orderId}</span>
                            <button onClick={handleCopyId} className="text-slate-400 hover:text-green-600 transition-colors">
                                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Store ID</p>
                        <span className="text-sm font-black text-slate-900">{storeId}</span>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 flex items-center gap-1"><CalendarDays className="w-3 h-3" />Date</p>
                        <span className="text-sm font-bold text-slate-800">{receiptDate}</span>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 flex items-center gap-1"><Clock className="w-3 h-3" />Time</p>
                        <span className="text-sm font-bold text-slate-800">{receiptTime}</span>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 flex items-center gap-1"><User className="w-3 h-3" />Cashier</p>
                        <span className="text-sm font-bold text-slate-800">{cashierName}</span>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Terminal</p>
                        <span className="text-sm font-bold text-slate-800">{terminalId}</span>
                    </div>
                </div>

                {/* ── Customer Info ── */}
                <div className="px-5 py-4 border-b border-dashed border-slate-200 bg-slate-50">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Customer Details</p>
                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-sm">
                            <span className="font-bold text-slate-500 flex items-center gap-1"><User className="w-3 h-3" />Name</span>
                            <span className="font-black text-slate-900">{userName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-bold text-slate-500 flex items-center gap-1"><Phone className="w-3 h-3" />Phone</span>
                            <span className="font-bold text-slate-800">{userPhone}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-bold text-slate-500 flex items-center gap-1"><Mail className="w-3 h-3" />Email</span>
                            <span className="font-bold text-slate-800">{userEmail}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-bold text-slate-500 flex items-center gap-1"><CreditCard className="w-3 h-3" />DMart ID</span>
                            <span className="font-bold text-slate-800">DMM-{Math.floor(Math.random() * 900000 + 100000)}</span>
                        </div>
                    </div>
                </div>

                {/* ── Items ── */}
                <div className="px-5 py-4 border-b border-dashed border-slate-200">
                    <button
                        onClick={() => setShowItems(!showItems)}
                        className="w-full flex items-center justify-between mb-3"
                    >
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <Package className="w-3 h-3" />Items Purchased ({displayItems.length})
                        </p>
                        {showItems ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>

                    {/* Column headers */}
                    <div className="grid grid-cols-12 text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">
                        <span className="col-span-5">Item</span>
                        <span className="col-span-2 text-center">Qty</span>
                        <span className="col-span-2 text-right">Rate</span>
                        <span className="col-span-3 text-right">Amount</span>
                    </div>

                    {showItems && displayItems.map((item, idx) => (
                        <div key={item.id || idx} className="grid grid-cols-12 py-2 border-b border-slate-50 text-sm items-center">
                            <span className="col-span-5 font-semibold text-slate-800 text-xs leading-snug pr-1">{item.name}</span>
                            <span className="col-span-2 text-center font-bold text-slate-600">{item.qty}</span>
                            <span className="col-span-2 text-right font-bold text-slate-600">₹{item.price}</span>
                            <span className="col-span-3 text-right font-black text-slate-900">₹{fmt(item.price * item.qty)}</span>
                        </div>
                    ))}
                </div>

                {/* ── Bill Summary ── */}
                <div className="px-5 py-4 border-b border-dashed border-slate-200 space-y-2.5">
                    <div className="flex justify-between text-sm">
                        <span className="font-bold text-slate-500">Subtotal</span>
                        <span className="font-bold text-slate-800">₹{fmt(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="font-bold text-slate-500">Delivery Charges</span>
                        <span className="font-bold text-slate-800">{delivery > 0 ? `₹${fmt(delivery)}` : <span className="text-green-600 font-black">FREE</span>}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="font-bold text-slate-500">GST (5% IGST)</span>
                        <span className="font-bold text-slate-800">₹{fmt(gst)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="font-bold text-slate-500">Discount Applied</span>
                        <span className="font-black text-green-600">–₹0.00</span>
                    </div>
                    {/* Total */}
                    <div className="bg-slate-900 rounded-2xl px-4 py-3 flex justify-between items-center mt-2">
                        <div>
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Total Paid</p>
                            <p className="text-2xl font-black text-white">₹{fmt(savedTotal)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Payment Mode</p>
                            <span className="bg-green-500 text-white text-xs font-black px-3 py-1 rounded-full">{payMethod}</span>
                        </div>
                    </div>
                </div>

                {/* ── Savings & Cashback ── */}
                <div className="px-5 py-3 bg-green-50 border-b border-dashed border-slate-200">
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-black text-green-700 flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-green-500 text-green-500" />DMart Wallet Cashback</span>
                        <span className="font-black text-green-700">+₹{cashback}</span>
                    </div>
                    <p className="text-[10px] text-green-600 font-medium mt-0.5">Credited to your DMart wallet within 24 hrs.</p>
                </div>

                {/* ── Transaction Status ── */}
                <div className="px-5 py-4 border-b border-dashed border-slate-200">
                    <div className="flex items-center gap-3 bg-green-50 rounded-2xl p-3">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-green-100">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-green-800 uppercase tracking-wide">Payment Verified ✓</p>
                            <p className="text-[10px] text-green-600 font-medium">Secured by DMart Payment Gateway · TXN#{orderId.replace('DM-', '')}</p>
                        </div>
                    </div>
                </div>

                {/* ── Staff / Owner Sections ── */}
                {role === 'Staff' && (
                    <div className="px-5 py-4 border-b border-dashed border-slate-200 bg-blue-50 space-y-3">
                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Staff Details</p>
                        <div className="space-y-2">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 block mb-1">Your Name (Staff)</label>
                                <input value={staffName} onChange={e => setStaffName(e.target.value)} placeholder="Enter staff name" className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 block mb-1">Cashier Name on Receipt</label>
                                <input value={cashierName} onChange={e => setCashierName(e.target.value)} placeholder="Cashier name" className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 block mb-1">Terminal ID</label>
                                <input value={terminalId} onChange={e => setTerminalId(e.target.value)} placeholder="Terminal ID" className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 block mb-1">Staff Note / Remark</label>
                                <textarea value={staffNote} onChange={e => setStaffNote(e.target.value)} rows={2} placeholder="e.g. Customer requested gift wrap" className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 resize-none" />
                            </div>
                        </div>
                        {staffNote && (
                            <div className="bg-white rounded-xl p-3 border border-blue-100">
                                <p className="text-[9px] font-black text-blue-500 uppercase mb-1">Staff Remark on Receipt</p>
                                <p className="text-xs font-medium text-slate-700">{staffNote}</p>
                            </div>
                        )}
                        <button onClick={() => showToast('Staff details updated on receipt!')} className="w-full bg-blue-600 text-white font-black text-sm py-3 rounded-xl active:scale-95 transition-all">
                            Update Receipt
                        </button>
                    </div>
                )}

                {role === 'Owner' && (
                    <div className="px-5 py-4 border-b border-dashed border-slate-200 bg-purple-50 space-y-3">
                        <p className="text-[9px] font-black text-purple-600 uppercase tracking-widest">Owner / Manager Panel</p>
                        <div className="space-y-2">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 block mb-1">Store ID</label>
                                <input value={storeId} onChange={e => setStoreId(e.target.value)} placeholder="Store ID" className="w-full bg-white border border-purple-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-purple-500" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 block mb-1">Cashier Name</label>
                                <input value={cashierName} onChange={e => setCashierName(e.target.value)} placeholder="Cashier" className="w-full bg-white border border-purple-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-purple-500" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 block mb-1">Terminal ID</label>
                                <input value={terminalId} onChange={e => setTerminalId(e.target.value)} placeholder="Terminal" className="w-full bg-white border border-purple-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-purple-500" />
                            </div>
                        </div>
                        {/* Revenue Summary for Owner */}
                        <div className="bg-white rounded-2xl p-4 border border-purple-100 space-y-2 mt-2">
                            <p className="text-[9px] font-black text-purple-500 uppercase tracking-widest mb-2">Revenue Breakdown</p>
                            <div className="flex justify-between text-xs font-bold text-slate-600">
                                <span>Net Revenue</span>
                                <span className="text-slate-900">₹{fmt(savedTotal - gst)}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-slate-600">
                                <span>GST Collected</span>
                                <span className="text-slate-900">₹{fmt(gst)}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-slate-600">
                                <span>Delivery Revenue</span>
                                <span className="text-slate-900">₹{fmt(delivery)}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-slate-600">
                                <span>Cashback Issued</span>
                                <span className="text-red-500">–₹{cashback}</span>
                            </div>
                            <div className="border-t border-purple-100 pt-2 flex justify-between text-sm font-black">
                                <span className="text-purple-700">Gross Collected</span>
                                <span className="text-purple-700">₹{fmt(savedTotal)}</span>
                            </div>
                        </div>
                        <button onClick={() => showToast('Receipt settings saved!')} className="w-full bg-purple-600 text-white font-black text-sm py-3 rounded-xl active:scale-95 transition-all">
                            Save & Update Receipt
                        </button>
                    </div>
                )}

                {/* ── Footer ── */}
                <div className="px-5 py-5 text-center space-y-2">
                    {/* Barcode visual */}
                    <div className="flex justify-center mb-3">
                        <div className="flex gap-0.5 items-end h-10">
                            {Array.from({ length: 38 }).map((_, i) => (
                                <div key={i} style={{ width: i % 3 === 0 ? 3 : 1.5, height: `${50 + Math.sin(i) * 30}%`, backgroundColor: '#1e293b' }} />
                            ))}
                        </div>
                    </div>
                    <p className="text-[10px] font-black text-slate-500 tracking-[0.15em]">{orderId} · {receiptDate}</p>
                    <p className="text-[10px] font-bold text-slate-400 leading-snug">
                        This is a computer-generated receipt and does not require a physical signature.
                    </p>
                    <p className="text-[10px] font-bold text-slate-400">
                        For queries: <span className="text-blue-600">care@dmart.in</span> | 1800-890-0001
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                        <p className="text-[10px] font-black text-green-600">Secured by DMart</p>
                    </div>
                    <p className="text-[9px] text-slate-300 mt-1 font-bold">© {now.getFullYear()} Avenue Supermarts Ltd. · All rights reserved.</p>
                </div>
            </div>

            {/* ── Action Buttons ── */}
            <div className="px-4 space-y-3 mt-2">
                <button
                    onClick={handleShareWA}
                    className="w-full h-14 rounded-2xl bg-[#25D366] text-white font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-green-100 active:scale-95 transition-all"
                >
                    <Share2 className="w-5 h-5" />
                    Share Receipt via WhatsApp
                </button>
                <button
                    onClick={handlePrint}
                    className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black text-base flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
                >
                    <Printer className="w-5 h-5" />
                    Print Receipt
                </button>
                <button
                    onClick={() => navigate('/home')}
                    className="w-full h-12 rounded-2xl bg-white border-2 border-slate-100 text-slate-500 font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                    Continue Shopping
                </button>
            </div>

            {/* ── Toast ── */}
            {toast && (
                <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm z-50 flex items-center gap-2 whitespace-nowrap border border-white/10 animate-bounce">
                    {toast}
                </div>
            )}

            {/* ─── Print Styles ─── */}
            <style>{`
                @media print {
                    body * { visibility: hidden !important; }
                    #receipt-print, #receipt-print * { visibility: visible !important; }
                    header, footer, button { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default EReceipt;
