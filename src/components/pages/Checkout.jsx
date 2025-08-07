import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DeliveryScheduler from "@/components/organisms/DeliveryScheduler";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import cartService from "@/services/api/cartService";
import orderService from "@/services/api/orderService";
import { toast } from "react-toastify";

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102"
  });

  const loadCart = async () => {
    try {
      setLoading(true);
      setError("");
      const items = await cartService.getCartItems();
      
      if (items.length === 0) {
        navigate("/");
        toast.info("Your cart is empty. Add items to checkout.");
        return;
      }
      
      setCartItems(items);
    } catch (err) {
      setError("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [navigate]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.08; // 8% tax
  };

  const calculateDeliveryFee = () => {
    return 4.99;
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const deliveryFee = calculateDeliveryFee();
  const total = subtotal + tax + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!selectedSlot) {
      toast.error("Please select a delivery time slot");
      return;
    }

    try {
      setIsProcessing(true);
      
      const orderData = {
        items: cartItems,
        total: total,
        subtotal: subtotal,
        tax: tax,
        deliveryFee: deliveryFee,
        deliverySlot: selectedSlot,
        deliveryAddress: deliveryAddress,
        status: "confirmed"
      };

      const order = await orderService.create(orderData);
      
      // Clear cart after successful order
      await cartService.clearCart();
      
      toast.success("Order placed successfully! 🎉");
      navigate("/orders", { state: { newOrderId: order.Id } });
      
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-white flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-white flex items-center justify-center">
        <Error message={error} onRetry={loadCart} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-white pb-20 lg:pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate("/")}
            className="mr-2"
          >
            <ApperIcon name="ArrowLeft" size={20} />
          </Button>
          <ApperIcon name="CreditCard" size={24} className="text-primary" />
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 font-display">
            Checkout
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Address */}
            <motion.section
              className="bg-white rounded-xl shadow-md border border-gray-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <h2 className="text-xl font-bold text-gray-900 font-display mb-4 flex items-center gap-2">
                <ApperIcon name="MapPin" size={20} className="text-primary" />
                Delivery Address
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Street Address"
                  value={deliveryAddress.street}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, street: e.target.value }))}
                  className="sm:col-span-2"
                />
                <Input
                  label="City"
                  value={deliveryAddress.city}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, city: e.target.value }))}
                />
                <Input
                  label="State"
                  value={deliveryAddress.state}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, state: e.target.value }))}
                />
                <Input
                  label="ZIP Code"
                  value={deliveryAddress.zipCode}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                />
              </div>
            </motion.section>

            {/* Delivery Scheduler */}
            <motion.section
              className="bg-white rounded-xl shadow-md border border-gray-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <DeliveryScheduler
                selectedSlot={selectedSlot}
                onSlotSelect={setSelectedSlot}
              />
            </motion.section>
          </div>

          {/* Order Summary Sidebar */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="sticky top-20 bg-white rounded-xl shadow-lg border border-gray-100 p-6 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 font-display flex items-center gap-2">
                <ApperIcon name="Receipt" size={20} className="text-primary" />
                Order Summary
              </h2>

              {/* Order Items */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 p-2 bg-background rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate font-body">{item.name}</p>
                      <p className="text-xs text-gray-600 font-body">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-sm text-primary font-display">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t pt-4 space-y-2 text-sm font-body">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-lg font-display">Total</span>
                    <span className="font-bold text-lg text-primary font-display">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Selected Delivery Slot */}
              {selectedSlot && (
                <div className="bg-gradient-to-r from-primary to-success text-white p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <ApperIcon name="Clock" size={16} />
                    <span className="font-semibold text-sm">Delivery Scheduled</span>
                  </div>
                  <p className="text-sm text-white/90">
                    {new Date(selectedSlot.date).toLocaleDateString()} at {selectedSlot.time}
                  </p>
                </div>
              )}

              {/* Place Order Button */}
              <Button
                onClick={handlePlaceOrder}
                disabled={!selectedSlot || isProcessing}
                size="large"
                className="w-full shadow-lg"
              >
                {isProcessing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <ApperIcon name="Loader" size={18} />
                    </motion.div>
                    Processing...
                  </>
                ) : (
                  <>
                    <ApperIcon name="CreditCard" size={18} className="mr-2" />
                    Place Order - ${total.toFixed(2)}
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;