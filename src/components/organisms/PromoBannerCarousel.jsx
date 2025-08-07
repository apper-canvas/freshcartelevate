import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import promoService from '@/services/api/promoService';

const PromoBannerCarousel = () => {
  const [promos, setPromos] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const navigate = useNavigate();

  const minSwipeDistance = 50;

  useEffect(() => {
    const loadPromos = async () => {
      try {
        setIsLoading(true);
        const activePromos = await promoService.getActive();
        setPromos(activePromos);
      } catch (error) {
        console.error('Error loading promos:', error);
        toast.error('Failed to load promotional banners');
      } finally {
        setIsLoading(false);
      }
    };

    loadPromos();
  }, []);

  useEffect(() => {
    if (!isPlaying || promos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % promos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, promos.length]);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && promos.length > 1) {
      nextSlide();
    }
    if (isRightSwipe && promos.length > 1) {
      prevSlide();
    }
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % promos.length);
  }, [promos.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + promos.length) % promos.length);
  }, [promos.length]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  const handleCTAClick = useCallback((promo) => {
    navigate(promo.ctaLink);
    toast.success(`Exploring ${promo.title}!`);
  }, [navigate]);

  const handleMouseEnter = () => setIsPlaying(false);
  const handleMouseLeave = () => setIsPlaying(true);

  if (isLoading) {
    return (
      <div className="relative w-full h-48 md:h-64 bg-gray-100 rounded-2xl overflow-hidden animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300"></div>
      </div>
    );
  }

  if (promos.length === 0) {
    return null;
  }

  return (
    <div 
      className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden shadow-lg group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        {promos.map((promo, index) => {
          if (index !== currentSlide) return null;
          
          return (
            <motion.div
              key={promo.Id}
              className={`absolute inset-0 bg-gradient-to-r ${promo.backgroundColor}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: `url(${promo.imageUrl})` }}
              />
              
              {/* Content Overlay */}
              <div className="relative h-full flex items-center justify-between p-6 md:p-8">
                <div className="flex-1 max-w-md">
                  <motion.h3
                    className={`text-2xl md:text-3xl font-display font-bold mb-2 ${promo.textColor}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    {promo.title}
                  </motion.h3>
                  
                  <motion.p
                    className={`text-lg md:text-xl font-semibold mb-2 ${promo.textColor} opacity-90`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {promo.subtitle}
                  </motion.p>
                  
                  <motion.p
                    className={`text-sm md:text-base mb-4 ${promo.textColor} opacity-80`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {promo.description}
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => handleCTAClick(promo)}
                      className="bg-white text-gray-900 hover:bg-gray-100 font-semibold shadow-lg"
                    >
                      {promo.ctaText}
                      <ApperIcon name="ArrowRight" size={16} className="ml-2" />
                    </Button>
                  </motion.div>
                </div>
                
                {/* Decorative Elements */}
                <div className="hidden md:flex items-center justify-center flex-1">
                  <motion.div
                    className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    <ApperIcon name="Sparkles" size={48} className={promo.textColor} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Navigation Arrows */}
      {promos.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ApperIcon name="ChevronLeft" size={20} />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ApperIcon name="ChevronRight" size={20} />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {promos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {promos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Play/Pause Indicator */}
      {promos.length > 1 && (
        <div className="absolute top-4 right-4">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400' : 'bg-yellow-400'} opacity-60`} />
        </div>
      )}
    </div>
  );
};

export default PromoBannerCarousel;