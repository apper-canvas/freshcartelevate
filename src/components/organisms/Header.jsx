import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { AuthContext } from "../../App";

const Header = ({ cartCount = 0, onSearch, onCartClick, className = "" }) => {
const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  const handleSearch = (query) => {
    onSearch(query);
    if (query.trim()) {
      navigate("/search", { state: { query } });
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <motion.header
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm ${className}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-primary to-success rounded-lg flex items-center justify-center shadow-md">
                <ApperIcon name="ShoppingBag" size={20} className="text-white" />
              </div>
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent font-display">
                FreshCart
              </h1>
            </motion.div>

            {/* Desktop Search Bar */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-8">
              <SearchBar onSearch={handleSearch} />
            </div>

{/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Home" size={18} />
                Home
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate("/orders")}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Package" size={18} />
                Orders
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate("/settings")}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Settings" size={18} />
Settings
              </Button>

              <Button
                variant="ghost"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <ApperIcon name="LogOut" size={18} />
                Logout
              </Button>

              <motion.div className="relative">
                <Button
                  onClick={onCartClick}
                  className="flex items-center gap-2 shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ApperIcon name="ShoppingCart" size={18} />
                  Cart
                  {cartCount > 0 && (
                    <motion.span
                      className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-accent to-warning text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-md"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Button>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <motion.div className="relative">
                <Button
                  size="icon"
                  onClick={onCartClick}
                  className="shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ApperIcon name="ShoppingCart" size={18} />
                  {cartCount > 0 && (
                    <motion.span
                      className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-accent to-warning text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-md"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Button>
              </motion.div>

              <Button
                size="icon"
                variant="ghost"
                onClick={toggleMenu}
              >
                <ApperIcon name={isMenuOpen ? "X" : "Menu"} size={20} />
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden pb-4">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <motion.div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={toggleMenu}
        >
          <motion.div
            className="absolute top-0 right-0 w-64 h-full bg-white shadow-xl"
            initial={{ x: 256 }}
            animate={{ x: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 font-display">Menu</h2>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={toggleMenu}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
            </div>

<div className="p-4 space-y-2">
              <Button
                variant="ghost"
                onClick={() => {
                  navigate("/");
                  toggleMenu();
                }}
                className="w-full justify-start gap-3 h-12"
              >
                <ApperIcon name="Home" size={18} />
                Home
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  navigate("/orders");
                  toggleMenu();
                }}
                className="w-full justify-start gap-3 h-12"
              >
                <ApperIcon name="Package" size={18} />
                Orders
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  navigate("/settings");
                  toggleMenu();
                }}
                className="w-full justify-start gap-3 h-12"
              >
<ApperIcon name="Settings" size={18} />
                Settings
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
                className="w-full justify-start gap-3 h-12"
              >
                <ApperIcon name="LogOut" size={18} />
                Logout
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Header;