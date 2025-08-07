import React, { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/molecules/ProductCard";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const ProductRecommendations = ({ recommendations, onAddToCart }) => {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (product) => {
    try {
      setLoading(true);
      await onAddToCart(product);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add item to cart");
    } finally {
      setLoading(false);
    }
  };

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="border-t border-gray-200 pt-6 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-primary to-success rounded-lg">
          <ApperIcon name="Heart" size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            You might also like
          </h3>
          <p className="text-sm text-gray-600">
            Based on items in your cart
          </p>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.map((product, index) => (
          <motion.div
            key={product.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <ProductCard
              product={product}
              onAddToCart={handleAddToCart}
              className="h-full"
            />
            
            {/* Quick Add Overlay for Mobile */}
            <div className="lg:hidden absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent rounded-b-lg">
              <button
                onClick={() => handleAddToCart(product)}
                disabled={loading}
                className="w-full py-2 px-4 bg-white/90 backdrop-blur-sm text-primary font-medium rounded-lg text-sm transition-all hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <ApperIcon name="Plus" size={16} />
                    Add to Cart
                  </div>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Message */}
      <motion.div
        className="mt-4 p-3 bg-background rounded-lg border border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-sm text-gray-600 text-center flex items-center justify-center gap-2">
          <ApperIcon name="Sparkles" size={16} className="text-primary" />
          Products recommended based on your shopping preferences
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ProductRecommendations;