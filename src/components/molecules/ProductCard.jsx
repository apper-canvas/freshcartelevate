import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const ProductCard = ({ product, onAddToCart, className = "" }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!product.inStock) return;
    
    setIsAdding(true);
    
    try {
      await onAddToCart(product);
      toast.success(`${product.name} added to cart!`, {
        position: "top-right",
        autoClose: 2000
      });
    } catch (error) {
      toast.error("Failed to add item to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      className={`product-card ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full overflow-hidden group">
        <div className="relative">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover transition-all duration-300 group-hover:scale-105"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
          />
          
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="error" className="text-sm font-semibold">
                Out of Stock
              </Badge>
            </div>
          )}

          {product.onSale && product.inStock && (
            <motion.div
              className="absolute top-2 left-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Badge variant="accent" className="shadow-md">
                <ApperIcon name="Zap" size={12} className="mr-1" />
                Sale
              </Badge>
            </motion.div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-2 mb-4">
            <h3 className="font-semibold text-gray-900 font-display line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 font-body">
              {product.unit}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.originalPrice && product.originalPrice !== product.price ? (
                <>
                  <span className="text-xl font-bold text-primary font-display">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-primary font-display">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="small"
                onClick={handleAddToCart}
                disabled={!product.inStock || isAdding}
                className={`${!product.inStock ? "opacity-50 cursor-not-allowed" : ""} min-w-[80px] shadow-md`}
              >
                {isAdding ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <ApperIcon name="Loader" size={16} />
                  </motion.div>
                ) : (
                  <>
                    <ApperIcon name="Plus" size={16} className="mr-1" />
                    Add
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;