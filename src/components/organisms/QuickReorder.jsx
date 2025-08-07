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
        </div>
        <Button
          variant="ghost"
          size="small"
          onClick={loadReorderItems}
          className="text-primary"
        >
          <ApperIcon name="RefreshCw" size={16} className="mr-1" />
          Refresh
        </Button>
      </div>

      <motion.div
        className="grid grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {reorderItems.map((product, index) => (
          <motion.div
            key={product.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
              className="h-full"
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default QuickReorder;