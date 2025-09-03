"use client";
import React, { useRef, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface HorizontalCarouselProps {
  children: React.ReactNode[];
  autoScroll?: boolean;
  scrollSpeed?: number;
  showArrows?: boolean;
  className?: string;
}

const HorizontalCarousel: React.FC<HorizontalCarouselProps> = ({
  children,
  autoScroll = true,
  scrollSpeed = 50,
  showArrows = true,
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(autoScroll);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    let animationId: number;
    
    const scroll = () => {
      if (contentRef.current && containerRef.current && isScrolling) {
        const container = containerRef.current;
        const content = contentRef.current;
        
        // Smooth auto scroll to right
        container.scrollLeft += scrollSpeed / 60;
        
        // Calculate total width and reset point for seamless loop
        const totalWidth = content.scrollWidth;
        const containerWidth = container.clientWidth;
        const singleSetWidth = totalWidth / 4; // We have 4 identical sets
        
        // Reset to start when we reach the end of first set
        // This creates seamless infinite effect
        if (container.scrollLeft >= singleSetWidth) {
          container.scrollLeft = container.scrollLeft - singleSetWidth;
        }
        
        // Fallback: if we somehow reach the very end, reset to beginning
        if (container.scrollLeft >= totalWidth - containerWidth - 50) {
          container.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    if (isScrolling) {
      animationId = requestAnimationFrame(scroll);
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isScrolling, scrollSpeed]);

  useEffect(() => {
    const updateScrollButtons = () => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        // For infinite scroll, always show both arrows when there are enough cards
        const hasEnoughCards = scrollWidth > clientWidth * 2;
        setCanScrollLeft(hasEnoughCards);
        setCanScrollRight(hasEnoughCards);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();
      
      return () => container.removeEventListener('scroll', updateScrollButtons);
    }
  }, [children]);

  const scrollToDirection = (direction: 'left' | 'right') => {
    if (containerRef.current && contentRef.current) {
      const container = containerRef.current;
      const content = contentRef.current;
      const scrollAmount = 328; // Width of one card + gap (320 + 8)
      const currentScrollLeft = container.scrollLeft;
      const singleSetWidth = content.scrollWidth / 4; // 4 sets total
      
      let newScrollLeft;
      
      if (direction === 'left') {
        newScrollLeft = currentScrollLeft - scrollAmount;
        // If going too far left, wrap to end of first set
        if (newScrollLeft < 0) {
          newScrollLeft = singleSetWidth + newScrollLeft;
        }
      } else {
        newScrollLeft = currentScrollLeft + scrollAmount;
        // If going too far right, wrap to beginning
        if (newScrollLeft >= singleSetWidth) {
          newScrollLeft = newScrollLeft - singleSetWidth;
        }
      }
      
      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseEnter = () => {
    if (autoScroll) {
      setIsScrolling(false);
    }
  };

  const handleMouseLeave = () => {
    if (autoScroll) {
      setIsScrolling(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Left Arrow */}
      {showArrows && canScrollLeft && (
        <button
          onClick={() => scrollToDirection('left')}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110"
          aria-label="Scroll left"
        >
          <FaChevronLeft className="text-gray-600 text-lg" />
        </button>
      )}

      {/* Right Arrow */}
      {showArrows && canScrollRight && (
        <button
          onClick={() => scrollToDirection('right')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110"
          aria-label="Scroll right"
        >
          <FaChevronRight className="text-gray-600 text-lg" />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        className="overflow-x-auto scrollbar-hide carousel-smooth-scroll"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={contentRef}
          className="flex gap-8 pb-4 carousel-container"
        >
          {/* Multiple sets for infinite loop - enough to ensure seamless scrolling */}
          {Array.from({ length: 4 }, (_, setIndex) => 
            children.map((child, index) => (
              <div key={`set-${setIndex}-${index}`} className="flex-shrink-0 carousel-card">
                {child}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HorizontalCarousel;
