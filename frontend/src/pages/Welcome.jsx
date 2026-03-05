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
            <div className={`absolute inset-0 transition-opacity duration-500 flex flex-col justify-between p-8 ${slide === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} style={{ background: 'linear-gradient(160deg,#0a5c2e 0%,#1a8a42 60%,#27ae60 100%)' }}>
                <div className="flex-1 flex flex-col justify-center items-center text-center mt-12 animate-slideUp">
                    {/* NEW DMART LOGO SVG */}
                    <div className="w-32 h-32 rounded-[2rem] flex items-center justify-center shadow-2xl mb-8 border border-white/30 overflow-hidden relative z-10" style={{ background: 'repeating-conic-gradient(from -90deg at 50% 100%, #b8d4c7 0 10deg, #9bbfae 10deg 20deg)' }}>
                        <svg viewBox="0 0 100 100" className="w-[6.5rem] h-[6.5rem] text-[#196b3a] relative z-10 translate-x-1 translate-y-1" fill="currentColor">
                            <path d="M 4 12 h 12 l 10 18 h -12 z" />
                            <path d="M 20 30 h 78 l -16 35 h -50 z" />
                            <path d="M 16 42 h 6 l 12 26 h 44 v 7 h -52 z" />

                            <circle cx="36" cy="85" r="9.5" />
                            <circle cx="36" cy="85" r="3.5" fill="#a4c4b6" />
                            <circle cx="68" cy="85" r="9.5" />
                            <circle cx="68" cy="85" r="3.5" fill="#a4c4b6" />

                            <text x="29" y="55" fill="white" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="23" letterSpacing="0">D</text>

                            <g transform="translate(48, 36)">
                                <polygon points="4,0 5.2,1.8 7.5,2 6,3.6 6.5,5.5 4,4.5 1.5,5.5 2,3.6 0.5,2 2.8,1.8" fill="white" transform="scale(0.55) translate(3.3, 0)" />
                                <line x1="3" y1="5.5" x2="5" y2="5.5" stroke="white" strokeWidth="1.2" />
                                <line x1="2" y1="7.5" x2="6" y2="7.5" stroke="white" strokeWidth="1.2" />
                                <line x1="1" y1="9.5" x2="7" y2="9.5" stroke="white" strokeWidth="1.2" />
                                <line x1="0" y1="11.5" x2="8" y2="11.5" stroke="white" strokeWidth="1.2" />
                                <line x1="-1" y1="13.5" x2="9" y2="13.5" stroke="white" strokeWidth="1.2" />
                                <line x1="-2" y1="15.5" x2="10" y2="15.5" stroke="white" strokeWidth="1.2" />
                                <line x1="-3" y1="17.5" x2="11" y2="17.5" stroke="white" strokeWidth="1.2" />
                            </g>

                            <text x="63" y="55" fill="white" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" fontSize="19" letterSpacing="-0.5">Mart</text>
                        </svg>
                    </div>

                    <h1 className="text-4xl font-extrabold mb-4 leading-tight text-white drop-shadow-sm">Welcome to <span className="text-green-200">DMart Online</span></h1>
                    <p className="text-lg text-green-50 mb-10 font-bold block">Your daily essentials, delivered fresh to your door.</p>

                    <div className="grid grid-cols-1 gap-4 w-full px-6 text-white">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl py-3 px-5 flex items-center gap-3 font-bold border border-white/20 shadow-sm">
                            <Leaf className="w-5 h-5 text-green-200" /> Fresh Products
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl py-3 px-5 flex items-center gap-3 font-bold border border-white/20 shadow-sm">
                            <Tag className="w-5 h-5 text-green-200" /> Best Price Guarantee
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl py-3 px-5 flex items-center gap-3 font-bold border border-white/20 shadow-sm">
                            <Truck className="w-5 h-5 text-green-200" /> Fast Delivery
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-8 pb-8 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                    <div className="flex justify-center gap-3">
                        <span className="w-8 h-2.5 rounded-full bg-white"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-white/30"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-white/30"></span>
                    </div>
                    <button onClick={nextSlide} className="w-full h-16 bg-white text-[#1a8a42] rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-green-900/20 active:scale-95 transition-all outline-none">
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
