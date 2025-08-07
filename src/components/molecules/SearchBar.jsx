import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ onSearch, placeholder = "Search for fresh groceries...", className = "" }) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    onSearch(query.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.trim()) {
        onSearch(query.trim());
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, onSearch]);

  return (
    <motion.div
      className={`relative flex items-center ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex-1">
        <motion.div
          className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
          animate={{ scale: isFocused ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <ApperIcon name="Search" size={18} className="text-gray-400" />
        </motion.div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full h-12 pl-10 pr-10 rounded-lg border-2 border-gray-200 bg-white text-base transition-all duration-200 ease-out placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none font-body"
        />

        {query && (
          <motion.button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
            onClick={handleClear}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="X" size={16} className="text-gray-400" />
          </motion.button>
        )}
      </div>

      <Button
        onClick={handleSearch}
        className="ml-3 h-12 px-6 shadow-md"
        variant="primary"
      >
        <ApperIcon name="Search" size={18} />
      </Button>
    </motion.div>
  );
};

export default SearchBar;