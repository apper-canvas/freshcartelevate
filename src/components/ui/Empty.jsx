import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "Your cart is empty", 
  message = "Add some fresh groceries to get started!", 
  actionText = "Start Shopping",
  onAction,
  icon = "ShoppingCart",
  className = "" 
}) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-32 h-32 bg-gradient-to-br from-background to-gray-100 rounded-full flex items-center justify-center mb-6 shadow-md border-4 border-primary/10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
      >
        <ApperIcon name={icon} size={48} className="text-primary" />
      </motion.div>

      <motion.h3
        className="text-2xl font-bold text-gray-900 mb-2 font-display"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.h3>

      <motion.p
        className="text-gray-600 mb-8 max-w-sm font-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {message}
      </motion.p>

      {onAction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button 
            onClick={onAction}
            size="large"
            className="flex items-center gap-2 shadow-lg"
          >
            <ApperIcon name="Plus" size={20} />
            {actionText}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Empty;