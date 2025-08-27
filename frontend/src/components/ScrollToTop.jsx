import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

/**
 * Enhanced ScrollToTop Component - All-in-One Scroll Management Solution
 * 
 * Features:
 * - Floating scroll-to-top button
 * - Multi-method scroll approach for 100% reliability
 * - Auto scroll on mount (configurable)
 * - Cross-browser compatibility
 * - Enterprise-level implementation
 * - Hook-based usage
 * - HOC wrapper support
 */

const ScrollToTop = ({ 
  // Button appearance options
  showButton = true,
  buttonPosition = 'bottom-right', // 'bottom-right', 'bottom-left', 'bottom-center'
  showAfterScroll = 300,
  buttonStyle = {},
  buttonClassName = "",
  
  // Scroll behavior options
  scrollOnMount = true,
  scrollDelay = 0,
  behavior = 'smooth',
  enableHashClear = true,
  enableMultiTiming = true,
  
  // Custom styling
  theme = 'blue' // 'blue', 'purple', 'green', 'red', 'dark'
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  /**
   * Multi-method scroll function - Enterprise level reliability
   * Uses multiple approaches to ensure 100% scroll success across all browsers
   */
  const scrollToTop = () => {
    try {
      // Method 1: Direct window scroll (most reliable)
      window.scrollTo(0, 0);
      
      // Method 2: Document element scroll (Firefox compatibility)
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      
      // Method 3: Body element scroll (Safari/older browsers)
      if (document.body) {
        document.body.scrollTop = 0;
      }
      
      // Method 4: Clear hash conflicts (URL hash issues)
      if (enableHashClear && window.location.hash) {
        window.location.hash = '';
      }
      
      // Method 5: Smooth scroll backup (better UX)
      window.scrollTo({ 
        top: 0, 
        left: 0, 
        behavior: behavior 
      });
      
    } catch (error) {
      // Fallback for any browser issues
      try {
        window.scrollTo(0, 0);
      } catch (fallbackError) {
        console.warn('ScrollToTop: Unable to scroll to top', fallbackError);
      }
    }
  };

  /**
   * Advanced scroll with multiple timing strategies
   * Ensures scroll works regardless of DOM state
   */
  const advancedScrollToTop = () => {
    // Immediate scroll (for instant feedback)
    scrollToTop();
    
    if (enableMultiTiming) {
      // Quick DOM ready check (10ms)
      const timer1 = setTimeout(() => {
        scrollToTop();
      }, 10);
      
      // Medium delay for content loading (50ms)
      const timer2 = setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }, 50);
      
      // Final smooth scroll (100ms)
      const timer3 = setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: behavior });
      }, 100);
      
      // Cleanup function
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
    
    return () => {}; // Empty cleanup if multi-timing disabled
  };

  // Show/hide scroll to top button based on scroll position
  useEffect(() => {
    if (!showButton) return;

    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > showAfterScroll);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showButton, showAfterScroll]);

  // Auto scroll on component mount
  useEffect(() => {
    if (scrollOnMount) {
      let cleanup = () => {};
      
      if (scrollDelay > 0) {
        const delayTimer = setTimeout(() => {
          cleanup = advancedScrollToTop();
        }, scrollDelay);
        
        return () => {
          clearTimeout(delayTimer);
          cleanup();
        };
      } else {
        cleanup = advancedScrollToTop();
        return cleanup;
      }
    }
  }, [scrollOnMount, scrollDelay, behavior, enableHashClear, enableMultiTiming]);

  // Theme configurations
  const getThemeClasses = () => {
    const themes = {
      blue: 'bg-blue-600 hover:bg-blue-700 text-white',
      purple: 'bg-purple-600 hover:bg-purple-700 text-white',
      green: 'bg-green-600 hover:bg-green-700 text-white',
      red: 'bg-red-600 hover:bg-red-700 text-white',
      dark: 'bg-gray-800 hover:bg-gray-900 text-white'
    };
    return themes[theme] || themes.blue;
  };

  // Button position classes
  const getPositionClasses = () => {
    const positions = {
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6',
      'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2'
    };
    return positions[buttonPosition] || positions['bottom-right'];
  };

  const defaultButtonClass = `fixed ${getPositionClasses()} ${getThemeClasses()} p-3 rounded-full shadow-lg transition-all duration-300 z-50 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-opacity-50`;

  return (
    <>
      {/* Floating Scroll to Top Button */}
      {showButton && showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
          className={buttonClassName || defaultButtonClass}
          style={buttonStyle}
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </>
  );
};

/**
 * Hook version for functional components
 * Usage: const scrollToTop = useScrollToTop();
 */
export const useScrollToTop = (options = {}) => {
  const {
    behavior = 'smooth',
    enableHashClear = true,
    enableMultiTiming = true
  } = options;

  const scrollToTop = React.useCallback(() => {
    try {
      // Multi-method approach
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      if (enableHashClear && window.location.hash) {
        window.location.hash = '';
      }
      
      window.scrollTo({ top: 0, left: 0, behavior });
      
      if (enableMultiTiming) {
        // Additional timing strategies
        setTimeout(() => window.scrollTo(0, 0), 10);
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'auto' }), 50);
        setTimeout(() => window.scrollTo({ top: 0, behavior }), 100);
      }
      
    } catch (error) {
      window.scrollTo(0, 0); // Fallback
    }
  }, [behavior, enableHashClear, enableMultiTiming]);

  return scrollToTop;
};

/**
 * Higher-Order Component version
 * Usage: export default withScrollToTop(YourComponent);
 */
export const withScrollToTop = (WrappedComponent, options = {}) => {
  return React.forwardRef((props, ref) => {
    return (
      <>
        <ScrollToTop {...options} />
        <WrappedComponent {...props} ref={ref} />
      </>
    );
  });
};

/**
 * Minimal ScrollManager component (for backward compatibility)
 * Just handles auto-scroll without button
 */
export const ScrollManager = (props) => (
  <ScrollToTop {...props} showButton={false} />
);

export default ScrollToTop;
