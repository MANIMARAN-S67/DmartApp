import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    Search, Bell, ShoppingCart, MapPin, Home, Layers,
    Tag, User, ChevronRight, Flame, Zap, Star, Heart,
    Gift, Clock, Package, TrendingUp
} from 'lucide-react';

const CATEGORIES = [
    { name: 'Fruits', emoji: '🍎', bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-600' },
    { name: 'Vegetables', emoji: '🥦', bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-700' },
    { name: 'Dairy', emoji: '🥛', bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600' },
    { name: 'Grains', emoji: '🌾', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
    { name: 'Snacks', emoji: '🍟', bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-600' },
    { name: 'Beverages', emoji: '🧃', bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-600' },
    { name: 'Bakery', emoji: '🍞', bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700' },
    { name: 'Personal Care', emoji: '🧴', bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-600' },
    { name: 'Cleaning', emoji: '🧹', bg: 'bg-teal-50', border: 'border-teal-100', text: 'text-teal-600' },
    { name: 'Frozen', emoji: '❄️', bg: 'bg-cyan-50', border: 'border-cyan-100', text: 'text-cyan-600' },
];

const BANNERS = [
    {
        title: '🔥 Mega Sale!', subtitle: 'Up to 50% OFF Fresh Produce',
        cta: 'Shop Fruits', catFilter: 'Fruits',
        bg: 'from-orange-500 to-rose-500',
        img: 'https://thumbs.dreamstime.com/b/fruit-shop-766299.jpg'
    },
    {
        title: '🌿 Farm Fresh', subtitle: 'Organic Veggies at Best Prices',
        cta: 'Shop Veggies', catFilter: 'Vegetables',
        bg: 'from-green-600 to-emerald-500',
        img: 'https://tiimg.tistatic.com/fp/1/005/845/organic-vegetable-659.jpg'
    },
    {
        title: '⚡ Flash Deal!', subtitle: 'Dairy & Bakery Flat 30% OFF',
        cta: 'Shop Now', catFilter: 'Dairy',
        bg: 'from-purple-600 to-indigo-600',
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMzAt3yEiBPr81ARYSqVApxlZkbw1s0YZ0sQ&s'
    },
];

const DEALS = [
    { id: 'h1', name: 'Red Apples', price: 120, mrp: 150, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&q=80', emoji: '🍎', cat: 'Fruits', badge: '20% OFF' },
    { id: 'h2', name: 'Amul Milk 1L', price: 60, mrp: 65, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80', emoji: '🥛', cat: 'Dairy', badge: '8% OFF' },
    { id: 'h3', name: 'Alphonso Mango', price: 280, mrp: 350, image: 'https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=300&q=80', emoji: '🥭', cat: 'Fruits', badge: '20% OFF' },
    { id: 'h4', name: 'Oreo Cookies', price: 35, mrp: 40, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&q=80', emoji: '🍪', cat: 'Snacks', badge: '12% OFF' },
    { id: 'h5', name: 'Tropicana OJ', price: 90, mrp: 110, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&q=80', emoji: '🧃', cat: 'Beverages', badge: '18% OFF' },
    { id: 'h6', name: 'Wheat Bread', price: 45, mrp: 52, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80', emoji: '🍞', cat: 'Bakery', badge: '13% OFF' },
];

const Landing = () => {
    const [banner, setBanner] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const [, setCart] = useState([]);
    const [toast, setToast] = useState('');
    const timerRef = useRef(null);
    const navigate = useNavigate();
    const [userPhoto, setUserPhoto] = useState(localStorage.getItem('userPhoto') || null);

    useEffect(() => {
        const syncPhoto = () => setUserPhoto(localStorage.getItem('userPhoto'));
        window.addEventListener('storage', syncPhoto);
        return () => window.removeEventListener('storage', syncPhoto);
    }, []);

    useEffect(() => {
        const c = JSON.parse(localStorage.getItem('dmartCart') || '[]');
        setCart(c);
        setCartCount(c.reduce((a, i) => a + i.qty, 0));
        timerRef.current = setInterval(() => setBanner(b => (b + 1) % BANNERS.length), 3500);
        return () => clearInterval(timerRef.current);
    }, []);

    const addToCart = (product) => {
        const existing = JSON.parse(localStorage.getItem('dmartCart') || '[]');
        const idx = existing.findIndex(i => i.id === product.id);
        if (idx >= 0) {
            existing[idx].qty += 1;
        } else {
            existing.push({ ...product, qty: 1 });
        }
        localStorage.setItem('dmartCart', JSON.stringify(existing));
        const total = existing.reduce((a, i) => a + i.qty, 0);
        setCartCount(total);
        showToast(`✅ ${product.name} added to cart!`);
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 2000);
    };

    const goToProducts = (cat) => {
        navigate('/products', { state: { cat } });
    };

    return (
        <div className="flex flex-col min-h-screen pb-24" style={{ background: '#f7f8fa' }}>

            {/* ── HEADER ── */}
            <header className="sticky top-0 z-50 shadow-md" style={{ background: 'linear-gradient(135deg, #e8460f 0%, #ff6b35 50%, #ff8c42 100%)' }}>
                {/* Location + icons */}
                <div className="flex items-center justify-between px-4 pt-4 pb-4">
                    <button className="flex items-center gap-1.5 group" onClick={() => navigate('/address')}>
                        <MapPin className="w-4 h-4 text-orange-100 group-hover:text-white" />
                        <div>
                            <p className="text-[9px] text-orange-200 font-bold uppercase tracking-wider leading-none">Delivering to</p>
                            <p className="text-white font-black text-sm leading-tight">Mumbai, Andheri West ▾</p>
                        </div>
                    </button>
                    <div className="flex items-center gap-3">
                        <button className="relative z-10 w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 cursor-pointer active:scale-95 transition-all" onClick={() => navigate('/products')}>
                            <Search className="w-4 h-4 text-white" />
                        </button>
                        <button
                            className="relative z-10 w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 cursor-pointer active:scale-95 transition-all"
                            onClick={() => {
                                const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                                showToast(`🔔 3 new DMart alerts · ${time}`);
                            }}
                        >
                            <Bell className="w-4 h-4 text-white" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white text-[8px] flex items-center justify-center font-black text-slate-800">3</span>
                        </button>
                        <button className="relative z-10 w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 cursor-pointer active:scale-95 transition-all" onClick={() => navigate('/cart')}>
                            <ShoppingCart className="w-4 h-4 text-white" />
                            {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border border-white text-[9px] flex items-center justify-center font-black text-slate-800">{cartCount}</span>}
                        </button>
                    </div>
                </div>
            </header>

            {/* ── BANNER CAROUSEL ── */}
            <div className="px-4 mt-4">
                <div className="relative overflow-hidden rounded-3xl shadow-xl" style={{ height: '168px' }}>
                    {BANNERS.map((b, i) => (
                        <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === banner ? 'opacity-100' : 'opacity-0'}`}>
                            <img src={b.img} alt={b.title} className="absolute inset-0 w-full h-full object-cover" />
                            <div className={`absolute inset-0 bg-gradient-to-r ${b.bg} opacity-80`} />
                            <div className="absolute inset-0 p-5 flex flex-col justify-end">
                                <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">DMart Special </p>
                                <h2 className="text-2xl font-black text-white leading-tight mb-1">{b.title}</h2>
                                <p className="text-white/90 text-sm font-medium mb-3">{b.subtitle}</p>
                                <button
                                    onClick={() => goToProducts(b.catFilter)}
                                    className="self-start bg-white text-slate-800 font-black text-xs px-4 py-2 rounded-xl shadow-md active:scale-95 transition-all"
                                >
                                    {b.cta} →
                                </button>
                            </div>
                        </div>
                    ))}
                    {/* Dots */}
                    <div className="absolute bottom-3 right-4 flex gap-1.5">
                        {BANNERS.map((_, i) => (
                            <button key={i} onClick={() => setBanner(i)}
                                className={`rounded-full transition-all ${i === banner ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── QUICK STATS ── */}
            <div className="px-4 mt-5 grid grid-cols-3 gap-3">
                {[
                    { icon: '⚡', label: '30 Min', sub: 'Delivery', color: 'bg-yellow-50 border-yellow-100' },
                    { icon: '✅', label: '100%', sub: 'Fresh', color: 'bg-green-50 border-green-100' },
                    { icon: '🏷️', label: 'Best', sub: 'Prices', color: 'bg-blue-50 border-blue-100' },
                ].map((s, i) => (
                    <div key={i} className={`${s.color} border rounded-2xl p-3 flex flex-col items-center`}>
                        <span className="text-xl mb-1">{s.icon}</span>
                        <p className="font-black text-base text-slate-800 leading-none">{s.label}</p>
                        <p className="text-[10px] text-slate-500 font-bold">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* ── CATEGORIES ── */}
            <div className="mt-6">
                <div className="px-4 flex items-center justify-between mb-3">
                    <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                        <Layers className="w-5 h-5 text-orange-500" /> Shop by Category
                    </h3>
                    <button onClick={() => navigate('/products')} className="text-xs font-black text-orange-500">See All →</button>
                </div>
                <div className="grid grid-cols-5 gap-2 px-4">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => goToProducts(cat.name)}
                            className={`flex flex-col items-center gap-1.5 ${cat.bg} ${cat.border} border rounded-2xl p-2 active:scale-90 transition-all shadow-sm`}
                        >
                            <span className="text-2xl">{cat.emoji}</span>
                            <span className={`text-[9px] font-black ${cat.text} text-center leading-tight`}>{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── TODAY'S HOT DEALS ── */}
            <div className="mt-6">
                <div className="px-4 flex items-center justify-between mb-3">
                    <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                        <Flame className="w-5 h-5 text-red-500" /> Today's Hot Deals
                    </h3>
                    <button onClick={() => navigate('/offers')} className="text-xs font-black text-orange-500">View All →</button>
                </div>
                <div className="flex gap-3 overflow-x-auto px-4 pb-2" style={{ scrollbarWidth: 'none' }}>
                    {DEALS.map(product => (
                        <div key={product.id} className="shrink-0 w-36 bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden">
                            <div className="relative h-28 bg-slate-50">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover"
                                    onError={(e) => { e.target.style.display = 'none'; }} />
                                <div className="absolute inset-0 flex items-center justify-center text-4xl" style={{ display: 'none' }}>{product.emoji}</div>
                                <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-lg">{product.badge}</span>
                            </div>
                            <div className="p-2.5">
                                <p className="text-[11px] font-bold text-slate-800 leading-tight mb-1 line-clamp-2">{product.name}</p>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-sm font-black text-slate-900">₹{product.price}</span>
                                    <span className="text-[10px] text-slate-400 line-through font-bold">₹{product.mrp}</span>
                                </div>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="w-full bg-orange-500 text-white text-[10px] font-black py-1.5 rounded-xl active:scale-95 transition-all"
                                >+ Add</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── PROMO BANNERS ── */}
            <div className="px-4 mt-5 grid grid-cols-2 gap-3">
                <div onClick={() => goToProducts('Fruits')} className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl p-4 cursor-pointer active:scale-95 transition-all relative overflow-hidden">
                    <p className="text-white/80 text-[9px] font-black uppercase tracking-widest">Fresh</p>
                    <h4 className="text-white font-black text-base mt-0.5">Organic<br />Fruits</h4>
                    <p className="text-white/80 text-[10px] mt-1 font-bold">From ₹40</p>
                    <span className="text-3xl absolute bottom-2 right-2">🍓</span>
                </div>
                <div onClick={() => goToProducts('Dairy')} className="bg-gradient-to-br from-blue-400 to-blue-700 rounded-3xl p-4 cursor-pointer active:scale-95 transition-all relative overflow-hidden">
                    <p className="text-white/80 text-[9px] font-black uppercase tracking-widest">Daily</p>
                    <h4 className="text-white font-black text-base mt-0.5">Dairy &<br />Eggs</h4>
                    <p className="text-white/80 text-[10px] mt-1 font-bold">From ₹30</p>
                    <span className="text-3xl absolute bottom-2 right-2">🥛</span>
                </div>
                <div onClick={() => goToProducts('Snacks')} className="bg-gradient-to-br from-purple-400 to-violet-700 rounded-3xl p-4 cursor-pointer active:scale-95 transition-all relative overflow-hidden">
                    <p className="text-white/80 text-[9px] font-black uppercase tracking-widest">Munchies</p>
                    <h4 className="text-white font-black text-base mt-0.5">Snacks &<br />Cookies</h4>
                    <p className="text-white/80 text-[10px] mt-1 font-bold">From ₹20</p>
                    <span className="text-3xl absolute bottom-2 right-2">🍿</span>
                </div>
                <div onClick={() => navigate('/offers')} className="bg-gradient-to-br from-rose-400 to-red-600 rounded-3xl p-4 cursor-pointer active:scale-95 transition-all relative overflow-hidden">
                    <p className="text-white/80 text-[9px] font-black uppercase tracking-widest">Limited</p>
                    <h4 className="text-white font-black text-base mt-0.5">Flash<br />Sales</h4>
                    <p className="text-white/80 text-[10px] mt-1 font-bold">Up to 50% OFF</p>
                    <span className="text-3xl absolute bottom-2 right-2">⚡</span>
                </div>
            </div>

            {/* ── WHY DMART ── */}
            <div className="mx-4 mt-5 bg-gradient-to-r from-orange-500 to-rose-500 rounded-3xl p-5 mb-2">
                <h3 className="text-white font-black text-lg mb-3">Why DMart Online?</h3>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { icon: '🚀', text: 'Express 30-min delivery' },
                        { icon: '💯', text: '100% quality assured' },
                        { icon: '💳', text: 'Easy secure payment' },
                        { icon: '🔄', text: 'Hassle-free returns' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2">
                            <span className="text-lg">{item.icon}</span>
                            <span className="text-white text-[11px] font-bold leading-tight">{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── DMART FASHION SECTION ── */}
            <div className="mt-5 px-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-600" /> DMart Fashion
                    </h3>
                    <button
                        onClick={() => navigate('/products', { state: { cat: 'Men' } })}
                        className="text-xs font-black text-emerald-600"
                    >
                        View All →
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        {
                            cat: 'Men',
                            label: 'Men Collections',
                            img: 'https://media.istockphoto.com/id/1207027323/photo/trendy-clothes-in-a-store.jpg?s=1024x1024&w=is&k=20&c=Oj3TgnNMbjfjINFJP2lPdENLq93_iUuCmAEiGi90zfI=',
                        },
                        {
                            cat: 'Women',
                            label: 'Women Collections',
                            img: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQU_UiV0wtFVti6vP-63E7c6NOsx0raHia2n1Bbm6TbytdQzWcDYm3NsGuBnZCQwkaK8bB0hOf2sAWN1quBWqN92oh95l-B7Xi3aHYcRBw',
                        },
                        {
                            cat: 'Children',
                            label: 'Kids Collections',
                            img: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTXWwdbMaG1pfjxce10p4RYFJzQWm8ytneqbibuXNesf0NtT6f1mNDVnwYGXvu6ufO6DwIdjnQYZ22kqsWRjCJKd1K-oAcyj2GPDy0fNIM9H3cll-_dM2-5&usqp=CAc',
                        },
                    ].map(card => (
                        <button
                            key={card.cat}
                            onClick={() => goToProducts(card.cat)}
                            className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 flex flex-col active:scale-95 transition-all"
                        >
                            <div className="h-20 w-full overflow-hidden">
                                <img src={card.img} alt={card.label} className="w-full h-full object-cover" />
                            </div>
                            <div className="px-2 py-2 text-center">
                                <p className="text-[11px] font-black text-slate-800">{card.label}</p>
                                <p className="text-[9px] font-bold text-slate-400">Starting ₹299</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── BOTTOM NAV ── */}
            <nav className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t border-slate-100 flex items-center justify-around px-2 h-[60px] z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.07)]">
                <NavLink to="/home" className={({ isActive }) => `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${isActive ? 'text-orange-500' : 'text-slate-400'}`}>
                    <Home className="w-5 h-5" />
                    <span className="text-[9px] font-black">Home</span>
                </NavLink>
                <NavLink to="/products" className={({ isActive }) => `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${isActive ? 'text-orange-500' : 'text-slate-400'}`}>
                    <Package className="w-5 h-5" />
                    <span className="text-[9px] font-black">Products</span>
                </NavLink>
                <NavLink to="/offers" className={({ isActive }) => `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${isActive ? 'text-orange-500' : 'text-slate-400'}`}>
                    <Tag className="w-5 h-5" />
                    <span className="text-[9px] font-black">Offers</span>
                </NavLink>
                <NavLink to="/cart" className={({ isActive }) => `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${isActive ? 'text-orange-500' : 'text-slate-400'}`}>
                    <div className="relative">
                        <ShoppingCart className="w-5 h-5" />
                        {cartCount > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">{cartCount}</span>}
                    </div>
                    <span className="text-[9px] font-black">Cart</span>
                </NavLink>
                <NavLink to="/account" className={({ isActive }) => `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${isActive ? 'text-orange-500' : 'text-slate-400'}`}>
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                        {userPhoto ? (
                            <img src={userPhoto} alt="Me" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-4 h-4" />
                        )}
                    </div>
                    <span className="text-[9px] font-black">Account</span>
                </NavLink>
            </nav>

            {/* Toast */}
            {toast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl shadow-2xl font-bold text-xs z-[100] whitespace-nowrap animate-slideUp">
                    {toast}
                </div>
            )}
        </div>
    );
};

export default Landing;
