import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import storeService from "@/services/api/storeService";

const ProductCard = ({ product, onAddToCart, className = "" }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [bestStore, setBestStore] = useState(null);
  const [loadingStore, setLoadingStore] = useState(false);

  // Get best store for this product
  useEffect(() => {
    const findBestStore = async () => {
      if (!product.storeInventory || product.storeInventory.length === 0) return;
      
      const availableStores = product.storeInventory.filter(inv => inv.available);
      if (availableStores.length > 0) {
        const best = availableStores.reduce((prev, current) => 
          (prev.stock > current.stock) ? prev : current
        );
        setBestStore(best);
      }
    };
    
    findBestStore();
  }, [product.storeInventory]);

  const handleAddToCart = async () => {
    if (!product.inStock && !bestStore) return;
    
    setIsAdding(true);
    setLoadingStore(true);
    
    try {
      let selectedStore = null;
      
      // If we have store inventory, find the best store
      if (bestStore) {
        selectedStore = bestStore;
      } else {
        // Try to find best store dynamically
        try {
          const storeResult = await storeService.findBestStore(product.Id);
          selectedStore = storeResult?.store;
        } catch (error) {
          // Continue without store selection
        }
      }
      
      await onAddToCart(product, selectedStore);
      
      const storeText = selectedStore ? ` from ${selectedStore.storeName}` : '';
      toast.success(`${product.name} added to cart${storeText}!`, {
        position: "top-right",
        autoClose: 2000
      });
    } catch (error) {
      toast.error("Failed to add item to cart");
    } finally {
      setIsAdding(false);
      setLoadingStore(false);
    }
  };

  const handleQuickOrder = async () => {
    if (!bestStore) return;
    
    setIsAdding(true);
    
    try {
      await onAddToCart(product, bestStore);
      toast.success(`Quick order: ${product.name} from ${bestStore.storeName}!`, {
        position: "top-right",
        autoClose: 2000
      });
    } catch (error) {
      toast.error("Quick order failed");
    } finally {
      setIsAdding(false);
    }
  };

  const getTotalAvailableStock = () => {
    if (!product.storeInventory) return 0;
    return product.storeInventory.reduce((total, inv) => total + (inv.available ? inv.stock : 0), 0);
  };

  const hasInventory = product.storeInventory && product.storeInventory.length > 0;
  const totalStock = getTotalAvailableStock();
  const isAvailable = product.inStock || totalStock > 0;

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
          
          {!isAvailable && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="error" className="text-sm font-semibold">
                Out of Stock
              </Badge>
            </div>
          )}

          {product.onSale && isAvailable && (
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

          {/* Store Inventory Toggle */}
          {hasInventory && isAvailable && (
            <motion.button
              className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-colors duration-200"
              onClick={() => setShowInventory(!showInventory)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <ApperIcon name="Store" size={14} className="text-primary" />
            </motion.button>
          )}

          {/* Best Store Badge */}
          {bestStore && !showInventory && (
            <motion.div
              className="absolute bottom-2 left-2"
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Badge variant="success" className="text-xs shadow-md">
                <ApperIcon name="MapPin" size={10} className="mr-1" />
                {bestStore.storeName} ({bestStore.stock})
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

          {/* Store Inventory Display */}
          <AnimatePresence>
            {showInventory && hasInventory && (
              <motion.div
                className="mb-4 p-2 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-1">
                  {product.storeInventory.map((inv, index) => (
                    <div key={inv.storeId} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 truncate flex-1">
                        {inv.storeName}
                      </span>
                      <Badge 
                        variant={inv.available ? "success" : "secondary"} 
                        className="text-xs ml-2"
                      >
                        {inv.available ? inv.stock : "Out"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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

            <div className="flex items-center gap-2">
              {/* Quick Order Button */}
              {bestStore && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={handleQuickOrder}
                    disabled={isAdding}
                    className="min-w-[60px] shadow-md"
                  >
                    {loadingStore ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <ApperIcon name="Loader" size={14} />
                      </motion.div>
                    ) : (
                      <ApperIcon name="Zap" size={14} />
                    )}
                  </Button>
                </motion.div>
              )}

              {/* Regular Add Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="small"
                  onClick={handleAddToCart}
                  disabled={!isAvailable || isAdding}
                  className={`${!isAvailable ? "opacity-50 cursor-not-allowed" : ""} min-w-[80px] shadow-md`}
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
          </div>

          {/* Total Inventory Badge */}
          {hasInventory && totalStock > 0 && (
            <motion.div
              className="mt-2 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Badge variant="secondary" className="text-xs">
                <ApperIcon name="Package" size={10} className="mr-1" />
                {totalStock} available across stores
              </Badge>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;