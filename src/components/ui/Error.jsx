import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  title = "Oops! Something went wrong", 
  message = "We couldn't load your fresh groceries. Please try again.", 
  onRetry,
  className = "" 
}) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-24 h-24 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center mb-6 shadow-lg"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
      >
        <ApperIcon name="AlertTriangle" size={40} className="text-white" />
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
        className="text-gray-600 mb-8 max-w-md font-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {message}
      </motion.p>

      <motion.div
        className="flex gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {onRetry && (
          <Button 
            onClick={onRetry}
            className="flex items-center gap-2"
          >
            <ApperIcon name="RefreshCw" size={18} />
            Try Again
          </Button>
        )}
        
        <Button 
          variant="outline"
          onClick={() => window.location.reload()}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Home" size={18} />
          Go Home
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Error;