import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import ProductGrid from "@/components/organisms/ProductGrid";
import QuickReorder from "@/components/organisms/QuickReorder";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import cartService from "@/services/api/cartService";
import storeService from "@/services/api/storeService";
const Home = ({ onCartUpdate }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    setSearchQuery(""); // Clear search when changing category
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-8">
        {/* Hero Section */}
        <motion.div
          className="text-center space-y-4 py-8 lg:py-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent font-display"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Fresh Groceries Delivered
          </motion.h1>
          <motion.p
            className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto font-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Get farm-fresh produce and quality groceries delivered to your door in under 2 hours
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-600 font-body">
              <ApperIcon name="Clock" size={16} className="text-success" />
              <span>2-hour delivery</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 font-body">
              <ApperIcon name="Leaf" size={16} className="text-success" />
              <span>Fresh & organic</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 font-body">
              <ApperIcon name="Shield" size={16} className="text-success" />
              <span>Quality guaranteed</span>
            </div>
          </motion.div>
        </motion.div>

{/* Quick Reorder Carousel Section */}
        <motion.section
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <QuickReorder onAddToCart={handleAddToCart} />
        </motion.section>

        {/* Main Products Section */}
        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <ApperIcon name="ShoppingBag" size={20} className="text-primary" />
            <h2 className="text-2xl font-bold text-gray-900 font-display">Shop by Category</h2>
          </div>
          
          <ProductGrid
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            onAddToCart={handleAddToCart}
          />
        </motion.section>

        {/* Promotional Banner */}
        <motion.section
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-accent to-warning rounded-2xl p-6 lg:p-8 text-white text-center shadow-xl">
            <div className="max-w-3xl mx-auto space-y-4">
              <h3 className="text-2xl lg:text-3xl font-bold font-display">
                Free Delivery on Orders $50+
              </h3>
              <p className="text-lg font-body text-white/90">
                Stock up on your favorites and get free same-day delivery
              </p>
              <Button
                variant="outline"
                size="large"
                className="bg-white text-accent border-white hover:bg-white/90 shadow-lg"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <ApperIcon name="ArrowUp" size={18} className="mr-2" />
                Shop Now
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Floating Action for Mobile */}
        <div className="lg:hidden h-20"></div>
      </div>
    </div>
  );
};

export default Home;