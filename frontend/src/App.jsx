import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Welcome from './pages/Welcome';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import Account from './pages/Account';
import Settings from './pages/Settings';
import Offers from './pages/Offers';
import Orders from './pages/Orders';
import Address from './pages/Address';
import Tracking from './pages/Tracking';
import OrderSuccess from './pages/OrderSuccess';
import EReceipt from './pages/EReceipt';
import Support from './pages/Support';
import ActivityTracker from './components/ActivityTracker';
import DeviceMockup from './components/DeviceMockup';

import './index.css';

const ProtectedRoute = ({ children }) => {
  const sfContactId = localStorage.getItem('sfContactId');
  if (!sfContactId) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppContent = () => {
  const location = useLocation();
  
  // Determine if BottomNav should be hidden based on current path
  const hideNavPaths = ['/', '/login', '/register', '/order-success', '/payment', '/e-receipt', '/tracking', '/address', '/support'];
  const isHiddenPath = hideNavPaths.includes(location.pathname) || location.pathname.startsWith('/product/');
  const showNav = !isHiddenPath;

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/home" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/offers" element={<ProtectedRoute><Offers /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/address" element={<ProtectedRoute><Address /></ProtectedRoute>} />
        <Route path="/tracking" element={<ProtectedRoute><Tracking /></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
        <Route path="/e-receipt" element={<ProtectedRoute><EReceipt /></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showNav && <BottomNav />}
    </div>
  );
};

function App() {
  return (
    <DeviceMockup>
      <Router>
        <ActivityTracker />
        <AppContent />
      </Router>
    </DeviceMockup>
  );
}

export default App;
