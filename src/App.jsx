import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import BottomNavigation from "@/components/organisms/BottomNavigation";
import Cart from "@/components/organisms/Cart";
import Home from "@/components/pages/Home";
import Search from "@/components/pages/Search";
import Checkout from "@/components/pages/Checkout";
import Orders from "@/components/pages/Orders";
import cartService from "@/services/api/cartService";

const App = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const updateCartCount = useCallback(async () => {
    try {
      const count = await cartService.getCartCount();
      setCartCount(count);
    } catch (error) {
      console.error("Failed to update cart count:", error);
    }
  }, []);

  useEffect(() => {
    updateCartCount();
  }, [updateCartCount]);

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const handleSearch = (query) => {
    // Search functionality is handled by individual page components
  };

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header
          cartCount={cartCount}
          onSearch={handleSearch}
          onCartClick={handleCartClick}
        />

        <main className="flex-1">
          <Routes>
            <Route 
              path="/" 
              element={<Home onCartUpdate={updateCartCount} />} 
            />
            <Route 
              path="/search" 
              element={<Search onCartUpdate={updateCartCount} />} 
            />
            <Route 
              path="/checkout" 
              element={<Checkout />} 
            />
            <Route 
              path="/orders" 
              element={<Orders />} 
            />
          </Routes>
        </main>

        <BottomNavigation
          cartCount={cartCount}
          onCartClick={handleCartClick}
        />

        <Cart
          isOpen={isCartOpen}
          onClose={handleCloseCart}
          onUpdateCart={updateCartCount}
        />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
};

export default App;