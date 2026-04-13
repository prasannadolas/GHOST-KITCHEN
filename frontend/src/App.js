import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Kitchens from './pages/Kitchens';
import KitchenDetail from './pages/KitchenDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';

import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

import Dashboard from './pages/admin/Dashboard';
import OrderManagement from './pages/admin/OrderManagement';
import MenuManagement from './pages/admin/MenuManagement';
import AddMenuItem from './pages/admin/AddMenuItem';
import KitchenManagement from './pages/admin/KitchenManagement'

function App() {
  return (
    <Router>
      <div className="App flex flex-col min-h-screen">
        <Navbar />
        
        {/* Everything inside <Routes> changes based on the URL */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Main Pages Routes */}
            {<Route path="/login" element={<Login />} />}
            {<Route path="/register" element={<Register />} />}
            {<Route path="/kitchens" element={<Kitchens />} /> }
            {<Route path="/kitchen/:id" element={<KitchenDetail />} />}
            {<Route path="/cart" element={<Cart />} />}
            {<Route path="/checkout" element={<Checkout />} />}
            {<Route path="/order-confirmation/:id" element={<OrderConfirmation />} />}
            {<Route path="/orders" element={<Orders />} />}

            {/* --- Footer-Pages ROUTES --- */}
            {<Route path="/about" element={<About />} />}
            {<Route path="/contact" element={<Contact />} />}
            {<Route path="/faq" element={<FAQ />} />}
            {<Route path="/privacy" element={<Privacy />} />}
            {<Route path="/terms" element={<Terms />} />}
            {<Route path="*" element={<NotFound />} />}

            {/* --- PROTECTED ADMIN ROUTES --- */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin', 'kitchen_owner']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/orders" element={
          <ProtectedRoute allowedRoles={['admin', 'kitchen_owner']}>
            <OrderManagement />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/menu" element={
          <ProtectedRoute allowedRoles={['admin', 'kitchen_owner']}>
            <MenuManagement />
          </ProtectedRoute>
        } />

        <Route path="/admin/menu/add" element={
          <ProtectedRoute allowedRoles={['admin', 'kitchen_owner']}>
            <AddMenuItem />
          </ProtectedRoute>
        } />

        <Route path="/admin/kitchens" element={
          <ProtectedRoute>
            <KitchenManagement />
          </ProtectedRoute>} />

          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
