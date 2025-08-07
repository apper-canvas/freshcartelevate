import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, addHours, isAfter } from 'date-fns';
import { Card, CardContent } from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const OrderTracking = ({ order }) => {
  const [trackingData, setTrackingData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Define tracking steps
  const trackingSteps = [
    {
      id: 'confirmed',
      label: 'Order Confirmed',
      icon: 'CheckCircle',
      description: 'Your order has been confirmed and is being prepared'
    },
    {
      id: 'preparing',
      label: 'Preparing Order',
      icon: 'Package',
      description: 'Your items are being carefully selected and packed'
    },
    {
      id: 'out_for_delivery',
      label: 'Out for Delivery',
      icon: 'Truck',
      description: 'Your order is on the way to your address'
    },
    {
      id: 'delivered',
      label: 'Delivered',
      icon: 'Home',
      description: 'Your order has been successfully delivered'
    }
  ];

  // Calculate estimated arrival time
  const getEstimatedArrival = () => {
    if (!order.deliverySlot) return null;
    
    const deliveryDate = new Date(`${order.deliverySlot.date}T${order.deliverySlot.time}:00`);
    const now = new Date();
    
    // If delivery time has passed, show as delivered
    if (isAfter(now, deliveryDate)) {
      return deliveryDate;
    }

    // Calculate estimated time based on current status
    switch (order.status) {
      case 'confirmed':
        return addHours(deliveryDate, -2); // 2 hours before delivery slot
      case 'preparing':
        return addHours(deliveryDate, -1); // 1 hour before delivery slot
      case 'out_for_delivery':
        return addHours(deliveryDate, -0.5); // 30 minutes before delivery slot
      default:
        return deliveryDate;
    }
  };

  // Get current step index based on order status
  const getCurrentStepIndex = () => {
    const statusMap = {
      'confirmed': 0,
      'preparing': 1,
      'out_for_delivery': 2,
      'delivered': 3
    };
    return statusMap[order.status] || 0;
  };

  // Simulate real-time updates
  useEffect(() => {
    let interval;
    
    const simulateTracking = () => {
      const stepIndex = getCurrentStepIndex();
      setCurrentStep(stepIndex);

      // Generate mock tracking events
      const events = [
        {
          timestamp: order.createdAt,
          status: 'confirmed',
          message: 'Order confirmed and payment processed',
          location: 'FreshCart Store'
        }
      ];

      if (stepIndex >= 1) {
        events.push({
          timestamp: new Date(order.createdAt).getTime() + 30 * 60 * 1000, // +30 minutes
          status: 'preparing',
          message: 'Items being selected and quality checked',
          location: 'FreshCart Store'
        });
      }

      if (stepIndex >= 2) {
        events.push({
          timestamp: new Date(order.createdAt).getTime() + 90 * 60 * 1000, // +90 minutes
          status: 'out_for_delivery',
          message: 'Package loaded and en route',
          location: 'Distribution Center'
        });
      }

      if (stepIndex >= 3) {
        events.push({
          timestamp: new Date(`${order.deliverySlot.date}T${order.deliverySlot.time}:00`).getTime(),
          status: 'delivered',
          message: 'Successfully delivered to your address',
          location: order.deliveryAddress.street
        });
      }

      setTrackingData({
        estimatedArrival: getEstimatedArrival(),
        events: events.sort((a, b) => b.timestamp - a.timestamp)
      });
    };

    simulateTracking();

    // Update tracking data every 30 seconds for active orders
    if (order.status !== 'delivered') {
      interval = setInterval(simulateTracking, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [order]);

  // Show status change notifications
  useEffect(() => {
    if (trackingData && currentStep > 0) {
      const currentStepData = trackingSteps[currentStep];
      if (currentStepData && order.status !== 'delivered') {
        toast.info(`Order Update: ${currentStepData.label}`, {
          position: "top-right",
          autoClose: 5000
        });
      }
    }
  }, [currentStep]);

  if (!trackingData) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Loading tracking information...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Order Tracking</h3>
          <Badge 
            variant={order.status === 'delivered' ? 'success' : 'info'}
            className="text-sm"
          >
            {trackingSteps[currentStep]?.label || 'Processing'}
          </Badge>
        </div>

        {/* Estimated Arrival */}
        {trackingData.estimatedArrival && order.status !== 'delivered' && (
          <motion.div
            className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <ApperIcon name="Clock" size={20} className="text-primary mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Estimated Arrival</p>
                <p className="text-lg font-semibold text-primary">
                  {format(trackingData.estimatedArrival, 'MMM dd, yyyy • h:mm a')}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Progress Steps */}
        <div className="relative mb-8">
          {trackingSteps.map((step, index) => (
            <div key={step.id} className="flex items-start relative">
              {/* Connector Line */}
              {index < trackingSteps.length - 1 && (
                <div 
                  className={`absolute left-6 top-12 w-0.5 h-16 ${
                    index < currentStep ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              )}
              
              <motion.div
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Step Icon */}
                <div className={`
                  flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 relative z-10
                  ${index <= currentStep 
                    ? 'bg-primary border-primary text-white' 
                    : 'bg-white border-gray-200 text-gray-400'
                  }
                `}>
                  <ApperIcon name={step.icon} size={20} />
                </div>

                {/* Step Content */}
                <div className="ml-4 pb-8">
                  <h4 className={`font-medium ${
                    index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </h4>
                  <p className={`text-sm mt-1 ${
                    index <= currentStep ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {step.description}
                  </p>
                  
                  {/* Show timestamp for completed steps */}
                  {index <= currentStep && trackingData.events[trackingSteps.length - 1 - index] && (
                    <p className="text-xs text-primary mt-2">
                      {format(new Date(trackingData.events[trackingSteps.length - 1 - index].timestamp), 'MMM dd • h:mm a')}
                    </p>
                  )}
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Recent Activity</h4>
          <div className="space-y-3">
            {trackingData.events.slice(0, 3).map((event, index) => (
              <motion.div
                key={index}
                className="flex items-start p-3 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{event.message}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">{event.location}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(event.timestamp), 'MMM dd • h:mm a')}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
          <div className="flex items-start">
            <ApperIcon name="MapPin" size={16} className="text-gray-400 mr-2 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p>{order.deliveryAddress.street}</p>
              <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTracking;