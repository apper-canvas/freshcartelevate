import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const BottomNavigation = ({ cartCount = 0, onCartClick, className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: "Home",
      path: "/",
      onClick: () => navigate("/")
    },
    {
      id: "search",
      label: "Search",
      icon: "Search",
      path: "/search",
      onClick: () => navigate("/search")
    },
    {
      id: "cart",
      label: "Cart",
      icon: "ShoppingCart",
      path: "/cart",
      onClick: onCartClick,
      badge: cartCount
    },
    {
      id: "orders",
      label: "Orders",
      icon: "Package",
      path: "/orders",
      onClick: () => navigate("/orders")
    }
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bottom-nav ${className}`}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item, index) => (
          <motion.button
            key={item.id}
            onClick={item.onClick}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 ${
              isActive(item.path)
                ? "text-primary bg-primary/10"
                : "text-gray-600 hover:text-primary hover:bg-gray-50"
            }`}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="relative">
              <ApperIcon 
                name={item.icon} 
                size={20} 
                className={isActive(item.path) ? "text-primary" : "text-current"} 
              />
              {item.badge && item.badge > 0 && (
                <motion.span
                  className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-accent to-warning text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-md"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {item.badge}
                </motion.span>
              )}
            </div>
            <span className={`text-xs mt-1 font-body ${
              isActive(item.path) ? "font-semibold" : "font-medium"
            }`}>
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
};

export default BottomNavigation;