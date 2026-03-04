import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Star,
  Heart,
  ShoppingCart,
  Home,
  Package,
  Tag,
  User,
  CheckCircle,
  Plus,
  Minus,
} from 'lucide-react';
import { ALL_PRODUCTS } from '../data/products';

const CATS = [
  'All',
  'Fruits',
  'Vegetables',
  'Dairy',
  'Grains',
  'Snacks',
  'Beverages',
  'Bakery',
  'Personal Care',
  'Cleaning',
  'Frozen',
  'Men',
  'Women',
  'Children',
];

const CAT_COLORS = {
    All: 'bg-slate-900 text-white',
    Fruits: 'bg-red-500 text-white',
    Vegetables: 'bg-green-600 text-white',
    Dairy: 'bg-blue-600 text-white',
    Grains: 'bg-yellow-500 text-white',
    Snacks: 'bg-orange-500 text-white',
    Beverages: 'bg-purple-600 text-white',
    Bakery: 'bg-amber-600 text-white',
    'Personal Care': 'bg-pink-500 text-white',
    Cleaning: 'bg-teal-600 text-white',
    Frozen: 'bg-cyan-600 text-white',
    Men: 'bg-slate-800 text-white',
    Women: 'bg-rose-500 text-white',
    Children: 'bg-sky-500 text-white',
};

const CAT_EMOJIS = {
    All: '🛒', Fruits: '🍎', Vegetables: '🥦', Dairy: '🥛', Grains: '🌾',
    Snacks: '🍟',
    Beverages: '🧃',
    Bakery: '🍞',
    'Personal Care': '🧴',
    Cleaning: '🧹',
    Frozen: '❄️',
    Men: '👔',
    Women: '👗',
    Children: '🧒',
};

