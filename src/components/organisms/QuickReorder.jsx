import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/molecules/ProductCard";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import orderService from "@/services/api/orderService";
import productService from "@/services/api/productService";

const QuickReorder = ({ onAddToCart, className = "" }) => {
  const [reorderItems, setReorderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReorderItems = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Get recent orders and extract frequently ordered items
      const orders = await orderService.getAll();
      const products = await productService.getAll();
      
      // Count product frequency from orders
      const productFrequency = {};
      orders.forEach(order => {
        order.items.forEach(item => {
          productFrequency[item.productId] = (productFrequency[item.productId] || 0) + item.quantity;
        });
      });

      // Get top 6 most frequently ordered products
      const topProductIds = Object.entries(productFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 6)
        .map(([productId]) => parseInt(productId));

      const frequentProducts = products.filter(product => 
        topProductIds.includes(product.Id)
      );

      setReorderItems(frequentProducts);
      
    } catch (err) {
      setError("Failed to load quick reorder items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReorderItems();
  }, []);

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-gray-200 rounded shimmer"></div>
          <div className="h-8 w-20 bg-gray-200 rounded shimmer"></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
              <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 shimmer"></div>
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
                <div className="h-4 bg-gradient-to-r from-primary/20 to-success/20 rounded w-1/2 shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadReorderItems} className={className} />;
  }

  if (reorderItems.length === 0) {
    return (
      <Empty
        title="No previous orders"
        message="Start shopping to see your favorites here!"
        actionText="Browse Products"
        onAction={() => window.scrollTo({ top: 400, behavior: "smooth" })}
        icon="RotateCcw"
        className={className}
      />
    );
  }

return (
    <motion.div
      className={`space-y-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ApperIcon name="RotateCcw" size={20} className="text-primary" />
          <h2 className="text-xl font-bold text-gray-900 font-display">Quick Reorder</h2>
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent text-xs rounded-full font-medium">
            <ApperIcon name="Star" size={12} />
            Your favorites
          </div>
        </div>
        <Button
          variant="ghost"
          size="small"
          onClick={loadReorderItems}
          className="text-primary hover:bg-primary/5"
        >
          <ApperIcon name="RefreshCw" size={16} className="mr-1" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {/* Carousel Container */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {/* Scroll Hint */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-600 font-body">
            Swipe to see more frequently purchased items
          </p>
          <div className="flex gap-1">
            {Array.from({ length: Math.ceil(reorderItems.length / 2) }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
            ))}
          </div>
        </div>

        {/* Carousel */}
        <div className="quick-reorder-carousel overflow-x-auto pb-4">
          <div className="flex gap-4" style={{ width: `${reorderItems.length * 180}px` }}>
            {reorderItems.map((product, index) => (
              <motion.div
                key={product.Id}
                className="flex-none w-44"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="relative">
                  {/* Frequency Badge */}
                  <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-success to-primary text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    #{ index + 1 }
                  </div>
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                    className="h-full carousel-card"
                  />
                </div>
              </motion.div>
            ))}
            
            {/* More Items Indicator */}
            <motion.div
              className="flex-none w-44 flex items-center justify-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: reorderItems.length * 0.05 }}
            >
              <div className="bg-gradient-to-br from-primary/5 to-success/5 rounded-xl border-2 border-dashed border-primary/20 h-full w-full flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:border-primary/40 hover:bg-primary/10 transition-all duration-200">
                <ApperIcon name="Plus" size={24} className="text-primary mb-2" />
                <p className="text-sm font-medium text-gray-700 mb-1">Explore More</p>
                <p className="text-xs text-gray-500">Browse all products</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Gradient Overlays for Scroll Indication */}
        <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
        <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
      </motion.div>
    </motion.div>
  );
};

export default QuickReorder;