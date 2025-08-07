import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import ProductGrid from "@/components/organisms/ProductGrid";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import cartService from "@/services/api/cartService";

const Search = ({ onCartUpdate }) => {
  const location = useLocation();
  const initialQuery = location.state?.query || "";
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setSelectedCategory("All"); // Reset category when searching
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const handleAddToCart = useCallback(async (product) => {
    await cartService.addItem({
      productId: product.Id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: product.image,
      quantity: 1
    });
    onCartUpdate();
  }, [onCartUpdate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        {/* Search Header */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3">
            <ApperIcon name="Search" size={24} className="text-primary" />
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 font-display">
              Search Products
            </h1>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:block max-w-2xl">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search for fresh groceries..."
            />
          </div>

          {searchQuery && (
            <motion.p
              className="text-gray-600 font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {searchQuery ? `Showing results for "${searchQuery}"` : "Browse all products"}
            </motion.p>
          )}
        </motion.div>

        {/* Search Results */}
        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <ProductGrid
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            onAddToCart={handleAddToCart}
          />
        </motion.section>

        {/* Mobile spacing for bottom nav */}
        <div className="lg:hidden h-20"></div>
      </div>
    </div>
  );
};

export default Search;