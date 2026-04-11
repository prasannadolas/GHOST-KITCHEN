import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="App flex flex-col min-h-screen">
        <Navbar />
        
        {/* Everything inside <Routes> changes based on the URL */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* We will add these routes in the next sections: */}
            {<Route path="/login" element={<Login />} />}
            {<Route path="/register" element={<Register />} />}
            {<Route path="/kitchens" element={<Kitchens />} /> }
            {<Route path="/kitchen/:id" element={<KitchenDetail />} />}
            {<Route path="/cart" element={<Cart />} />}
            {<Route path="/checkout" element={<Checkout />} />}
            {<Route path="/order-confirmation/:id" element={<OrderConfirmation />} />}
            {<Route path="/orders" element={<Orders />} />}
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
