import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Trash2, Plus, Minus, CreditCard, ChevronRight } from 'lucide-react';

const Cart = () => {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('dmartCart') || '[]'));
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('dmartCart', JSON.stringify(cart));
    }, [cart]);

    const updateQty = (id, delta) => {
        const newCart = [...cart];
        const idx = newCart.findIndex(c => c.id === id);
        if (idx > -1) {
            newCart[idx].qty += delta;
            if (newCart[idx].qty <= 0) newCart.splice(idx, 1);
            setCart(newCart);
        }
    };

    const removeItem = (id) => {
        setCart(cart.filter(c => c.id !== id));
    };

    const subtotal = cart.reduce((a, i) => a + i.qty * i.price, 0);
    const delivery = subtotal > 499 ? 0 : 56;
    const saving = Math.floor(subtotal * 0.05);
    const total = subtotal + delivery;

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-white px-8 flex flex-col items-center justify-center text-center animate-fadeIn">
                <div className="w-48 h-48 rounded-full bg-slate-50 flex items-center justify-center mb-10 border border-slate-100 shadow-inner">
                    <ShoppingCart className="w-20 h-20 text-slate-200" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Your Cart Is <span className="text-green-600">Empty!</span></h2>
                <p className="text-slate-500 font-medium text-lg leading-snug mb-10 px-6">Add fresh groceries and household essentials to start your DMart shopping.</p>
                <button
                    onClick={() => navigate('/products')}
                    className="w-full bg-slate-900 text-white rounded-2xl py-4.5 font-black text-lg shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                >
                    Discover Products <ArrowLeft className="w-6 h-6 rotate-180" />
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-40 animate-fadeIn">
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl px-5 py-4 border-b border-slate-100 flex items-center justify-between max-w-[480px] mx-auto shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-100 border border-slate-200 flex items-center justify-center rounded-xl text-slate-700 active:scale-90 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">My <span className="text-green-600">Cart</span></h1>
                </div>
                <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{cart.length} ITEMS</span>
            </header>

            <div className="px-5 pt-24 space-y-4">
                {cart.map(item => (
                    <div key={item.id} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex gap-4 animate-slideUp">
                        <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center p-2">
                            {item.image
                                ? <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                : <span className="text-4xl">{item.emoji}</span>}
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h4 className="font-extrabold text-slate-800 text-sm leading-tight line-clamp-2 pr-4">{item.name}</h4>
                                    <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">₹{item.price} per unit</p>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <span className="text-base font-black text-slate-900">₹{item.price * item.qty}</span>
                                    <span className="text-[10px] text-slate-300 font-bold line-through">₹{Math.floor(item.price * item.qty * 1.15)}</span>
                                </div>
                                <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl h-9 overflow-hidden shadow-inner">
                                    <button onClick={() => updateQty(item.id, -1)} className="w-8 h-full flex items-center justify-center text-slate-400 hover:bg-slate-100 active:scale-90 transition-all"><Minus className="w-3.5 h-3.5" /></button>
                                    <span className="w-5 text-center text-xs font-black text-slate-800">{item.qty}</span>
                                    <button onClick={() => updateQty(item.id, 1)} className="w-8 h-full flex items-center justify-center text-slate-400 hover:bg-slate-100 active:scale-90 transition-all"><Plus className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="px-5 mt-8 mb-4">
                <div className="bg-green-50 border border-green-100 rounded-3xl p-4 border-dashed animate-pulse">
                    <div className="flex items-center justify-between">
                        <div>
                            <h5 className="text-green-800 font-black text-xs uppercase tracking-widest">Total Savings Today</h5>
                            <p className="text-green-600 text-2xl font-black">₹{saving.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-200/50 rounded-2xl flex items-center justify-center">
                            <span className="text-2xl">🎉</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-8 pb-32">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Price Details</h4>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                        <span>Subtotal</span>
                        <span className="text-slate-800">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                        <span>Delivery Charge</span>
                        <span className={delivery === 0 ? 'text-green-600 uppercase tracking-tighter text-[10px] font-black' : 'text-slate-800'}>{delivery === 0 ? 'FREE' : `+ ₹${delivery}`}</span>
                    </div>
                    <div className="h-px bg-slate-100 w-full my-4"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-black text-slate-900 tracking-tight">Total Amount</span>
                        <span className="text-2xl font-black text-green-700">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 h-32 bg-white/70 backdrop-blur-3xl px-8 flex items-center justify-center max-w-[480px] mx-auto z-50 rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <button
                    onClick={() => navigate('/payment')}
                    className="w-full bg-green-600 text-white h-16 rounded-3xl font-black text-xl shadow-2xl shadow-green-200/50 flex items-center justify-between px-8 active:scale-95 transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <CreditCard className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        <span>Checkout</span>
                    </div>
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default Cart;
