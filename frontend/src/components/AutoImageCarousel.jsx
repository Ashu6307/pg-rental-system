import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaBuilding, FaMotorcycle } from 'react-icons/fa';

const AutoImageCarousel = ({ 
  images = [], 
  alt = 'Image', 
  className = '',
  autoSlideInterval = 3000, // 3 seconds
  showControls = true,
  showDots = true,
  type = 'default' // 'bike', 'pg', or 'default'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  // Default fallback images based on type
  const getFallbackImage = () => {
    if (type === 'bike') {
      return 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&q=80';
    } else if (type === 'pg') {
      return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&q=80';
    }
    return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&q=80';
  };

  const getFallbackIcon = () => {
    return type === 'bike' ? FaMotorcycle : FaBuilding;
  };

  const IconFallback = ({ message }) => {
    const FallbackIcon = getFallbackIcon();
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <FallbackIcon size={32} className="text-gray-400 mb-2" />
        <span className="text-gray-500 text-xs text-center px-2">{message}</span>
      </div>
    );
  };

  // Auto slide effect
  useEffect(() => {
    if (images.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [images.length, autoSlideInterval, isHovered]);

  const handleImageError = (index) => {
    setImageErrors(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const handleImageLoad = (index) => {
    setImageErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  if (!images || images.length === 0) {
    const FallbackIcon = getFallbackIcon();
    return (
      <div className={`bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center ${className}`}>
        <FallbackIcon size={48} className="text-blue-400 mb-2" />
        <span className="text-blue-600 text-sm font-medium">
          {type === 'bike' ? 'Bike Image' : type === 'pg' ? 'PG Image' : 'No Image'}
        </span>
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image */}
      <div className="relative w-full h-full">
        {imageErrors[currentIndex] ? (
          // Show single clean fallback when image fails
          <IconFallback message={`${type === 'bike' ? 'Bike' : type === 'pg' ? 'PG' : ''} Image not available`} />
        ) : (
          <img 
            src={images[currentIndex]?.url || images[currentIndex]} 
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onLoad={() => handleImageLoad(currentIndex)}
            onError={() => handleImageError(currentIndex)}
          />
        )}
        
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Navigation Controls - Only show if multiple images */}
      {images.length > 1 && showControls && (
        <>
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
          >
            <FaChevronLeft size={12} />
          </button>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
          >
            <FaChevronRight size={12} />
          </button>
        </>
      )}

      {/* Dot Indicators - Only show if multiple images */}
      {images.length > 1 && showDots && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-110' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}

      {/* Image Count Badge - Hidden for now */}
      {/* {images.length > 1 && (
        <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium">
          {currentIndex + 1}/{images.length}
        </div>
      )} */}
    </div>
  );
};

export default AutoImageCarousel;
