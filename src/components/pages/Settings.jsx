import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import storeService from "@/services/api/storeService";
import { toast } from "react-toastify";

const Settings = ({ className = "" }) => {
  const [stores, setStores] = useState([]);
  const [favoriteStores, setFavoriteStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadStores = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [allStores, favorites] = await Promise.all([
        storeService.getAll(),
        storeService.getFavorites()
      ]);
      
      setStores(allStores);
      setFavoriteStores(favorites);
    } catch (err) {
      setError("Failed to load stores. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleFavorite = async (store) => {
    if (saving) return;
    
    const isFavorite = favoriteStores.some(fav => fav.Id === store.Id);
    
    if (!isFavorite && favoriteStores.length >= 3) {
      toast.error("You can select up to 3 favorite stores", {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }
    
    setSaving(true);
    
    try {
      let updatedFavorites;
      if (isFavorite) {
        updatedFavorites = await storeService.removeFavorite(store.Id);
        toast.success(`${store.name} removed from favorites`, {
          position: "top-right",
          autoClose: 2000
        });
      } else {
        updatedFavorites = await storeService.addFavorite(store.Id);
        toast.success(`${store.name} added to favorites`, {
          position: "top-right",
          autoClose: 2000
        });
      }
      
      setFavoriteStores(updatedFavorites);
    } catch (error) {
      toast.error("Failed to update favorite stores");
    } finally {
      setSaving(false);
    }
  };

  const getDistanceColor = (distance) => {
    if (distance <= 2) return "text-success";
    if (distance <= 5) return "text-warning";
    return "text-gray-500";
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-background ${className}`}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Loading type="page" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen bg-background ${className}`}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Error message={error} onRetry={loadStores} />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <div className="max-w-4xl mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
            Settings
          </h1>
          <p className="text-gray-600 font-body">
            Manage your favorite stores and preferences
          </p>
        </motion.div>

        {/* Favorite Stores Section */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ApperIcon name="Heart" size={24} className="text-primary" />
              <h2 className="text-xl font-bold text-gray-900 font-display">
                Favorite Stores
              </h2>
              <Badge variant="secondary" className="ml-2">
                {favoriteStores.length}/3
              </Badge>
            </div>
          </div>

          {favoriteStores.length > 0 ? (
            <div className="grid gap-4 mb-6">
              {favoriteStores.map((store, index) => (
                <motion.div
                  key={store.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900 font-display">
                              {store.name}
                            </h3>
                            <Badge variant="success" className="text-xs">
                              <ApperIcon name="Heart" size={12} className="mr-1" />
                              Favorite
                            </Badge>
                            {store.isOpen && (
                              <Badge variant="accent" className="text-xs">
                                Open
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {store.address}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className={`flex items-center gap-1 ${getDistanceColor(store.distance)}`}>
                              <ApperIcon name="MapPin" size={12} />
                              {store.distance} mi away
                            </span>
                            <span className="flex items-center gap-1">
                              <ApperIcon name="Clock" size={12} />
                              {store.hours}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleFavorite(store)}
                          disabled={saving}
                          className="text-error hover:bg-error/10"
                        >
                          <ApperIcon name="X" size={16} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Empty
              title="No favorite stores selected"
              message="Select up to 3 favorite stores to see their inventory"
              icon="Heart"
              className="mb-6"
            />
          )}
        </motion.section>

        {/* Store Search & Selection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <ApperIcon name="Store" size={24} className="text-primary" />
            <h2 className="text-xl font-bold text-gray-900 font-display">
              All Stores
            </h2>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <Input
              placeholder="Search stores by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              leftIcon={<ApperIcon name="Search" size={16} />}
            />
          </div>

          {/* Stores Grid */}
          {filteredStores.length === 0 ? (
            <Empty
              title={searchQuery ? `No stores found for "${searchQuery}"` : "No stores available"}
              message={searchQuery ? "Try a different search term" : "Check back later for store availability"}
              icon="Store"
            />
          ) : (
            <div className="grid gap-4">
              {filteredStores.map((store, index) => {
                const isFavorite = favoriteStores.some(fav => fav.Id === store.Id);
                
                return (
                  <motion.div
                    key={store.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`overflow-hidden transition-all duration-200 ${
                      isFavorite ? 'ring-2 ring-primary/20 bg-primary/5' : 'hover:shadow-md'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900 font-display">
                                {store.name}
                              </h3>
                              {isFavorite && (
                                <Badge variant="success" className="text-xs">
                                  <ApperIcon name="Heart" size={12} className="mr-1" />
                                  Favorite
                                </Badge>
                              )}
                              <Badge 
                                variant={store.isOpen ? "accent" : "secondary"} 
                                className="text-xs"
                              >
                                {store.isOpen ? "Open" : "Closed"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {store.address}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className={`flex items-center gap-1 ${getDistanceColor(store.distance)}`}>
                                <ApperIcon name="MapPin" size={12} />
                                {store.distance} mi away
                              </span>
                              <span className="flex items-center gap-1">
                                <ApperIcon name="Clock" size={12} />
                                {store.hours}
                              </span>
                              <span className="flex items-center gap-1">
                                <ApperIcon name="Package" size={12} />
                                {store.inventoryCount} items
                              </span>
                            </div>
                          </div>
                          <Button
                            variant={isFavorite ? "secondary" : "primary"}
                            size="small"
                            onClick={() => handleToggleFavorite(store)}
                            disabled={saving || (!isFavorite && favoriteStores.length >= 3)}
                          >
                            {saving ? (
                              <ApperIcon name="Loader" size={16} className="animate-spin" />
                            ) : (
                              <>
                                <ApperIcon 
                                  name={isFavorite ? "HeartOff" : "Heart"} 
                                  size={16} 
                                  className="mr-1" 
                                />
                                {isFavorite ? "Remove" : "Add"}
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default Settings;