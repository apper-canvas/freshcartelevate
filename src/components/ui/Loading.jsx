import React from "react";
import { motion } from "framer-motion";

const Loading = ({ type = "default", className = "" }) => {
  if (type === "products") {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="animate-pulse">
              <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 shimmer"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3 shimmer"></div>
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-gradient-to-r from-primary/20 to-success/20 rounded w-1/3 shimmer"></div>
                  <div className="h-8 w-20 bg-gradient-to-r from-accent/20 to-warning/20 rounded shimmer"></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "categories") {
    return (
      <div className={`flex flex-wrap gap-3 ${className}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md animate-pulse"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="w-5 h-5 bg-gradient-to-br from-gray-200 to-gray-300 rounded shimmer"></div>
            <div className="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "cart") {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 3 }).map((_, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md animate-pulse"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg shimmer"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3 shimmer"></div>
            </div>
            <div className="h-8 w-20 bg-gradient-to-r from-accent/20 to-warning/20 rounded shimmer"></div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="w-8 h-8 bg-gradient-to-r from-primary to-success rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <span className="text-lg font-medium text-gray-600 font-display">Loading fresh products...</span>
      </motion.div>
    </div>
  );
};

export default Loading;