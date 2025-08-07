import React from "react";
import { motion } from "framer-motion";
import { format, isToday, isTomorrow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";

const DeliverySlot = ({ 
  slot, 
  isSelected, 
  onClick, 
  className = "" 
}) => {
  const formatSlotDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "MMM dd");
  };

  const formatSlotTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, "h:mm a");
  };

  return (
    <motion.button
      onClick={() => slot.available && onClick(slot)}
      disabled={!slot.available}
      className={`delivery-slot p-4 rounded-xl text-center transition-all duration-200 ease-out ${
        !slot.available
          ? "opacity-50 cursor-not-allowed bg-gray-50"
          : isSelected
          ? "selected shadow-lg"
          : "available hover:shadow-md bg-white"
      } ${className}`}
      whileHover={slot.available ? { scale: 1.02 } : {}}
      whileTap={slot.available ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-current/10 mb-1">
          {slot.available ? (
            <ApperIcon 
              name="Clock" 
              size={16} 
              className={isSelected ? "text-white" : "text-primary"} 
            />
          ) : (
            <ApperIcon name="X" size={16} className="text-gray-400" />
          )}
        </div>
        
        <div className="space-y-1">
          <p className={`text-sm font-semibold font-display ${
            isSelected ? "text-white" : "text-gray-900"
          }`}>
            {formatSlotDate(slot.date)}
          </p>
          <p className={`text-xs font-body ${
            isSelected ? "text-white/90" : "text-gray-600"
          }`}>
            {formatSlotTime(slot.time)}
          </p>
        </div>

        {!slot.available && (
          <p className="text-xs text-gray-400 font-body">Unavailable</p>
        )}
      </div>
    </motion.button>
  );
};

export default DeliverySlot;