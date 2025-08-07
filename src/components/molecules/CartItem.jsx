import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const CartItem = ({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  className = "" 
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) {
      handleRemove();
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdateQuantity(item.productId, newQuantity);
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      await onRemove(item.productId);
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  return (
    <motion.div
      className={`flex items-center gap-4 p-4 bg-white rounded-xl shadow-md border border-gray-100 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      layout
      transition={{ duration: 0.2 }}
    >
      <motion.img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      />

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 font-display truncate">
          {item.name}
        </h4>
        <p className="text-sm text-gray-600 font-body">
          {item.unit}
        </p>
        <p className="text-lg font-bold text-primary font-display">
          ${item.price.toFixed(2)}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          size="icon"
          variant="outline"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={isUpdating || item.quantity <= 1}
          className="w-8 h-8"
        >
          <ApperIcon name="Minus" size={14} />
        </Button>

        <span className="w-8 text-center font-semibold text-gray-900 font-body">
          {item.quantity}
        </span>

        <Button
          size="icon"
          variant="outline"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={isUpdating}
          className="w-8 h-8"
        >
          <ApperIcon name="Plus" size={14} />
        </Button>
      </div>

      <Button
        size="icon"
        variant="ghost"
        onClick={handleRemove}
        className="text-error hover:bg-error/10 w-8 h-8 flex-shrink-0"
      >
        <ApperIcon name="Trash2" size={16} />
      </Button>
    </motion.div>
  );
};

export default CartItem;