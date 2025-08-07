import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import orderService from "@/services/api/orderService";
import { toast } from "react-toastify";

const Orders = () => {
  const location = useLocation();
  const newOrderId = location.state?.newOrderId;
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const ordersData = await orderService.getAll();
      
      // Sort orders by ID (newest first)
      const sortedOrders = ordersData.sort((a, b) => b.Id - a.Id);
      setOrders(sortedOrders);

      // Auto-expand new order if coming from checkout
      if (newOrderId) {
        setExpandedOrders(new Set([newOrderId]));
      }
      
    } catch (err) {
      setError("Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusColor = (status) => {
    const statusMap = {
      "confirmed": "primary",
      "preparing": "warning",
      "out_for_delivery": "info",
      "delivered": "success",
      "cancelled": "error"
    };
    return statusMap[status] || "default";
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      "confirmed": "CheckCircle",
      "preparing": "ChefHat",
      "out_for_delivery": "Truck",
      "delivered": "Package",
      "cancelled": "XCircle"
    };
    return iconMap[status] || "Package";
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      "confirmed": "Confirmed",
      "preparing": "Preparing",
      "out_for_delivery": "Out for Delivery",
      "delivered": "Delivered",
      "cancelled": "Cancelled"
    };
    return labelMap[status] || status;
  };

  const toggleOrderExpanded = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const handleReorder = async (order) => {
    try {
      // This would typically add all items from the order back to the cart
      toast.success("Items added to cart for reordering!");
    } catch (error) {
      toast.error("Failed to reorder items");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-6 bg-gray-200 rounded shimmer"></div>
            <div className="h-8 w-32 bg-gray-200 rounded shimmer"></div>
          </div>
          <Loading type="cart" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <Error message={error} onRetry={loadOrders} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-white pb-20 lg:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3">
            <ApperIcon name="Package" size={24} className="text-primary" />
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 font-display">
              Your Orders
            </h1>
          </div>
          
          <Button
            variant="ghost"
            onClick={loadOrders}
            className="text-primary"
          >
            <ApperIcon name="RefreshCw" size={18} className="mr-2" />
            Refresh
          </Button>
        </motion.div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Empty
            title="No orders yet"
            message="Start shopping to see your order history here!"
            actionText="Start Shopping"
            onAction={() => window.location.href = "/"}
            icon="Package"
          />
        ) : (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {orders.map((order, index) => (
              <motion.div
                key={order.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={newOrderId === order.Id ? "ring-2 ring-primary ring-opacity-50" : ""}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-success rounded-full flex items-center justify-center">
                          <ApperIcon name="Receipt" size={20} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 font-display">
                            Order #{order.Id}
                          </h3>
                          <p className="text-sm text-gray-600 font-body">
                            {format(new Date(order.createdAt || Date.now()), "MMM dd, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant={getStatusColor(order.status)}>
                          <ApperIcon name={getStatusIcon(order.status)} size={12} className="mr-1" />
                          {getStatusLabel(order.status)}
                        </Badge>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toggleOrderExpanded(order.Id)}
                        >
                          <ApperIcon 
                            name={expandedOrders.has(order.Id) ? "ChevronUp" : "ChevronDown"} 
                            size={18} 
                          />
                        </Button>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 font-body">
                          {order.items?.length || 0} items
                        </span>
                        {order.deliverySlot && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <ApperIcon name="Clock" size={14} />
                            <span className="font-body">
                              {format(new Date(order.deliverySlot.date), "MMM dd")} at {order.deliverySlot.time}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-lg font-bold text-primary font-display">
                        ${order.total?.toFixed(2) || "0.00"}
                      </span>
                    </div>

                    {/* Expanded Order Details */}
                    {expandedOrders.has(order.Id) && (
                      <motion.div
                        className="mt-6 pt-6 border-t space-y-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Order Items */}
                        {order.items && order.items.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900 font-display">Items Ordered</h4>
                            <div className="space-y-2">
                              {order.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="flex items-center justify-between py-2 px-3 bg-background rounded-lg">
                                  <div className="flex items-center gap-3">
                                    {item.image && (
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-8 h-8 object-cover rounded"
                                      />
                                    )}
                                    <span className="font-medium text-gray-900 font-body">{item.name || "Unknown Item"}</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-sm text-gray-600 font-body">Qty: {item.quantity || 1}</span>
                                    <span className="block font-semibold text-primary font-display">
                                      ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Delivery Address */}
                        {order.deliveryAddress && (
                          <div>
                            <h4 className="font-semibold text-gray-900 font-display mb-2">Delivery Address</h4>
                            <div className="bg-background p-3 rounded-lg text-sm font-body text-gray-700">
                              <p>{order.deliveryAddress.street}</p>
                              <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}</p>
                            </div>
                          </div>
                        )}

                        {/* Order Actions */}
                        <div className="flex gap-3 pt-2">
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => handleReorder(order)}
                            className="flex items-center gap-2"
                          >
                            <ApperIcon name="RotateCcw" size={16} />
                            Reorder
                          </Button>
                          
                          {order.status === "delivered" && (
                            <Button
                              variant="ghost"
                              size="small"
                              className="text-primary"
                            >
                              <ApperIcon name="MessageSquare" size={16} className="mr-1" />
                              Review
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Orders;