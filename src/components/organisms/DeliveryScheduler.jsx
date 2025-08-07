import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, addDays, isToday, isTomorrow } from "date-fns";
import DeliverySlot from "@/components/molecules/DeliverySlot";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import deliveryService from "@/services/api/deliveryService";

const DeliveryScheduler = ({ 
  selectedSlot, 
  onSlotSelect, 
  onContinue,
  className = "" 
}) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDeliverySlots = async () => {
    try {
      setLoading(true);
      setError("");
      const slots = await deliveryService.getAvailableSlots();
      setAvailableSlots(slots);
    } catch (err) {
      setError("Failed to load delivery slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliverySlots();
  }, []);

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="space-y-2">
          <div className="h-6 w-48 bg-gray-200 rounded shimmer"></div>
          <div className="h-4 w-64 bg-gray-200 rounded shimmer"></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="p-4 bg-white rounded-xl shadow-md animate-pulse">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto shimmer"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3 mx-auto shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadDeliverySlots} className={className} />;
  }

  const groupSlotsByDate = () => {
    const grouped = {};
    availableSlots.forEach(slot => {
      if (!grouped[slot.date]) {
        grouped[slot.date] = [];
      }
      grouped[slot.date].push(slot);
    });
    return grouped;
  };

  const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEEE, MMM dd");
  };

  const groupedSlots = groupSlotsByDate();
  const dates = Object.keys(groupedSlots).sort();

  return (
    <motion.div
      className={`space-y-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ApperIcon name="Truck" size={20} className="text-primary" />
          <h2 className="text-2xl font-bold text-gray-900 font-display">Choose Delivery Time</h2>
        </div>
        <p className="text-gray-600 font-body">
          Select your preferred delivery window for fresh groceries
        </p>
      </div>

      <div className="space-y-6">
        {dates.map((date, dateIndex) => (
          <motion.div
            key={date}
            className="space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dateIndex * 0.1 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 font-display border-b pb-2">
              {formatDateHeader(date)}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {groupedSlots[date].map((slot, slotIndex) => (
                <motion.div
                  key={`${slot.date}-${slot.time}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (dateIndex * 0.1) + (slotIndex * 0.05) }}
                >
                  <DeliverySlot
                    slot={slot}
                    isSelected={selectedSlot && 
                      selectedSlot.date === slot.date && 
                      selectedSlot.time === slot.time}
                    onClick={onSlotSelect}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {selectedSlot && onContinue && (
        <motion.div
          className="flex justify-center pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={onContinue}
            size="large"
            className="flex items-center gap-2 shadow-lg px-8"
          >
            <ApperIcon name="ArrowRight" size={18} />
            Continue to Payment
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DeliveryScheduler;