import { createContext, useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from "react-toastify";
import { setUser, clearUser } from './store/userSlice';
import Login from '@/components/pages/Login';
import Signup from '@/components/pages/Signup';
import Callback from '@/components/pages/Callback';
import ErrorPage from '@/components/pages/ErrorPage';
import ResetPassword from '@/components/pages/ResetPassword';
import PromptPassword from '@/components/pages/PromptPassword';
import Header from "@/components/organisms/Header";
import BottomNavigation from "@/components/organisms/BottomNavigation";
import Cart from "@/components/organisms/Cart";
import Home from "@/components/pages/Home";
import Search from "@/components/pages/Search";
import Checkout from "@/components/pages/Checkout";
import Orders from "@/components/pages/Orders";
import Settings from "@/components/pages/Settings";
import cartService from "@/services/api/cartService";

export const AuthContext = createContext(null);

function AppContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;

  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error') || 
                           currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
        
        if (user) {
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            );
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`);
            } else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
  }, []);

  const updateCartCount = useCallback(async () => {
    try {
      const count = await cartService.getCartCount();
      setCartCount(count);
    } catch (error) {
      console.error("Failed to update cart count:", error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      updateCartCount();
    }
  }, [updateCartCount, isAuthenticated]);

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const handleSearch = (query) => {
    // Search functionality is handled by individual page components
  };

  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  if (!isInitialized) {
    return <div className="loading flex items-center justify-center p-6 h-full w-full"><svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path></svg></div>;
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
          <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
          <Route path="/" element={
            <>
              <Header
                cartCount={cartCount}
                onSearch={handleSearch}
                onCartClick={handleCartClick}
              />
              <main className="flex-1">
                <Home onCartUpdate={updateCartCount} />
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
            </>
          } />
          <Route path="/search" element={
            <>
              <Header
                cartCount={cartCount}
                onSearch={handleSearch}
                onCartClick={handleCartClick}
              />
              <main className="flex-1">
                <Search onCartUpdate={updateCartCount} />
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
            </>
          } />
          <Route path="/checkout" element={
            <>
              <Header
                cartCount={cartCount}
                onSearch={handleSearch}
                onCartClick={handleCartClick}
              />
              <main className="flex-1">
                <Checkout />
              </main>
              <BottomNavigation
                cartCount={cartCount}
                onCartClick={handleCartClick}
              />
            </>
          } />
          <Route path="/orders" element={
            <>
              <Header
                cartCount={cartCount}
                onSearch={handleSearch}
                onCartClick={handleCartClick}
              />
              <main className="flex-1">
                <Orders />
              </main>
              <BottomNavigation
                cartCount={cartCount}
                onCartClick={handleCartClick}
              />
            </>
          } />
          <Route path="/settings" element={
            <>
              <Header
                cartCount={cartCount}
                onSearch={handleSearch}
                onCartClick={handleCartClick}
              />
              <main className="flex-1">
                <Settings />
              </main>
              <BottomNavigation
                cartCount={cartCount}
                onCartClick={handleCartClick}
              />
            </>
          } />
        </Routes>

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
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;