export default function Products() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem('dmartCart') || '[]'),
  );
  const [toast, setToast] = useState('');
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (location.state?.cat) {
      setActiveCat(location.state.cat);
    }
  }, [location.state?.cat]);

  useEffect(() => {
    localStorage.setItem('dmartCart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  };

  const getQty = (id) => cart.find((i) => i.id === id)?.qty || 0;

  const addToCart = (product) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id);
      if (idx >= 0)
        return prev.map((i, j) =>
          j === idx ? { ...i, qty: i.qty + 1 } : i,
        );
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`✅ Added to cart!`);
  };

  const removeFromCart = (product) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id);
      if (idx < 0) return prev;
      if (prev[idx].qty <= 1) return prev.filter((i) => i.id !== product.id);
      return prev.map((i, j) =>
        j === idx ? { ...i, qty: i.qty - 1 } : i,
      );
    });
  };

  const toggleWish = (id) =>
    setWishlist((w) =>
      w.includes(id) ? w.filter((x) => x !== id) : [...w, id],
    );

  const openDetails = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const filtered = ALL_PRODUCTS.filter((p) => {
    const catMatch = activeCat === 'All' || p.cat === activeCat;
    const searchMatch =
      !search || p.name.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  const cartTotal = cart.reduce((a, i) => a + i.price * i.qty, 0);
  const cartCount = cart.reduce((a, i) => a + i.qty, 0);

  return (
        <div className="min-h-screen pb-36" style={{ background: '#f0f4ff' }}>

            {/* ── HEADER ── */}
            <header className="sticky top-0 z-50 shadow-lg" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}>
                <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                    <button onClick={() => navigate('/home')} className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 shrink-0 active:scale-90 transition-all">
                        <ArrowLeft className="w-4 h-4 text-white" />
                    </button>
                    <div className="flex-1 flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-3 py-2.5 border border-white/20">
                        <Search className="w-4 h-4 text-white/70 shrink-0" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="flex-1 text-sm font-medium bg-transparent outline-none text-white placeholder:text-white/60"
                        />
                        {search && <button onClick={() => setSearch('')} className="text-white/70 w-5 h-5 flex items-center justify-center text-lg leading-none">×</button>}
                    </div>
                    <button className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 shrink-0">
                        <SlidersHorizontal className="w-4 h-4 text-white" />
                    </button>
                </div>
                <div className="flex items-center justify-between px-4 pb-2">
                    <p className="text-white/80 text-xs font-bold">
                        {filtered.length} products{activeCat !== 'All' ? ` in ${activeCat}` : ''}
                    </p>
                    <p className="text-white/80 text-xs font-bold">DMart Online 🛒</p>
                </div>

                {/* Category tabs */}
                <div className="flex gap-2 overflow-x-auto px-4 pb-3" style={{ scrollbarWidth: 'none' }}>
                    {CATS.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCat(cat)}
                            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${activeCat === cat ? CAT_COLORS[cat] : 'bg-white/20 text-white/80 backdrop-blur-sm border border-white/20'}`}
                        >
                            <span className="text-sm">{CAT_EMOJIS[cat]}</span>
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            {/* ── PRODUCT GRID ── */}
            <div className="px-3 pt-4">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <span className="text-6xl mb-4">🔍</span>
                        <p className="font-black text-slate-700 text-lg">No products found</p>
                        <p className="text-slate-400 text-sm mt-1">Try a different search or category</p>
                        <button onClick={() => { setSearch(''); setActiveCat('All'); }} className="mt-4 bg-blue-600 text-white font-black text-sm px-6 py-2.5 rounded-xl">Show All Products</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {filtered.map(product => {
                            const qty = getQty(product.id);
                            const isWished = wishlist.includes(product.id);
                            return (
                                <div key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-100 flex flex-col">
                                    {/* Image */}
                                    <button
                                        type="button"
                                        onClick={() => openDetails(product)}
                                        className="relative h-36 bg-slate-50 w-full text-left"
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextElementSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="hidden w-full h-full items-center justify-center text-5xl bg-slate-50 absolute inset-0">
                                            {product.emoji}
                                        </div>

                                        {/* Badge */}
                                        <span className={`absolute top-2 left-2 text-[9px] font-black px-1.5 py-0.5 rounded-lg shadow-sm ${product.badge === 'BEST BUY' ? 'bg-blue-600 text-white' : 'bg-red-500 text-white'}`}>
                                            {product.badge}
                                        </span>

                                        {/* Wishlist */}
                                        <button
                                            onClick={() => toggleWish(product.id)}
                                            className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100 active:scale-90 transition-all"
                                        >
                                            <Heart className={`w-3.5 h-3.5 ${isWished ? 'text-red-500 fill-red-500' : 'text-slate-300'}`} />
                                        </button>
                                    </button>

                                    {/* Info */}
                                    <div className="p-3 flex flex-col flex-1">
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">{product.cat}</p>
                                        <button
                                            type="button"
                                            onClick={() => openDetails(product)}
                                            className="text-left"
                                        >
                                            <h3 className="text-[13px] font-black text-slate-800 leading-tight mb-1 line-clamp-2 flex-1">
                                                {product.name}
                                            </h3>
                                        </button>
                                        <p className="text-[10px] font-bold text-slate-400 mb-2">{product.weight}</p>

                                        {/* Rating */}
                                        <div className="flex items-center gap-1 mb-2">
                                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                            <span className="text-[10px] font-black text-slate-700">{product.rating}</span>
                                            <span className="text-[10px] text-slate-400 font-bold">({product.reviews})</span>
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-baseline gap-1.5 mb-3">
                                            <span className="text-base font-black text-slate-900">₹{product.price}</span>
                                            <span className="text-[10px] text-slate-400 line-through font-bold">₹{product.mrp}</span>
                                            <span className="text-[9px] text-green-600 font-black ml-auto">{Math.round((1 - product.price / product.mrp) * 100)}% off</span>
                                        </div>

                                        {/* Add/Remove */}
                                        {qty === 0 ? (
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="w-full bg-blue-600 text-white font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-1 active:scale-95 transition-all shadow-md shadow-blue-200"
                                            >
                                                <Plus className="w-3.5 h-3.5" /> Add to Cart
                                            </button>
                                        ) : (
                                            <div className="flex items-center justify-between bg-blue-50 rounded-xl p-1 border border-blue-100">
                                                <button onClick={() => removeFromCart(product)} className="w-8 h-8 bg-white text-blue-600 rounded-lg flex items-center justify-center font-black shadow-sm active:scale-90 transition-all border border-blue-100">
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="font-black text-blue-700 text-sm w-8 text-center">{qty}</span>
                                                <button onClick={() => addToCart(product)} className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black shadow-sm active:scale-90 transition-all">
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── FLOATING CART BAR ── */}
            {cartCount > 0 && (
                <div className="fixed bottom-16 left-0 right-0 max-w-[480px] mx-auto px-4 z-40 animate-slideUp">
                    <button
                        onClick={() => navigate('/cart')}
                        className="w-full flex items-center justify-between bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl active:scale-95 transition-all border border-white/10"
                    >
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 rounded-lg px-2 py-1 text-xs font-black">{cartCount}</div>
                            <span className="font-black text-sm">{cartCount} item{cartCount > 1 ? 's' : ''} in cart</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-black text-lg">₹{cartTotal}</span>
                            <span className="text-white/70 text-sm font-bold">→ Cart</span>
                        </div>
                    </button>
                </div>
            )}

            {/* ── BOTTOM NAV ── */}
            <nav className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t border-slate-100 flex items-center justify-around px-2 h-[60px] z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.07)]">
                <NavLink to="/home" className={({ isActive }) => `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                    <Home className="w-5 h-5" />
                    <span className="text-[9px] font-black">Home</span>
                </NavLink>
                <NavLink to="/products" className={({ isActive }) => `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                    <Package className="w-5 h-5" />
                    <span className="text-[9px] font-black">Products</span>
                </NavLink>
                <NavLink to="/offers" className={({ isActive }) => `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                    <Tag className="w-5 h-5" />
                    <span className="text-[9px] font-black">Offers</span>
                </NavLink>
                <NavLink to="/cart" className={({ isActive }) => `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                    <div className="relative">
                        <ShoppingCart className="w-5 h-5" />
                        {cartCount > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">{cartCount}</span>}
                    </div>
                    <span className="text-[9px] font-black">Cart</span>
                </NavLink>
                <NavLink to="/account" className={({ isActive }) => `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                    <User className="w-5 h-5" />
                    <span className="text-[9px] font-black">Account</span>
                </NavLink>
            </nav>

            {/* Toast */}
            {toast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-blue-900 text-white px-5 py-2.5 rounded-2xl shadow-2xl font-bold text-xs z-[100] whitespace-nowrap animate-slideUp">
                    {toast}
                </div>
            )}
        </div>
    );
}
