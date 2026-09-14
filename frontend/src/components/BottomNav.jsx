import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, Tag, ShoppingCart, User } from 'lucide-react';

const BottomNav = () => {
    const [cartCount, setCartCount] = useState(0);
    const [userPhoto, setUserPhoto] = useState(localStorage.getItem('userPhoto') || null);

    useEffect(() => {
        const updateState = () => {
            const c = JSON.parse(localStorage.getItem('dmartCart') || '[]');
            setCartCount(c.reduce((a, i) => a + i.qty, 0));
            setUserPhoto(localStorage.getItem('userPhoto') || null);
        };
        
        updateState();
        
        window.addEventListener('storage', updateState);
        const interval = setInterval(updateState, 500);
        
        return () => {
            window.removeEventListener('storage', updateState);
            clearInterval(interval);
        };
    }, []);

    return (
        <nav className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t border-slate-100 flex items-center justify-around px-2 h-[60px] z-[999] shadow-[0_-4px_20px_rgba(0,0,0,0.07)]">
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
    );
};

export default BottomNav;
