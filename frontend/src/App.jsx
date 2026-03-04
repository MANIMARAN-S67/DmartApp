import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import Account from './pages/Account';
import Offers from './pages/Offers';
import Orders from './pages/Orders';
import Address from './pages/Address';
import Tracking from './pages/Tracking';
import OrderSuccess from './pages/OrderSuccess';
import EReceipt from './pages/EReceipt';
import Support from './pages/Support';

import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container max-w-[480px] mx-auto bg-white min-h-screen">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/account" element={<Account />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/address" element={<Address />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/e-receipt" element={<EReceipt />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
