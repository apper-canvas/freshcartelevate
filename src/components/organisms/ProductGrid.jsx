import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/molecules/ProductCard";
import CategoryPill from "@/components/molecules/CategoryPill";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import productService from "@/services/api/productService";

const ProductGrid = ({ 
  searchQuery = "", 
  selectedCategory = "All",
  onCategoryChange,
  onAddToCart,
  className = "" 
}) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      
      const productsData = await productService.getAll();
      setProducts(productsData);
      
      // Extract unique categories
      const uniqueCategories = ["All", ...new Set(productsData.map(p => p.category))];
      setCategories(uniqueCategories);
      
    } catch (err) {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Loading type="categories" />
        <Loading type="products" />
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadProducts} className={className} />;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Category Filter */}
      <motion.div
        className="flex flex-wrap gap-3 pb-2 overflow-x-auto"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {categories.map((category, index) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <CategoryPill
              category={category}
              isActive={selectedCategory === category}
              onClick={onCategoryChange}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Empty
          title={searchQuery ? `No results for "${searchQuery}"` : `No products in ${selectedCategory}`}
          message={searchQuery ? "Try a different search term" : "This category is currently empty"}
          actionText="Browse All Products"
          onAction={() => {
            onCategoryChange("All");
          }}
          icon="Search"
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ProductGrid;