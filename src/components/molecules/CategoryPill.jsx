import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const CategoryPill = ({ 
  category, 
  isActive, 
  onClick, 
  className = "" 
}) => {
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      "All": "Grid3X3",
      "Produce": "Apple",
      "Dairy": "Milk",
      "Meat": "Beef",
      "Pantry": "Package",
      "Bakery": "Croissant",
      "Frozen": "Snowflake",
      "Beverages": "Coffee",
      "Snacks": "Cookie"
    };
    return iconMap[categoryName] || "Package";
  };

  return (
    <motion.button
      onClick={() => onClick(category)}
      className={`category-pill flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ease-out shadow-md ${
        isActive
          ? "active shadow-lg"
          : "bg-white text-gray-700 hover:shadow-lg"
      } ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <ApperIcon 
        name={getCategoryIcon(category)} 
        size={16} 
        className={isActive ? "text-white" : "text-primary"} 
      />
      <span className="font-body">{category}</span>
    </motion.button>
  );
};

export default CategoryPill;