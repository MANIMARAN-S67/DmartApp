import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Leaf, Tag, Truck, Store, Apple, UtensilsCrossed, CupSoda, Bath, Percent, CheckCircle } from 'lucide-react';

const Welcome = () => {
    const [slide, setSlide] = useState(1);
    const navigate = useNavigate();

    const nextSlide = () => {
        if (slide < 3) setSlide(slide + 1);
        else navigate('/login');
    };

    return (
        <div className="h-screen relative overflow-hidden text-white font-sans max-w-[480px] mx-auto animate-fadeIn">
            {/* Slide 1 */}
            <div className={`absolute inset-0 transition-opacity duration-500 flex flex-col justify-between p-8 ${slide === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} style={{ background: 'linear-gradient(160deg,#fbbf24 0%,#f59e0b 60%,#d97706 100%)' }}>
                <div className="flex-1 flex flex-col justify-center items-center text-center mt-12 animate-slideUp">
                    {/* NEW LOGO SVG */}
                    <div className="w-28 h-28 bg-[#f59e0b] rounded-3xl flex items-center justify-center shadow-2xl mb-8 border-[3px] border-white/40 overflow-hidden shadow-orange-900/20">
                        <svg viewBox="0 0 100 100" className="w-[4.5rem] h-[4.5rem] text-[#0d285a] translate-x-1" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                            {/* Outer Cart Lines */}
                            <path d="M10,25 L25,25 L35,65 L75,65 L85,35 L30,35" />
                            {/* Wheels */}
                            <circle cx="40" cy="80" r="5" fill="currentColor" stroke="none" />
                            <circle cx="70" cy="80" r="5" fill="currentColor" stroke="none" />
                            {/* Inner D Shape cutout */}
                            <path d="M48,42 L55,42 C61,42 63,46 63,49 C63,52 61,56 55,56 L48,56 Z" fill="currentColor" stroke="none" />
                            <path d="M51,45 L54,45 C57,45 58,47 58,49 C58,51 57,53 54,53 L51,53 Z" fill="#f59e0b" stroke="none" />
                        </svg>
                    </div>

                    <h1 className="text-4xl font-extrabold mb-4 leading-tight text-slate-900 drop-shadow-sm">Welcome to <span className="text-[#0d285a]">DMart Online</span></h1>
                    <p className="text-lg text-slate-800 mb-10 font-bold block">Your daily essentials, delivered fresh to your door.</p>

                    <div className="grid grid-cols-1 gap-4 w-full px-6 text-slate-900">
                        <div className="bg-white/40 backdrop-blur-md rounded-2xl py-3 px-5 flex items-center gap-3 font-bold border border-white/50 shadow-sm">
                            <Leaf className="w-5 h-5 text-green-700" /> Fresh Products
                        </div>
                        <div className="bg-white/40 backdrop-blur-md rounded-2xl py-3 px-5 flex items-center gap-3 font-bold border border-white/50 shadow-sm">
                            <Tag className="w-5 h-5 text-[#0d285a]" /> Best Price Guarantee
                        </div>
                        <div className="bg-white/40 backdrop-blur-md rounded-2xl py-3 px-5 flex items-center gap-3 font-bold border border-white/50 shadow-sm">
                            <Truck className="w-5 h-5 text-[#0d285a]" /> Fast Delivery
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-8 pb-8 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                    <div className="flex justify-center gap-3">
                        <span className="w-8 h-2.5 rounded-full bg-slate-900"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-900/30"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-900/30"></span>
                    </div>
                    <button onClick={nextSlide} className="w-full h-16 bg-[#0d285a] text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 active:scale-95 transition-all outline-none">
                        Get Started <ArrowRight className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Slide 2 */}
            <div className={`absolute inset-0 transition-opacity duration-500 flex flex-col justify-between p-8 ${slide === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} style={{ background: 'linear-gradient(160deg,#1a3a6e 0%,#2563eb 60%,#60a5fa 100%)' }}>
                <div className="flex-1 flex flex-col justify-center items-center text-center mt-12">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl mb-8 border border-white/30">
                        <Store className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold mb-4 leading-tight">10,000+ <span className="text-blue-200">Products</span></h1>
                    <p className="text-lg text-blue-50 mb-10 font-medium px-4">Groceries, fruits, vegetables, dairy, snacks & more – all in one app.</p>
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center gap-2 border border-white/20">
                            <Apple className="w-8 h-8 text-blue-100" />
                            <span className="font-bold text-sm">Fruits & Veggies</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center gap-2 border border-white/20">
                            <UtensilsCrossed className="w-8 h-8 text-blue-100" />
                            <span className="font-bold text-sm">Bakery</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center gap-2 border border-white/20">
                            <CupSoda className="w-8 h-8 text-blue-100" />
                            <span className="font-bold text-sm">Beverages</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center gap-2 border border-white/20">
                            <Bath className="w-8 h-8 text-blue-100" />
                            <span className="font-bold text-sm">Personal Care</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-8 pb-8">
                    <div className="flex justify-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-white/30"></span>
                        <span className="w-8 h-2.5 rounded-full bg-white"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-white/30"></span>
                    </div>
                    <button onClick={nextSlide} className="w-full h-16 bg-blue-700 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all">
                        Next <ArrowRight className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Slide 3 */}
            <div className={`absolute inset-0 transition-opacity duration-500 flex flex-col justify-between p-8 ${slide === 3 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} style={{ background: 'linear-gradient(160deg,#7c2d12 0%,#ea580c 60%,#fb923c 100%)' }}>
                <div className="flex-1 flex flex-col justify-center items-center text-center mt-12">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl mb-8 border border-white/30">
                        <Percent className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold mb-4 leading-tight">Exclusive <span className="text-orange-200">Offers</span> Daily!</h1>
                    <p className="text-lg text-orange-50 mb-10 font-medium px-4">Save big with cashbacks, flash sales & loyalty rewards every day.</p>
                    <div className="flex flex-col gap-4 w-full px-4 text-left">
                        <div className="flex items-center gap-3 font-bold text-lg">
                            <CheckCircle className="w-6 h-6 text-orange-200 shrink-0" /> Up to 70% off on select items
                        </div>
                        <div className="flex items-center gap-3 font-bold text-lg">
                            <CheckCircle className="w-6 h-6 text-orange-200 shrink-0" /> Cashback on every order
                        </div>
                        <div className="flex items-center gap-3 font-bold text-lg">
                            <CheckCircle className="w-6 h-6 text-orange-200 shrink-0" /> Free delivery above ₹499
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-8 pb-8">
                    <div className="flex justify-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-white/30"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-white/30"></span>
                        <span className="w-8 h-2.5 rounded-full bg-white"></span>
                    </div>
                    <button onClick={nextSlide} className="w-full h-16 bg-orange-700 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all">
                        Shop Now <ShoppingCart className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
