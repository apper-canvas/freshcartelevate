import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProductRecommendations from "@/components/organisms/ProductRecommendations";
import productService from "@/services/api/productService";
import cartService from "@/services/api/cartService";
import ApperIcon from "@/components/ApperIcon";
import CartItem from "@/components/molecules/CartItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Checkout from "@/components/pages/Checkout";
import Button from "@/components/atoms/Button";
const Cart = ({ 
  isOpen, 
  onClose, 
  onUpdateCart,
  className = "" 
}) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const loadCart = async () => {
    try {
      setLoading(true);
      setError("");
      const items = await cartService.getCartItems();
      setCartItems(items);
    } catch (err) {
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCart();
}
  }, [isOpen]);

  const loadRecommendations = async () => {
    if (cartItems.length > 0) {
      try {
        const recs = await productService.getRecommendations(cartItems);
        setRecommendations(recs);
      } catch (err) {
        console.error("Failed to load recommendations:", err);
      }
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, [cartItems]);
  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      await cartService.updateQuantity(productId, quantity);
      await loadCart();
      onUpdateCart();
    } catch (error) {
      throw error;
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await cartService.removeItem(productId);
      await loadCart();
      onUpdateCart();
    } catch (error) {
      throw error;
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.08; // 8% tax
  };

  const calculateDeliveryFee = () => {
    return 4.99;
  };

const subtotal = calculateTotal();
  const tax = calculateTax(subtotal);
  const deliveryFee = calculateDeliveryFee();
  const total = subtotal + tax + deliveryFee;

  const handleAddToCartFromRecommendations = async (product) => {
    await onUpdateCart(product.Id, 1);
  };
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col ${className}`}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cart Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary to-success text-white">
            <h2 className="text-xl font-bold font-display">Shopping Cart</h2>
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <Loading type="cart" />
            ) : error ? (
              <Error message={error} onRetry={loadCart} />
            ) : cartItems.length === 0 ? (
              <Empty
                title="Your cart is empty"
                message="Add some fresh groceries to get started!"
                actionText="Start Shopping"
                onAction={() => {
                  onClose();
                  navigate("/");
                }}
                icon="ShoppingCart"
              />
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.productId}
                      layout
                      exit={{ opacity: 0, x: 100 }}
                    >
                      <CartItem
                        item={item}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveItem}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
)}
          </div>

          {/* Product Recommendations */}
          {cartItems.length > 0 && recommendations.length > 0 && (
            <ProductRecommendations
              recommendations={recommendations}
              onAddToCart={handleAddToCartFromRecommendations}
            />
          )}

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <motion.div
              className="border-t bg-background p-4 space-y-4"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Order Summary */}
              <div className="space-y-2 text-sm font-body">
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

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                size="large"
                className="w-full shadow-lg"
              >
                <ApperIcon name="CreditCard" size={20} className="mr-2" />
                Proceed to Checkout
              </Button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Cart;