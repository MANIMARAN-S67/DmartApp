import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Star,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  Home,
} from 'lucide-react';
import { ALL_PRODUCTS, getProductById } from '../data/products';

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const initialProduct = location.state?.product || getProductById(id);

  const [product] = useState(initialProduct || null);
  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem('dmartCart') || '[]'),
  );
  const [wishlist, setWishlist] = useState(() =>
    JSON.parse(localStorage.getItem('dmartWishlist') || '[]'),
  );
  const [toast, setToast] = useState('');

  useEffect(() => {
    localStorage.setItem('dmartCart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('dmartWishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  };

  const qty = product
    ? cart.find((i) => i.id === product.id)?.qty || 0
    : 0;

  const addToCart = () => {
    if (!product) return;
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id);
      if (idx >= 0)
        return prev.map((i, j) =>
          j === idx ? { ...i, qty: i.qty + 1 } : i,
        );
      return [...prev, { ...product, qty: 1 }];
    });
    showToast('✅ Added to cart!');
  };

  const removeFromCart = () => {
    if (!product) return;
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id);
      if (idx < 0) return prev;
      if (prev[idx].qty <= 1) return prev.filter((i) => i.id !== product.id);
      return prev.map((i, j) =>
        j === idx ? { ...i, qty: i.qty - 1 } : i,
      );
    });
  };

  const toggleWish = () => {
    if (!product) return;
    setWishlist((w) =>
      w.includes(product.id)
        ? w.filter((x) => x !== product.id)
        : [...w, product.id],
    );
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          Product not found
        </h2>
        <p className="text-slate-500 text-sm font-medium mb-6">
          This product is no longer available. Please browse the latest
          catalog.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="bg-slate-900 text-white rounded-2xl px-6 py-3 font-black text-sm"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const similar = ALL_PRODUCTS.filter(
    (p) => p.cat === product.cat && p.id !== product.id,
  ).slice(0, 6);

  const isWished = wishlist.includes(product.id);

  return (
    <div className="min-h-screen bg-slate-50 pb-36 max-w-[480px] mx-auto animate-fadeIn">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl px-5 py-4 border-b border-slate-100 flex items-center justify-between max-w-[480px] mx-auto shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-slate-100 border border-slate-200 flex items-center justify-center rounded-xl text-slate-700 active:scale-90 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-black text-slate-900 tracking-tight line-clamp-1 px-3">
          {product.name}
        </h1>
        <button
          onClick={() => navigate('/cart')}
          className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-xl active:scale-90 transition-all"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </header>

      {/* Main */}
      <main className="pt-24 px-5">
        {/* Image */}
        <div className="bg-white rounded-3xl p-4 mb-4 shadow-sm border border-slate-100 relative">
          <div className="w-full h-60 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <button
            onClick={toggleWish}
            className="absolute top-5 right-5 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100 active:scale-90 transition-all"
          >
            <Heart
              className={`w-5 h-5 ${
                isWished ? 'text-red-500 fill-red-500' : 'text-slate-300'
              }`}
            />
          </button>
          <span className="absolute top-5 left-5 bg-emerald-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest">
            {product.cat}
          </span>
        </div>

        {/* Info */}
        <section className="bg-white rounded-3xl p-5 mb-4 shadow-sm border border-slate-100">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">
            DMart Fresh Pick
          </p>
          <h2 className="text-xl font-black text-slate-900 leading-snug mb-1">
            {product.name}
          </h2>
          <p className="text-xs font-bold text-slate-500 mb-3">
            Pack size: {product.weight}
          </p>

          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-black text-slate-800">
              {product.rating}
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              ({product.reviews} ratings)
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-black text-slate-900">
              ₹{product.price}
            </span>
            <span className="text-sm font-bold text-slate-400 line-through">
              ₹{product.mrp}
            </span>
            <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg">
              Save ₹{product.mrp - product.price}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-bold">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-500" />
              30 min delivery
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% quality checked
            </div>
          </div>
        </section>

        {/* Delivery info */}
        <section className="bg-emerald-50 rounded-3xl p-4 mb-5 border border-emerald-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
            <Home className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">
              Delivering to
            </p>
            <p className="text-xs font-bold text-slate-800">
              Your saved DMart address
            </p>
            <button
              onClick={() => navigate('/address')}
              className="text-[10px] font-black text-emerald-700 underline underline-offset-4 mt-1"
            >
              Change address
            </button>
          </div>
        </section>

        {/* Similar products */}
        {similar.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black text-slate-900">
                Similar in {product.cat}
              </h3>
              <button
                onClick={() =>
                  navigate('/products', { state: { cat: product.cat } })
                }
                className="text-[11px] font-black text-emerald-600"
              >
                View all →
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {similar.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    navigate(`/product/${p.id}`, { state: { product: p } })
                  }
                  className="shrink-0 w-32 bg-white rounded-2xl shadow-sm border border-slate-100 text-left"
                >
                  <div className="h-24 bg-slate-50 rounded-2xl overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2.5">
                    <p className="text-[11px] font-black text-slate-800 line-clamp-2 mb-1">
                      {p.name}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500">
                      ₹{p.price}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 h-28 bg-white/80 backdrop-blur-3xl px-5 flex items-center justify-center max-w-[480px] mx-auto z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.06)]">
        {qty === 0 ? (
          <button
            onClick={addToCart}
            className="w-full h-14 rounded-3xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 active:scale-95 transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
        ) : (
          <div className="w-full flex items-center gap-3">
            <div className="flex-1">
              <p className="text-[11px] font-bold text-slate-500 mb-1">
                In your cart
              </p>
              <p className="text-lg font-black text-slate-900">
                {qty} × ₹{product.price} = ₹{qty * product.price}
              </p>
            </div>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-inner">
              <button
                onClick={removeFromCart}
                className="w-10 h-10 flex items-center justify-center text-slate-500 active:scale-90 transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-black text-slate-800">
                {qty}
              </span>
              <button
                onClick={addToCart}
                className="w-10 h-10 flex items-center justify-center text-white bg-emerald-600 active:scale-90 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-xs z-[100] whitespace-nowrap animate-slideUp">
          {toast}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

