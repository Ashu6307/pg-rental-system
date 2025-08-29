import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const AutoImageCarousel = ({
  images = [],
  alt = "Image",
  containerClass = "",
  imageClass = "",
  autoSlideInterval = 4000,
  showControls = true,
  showDots = true,
  swipeThreshold = 50,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragTranslate, setDragTranslate] = useState(0);

  const containerRef = useRef(null);

  // ✅ Go to slide
  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
    setDragTranslate(0);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setDragTranslate(0);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setDragTranslate(0);
  }, [images.length]);

  // ✅ Auto slide
  useEffect(() => {
    if (images.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      goToNext();
    }, autoSlideInterval);
    return () => clearInterval(interval);
  }, [images.length, autoSlideInterval, isHovered, goToNext]);

  // ✅ Handle drag/swipe
  const handleTouchStart = (e) => setDragStartX(e.touches[0].clientX);
  const handleTouchMove = (e) =>
    setDragTranslate(e.touches[0].clientX - dragStartX);
  const handleTouchEnd = () => {
    if (Math.abs(dragTranslate) > swipeThreshold) {
      dragTranslate < 0 ? goToNext() : goToPrevious();
    } else {
      setDragTranslate(0);
    }
  };

  const handleMouseDown = (e) => setDragStartX(e.clientX);
  const handleMouseMove = (e) => {
    if (dragStartX !== null) setDragTranslate(e.clientX - dragStartX);
  };
  const handleMouseUp = () => {
    if (Math.abs(dragTranslate) > swipeThreshold) {
      dragTranslate < 0 ? goToNext() : goToPrevious();
    } else {
      setDragTranslate(0);
    }
    setDragStartX(null);
  };

  // ✅ Empty state
  if (!images || images.length === 0) {
    return (
      <div
        className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 ${containerClass}`}
      >
        No Image
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden group select-none ${containerClass}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={(e) => {
        setIsHovered(false);
        handleMouseUp(e);
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* ✅ Image wrapper with drag effect */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(calc(${
            -currentIndex * 100
          }% + ${dragTranslate}px))`,
        }}
      >
        {images.map((src, i) => (
          <div key={i} className="min-w-full h-full relative">
            <img
              src={src}
              alt={`${alt} ${i + 1}`}
              loading="lazy"
              className={`w-full h-full object-cover ${imageClass}`}
            />
            {/* ✅ Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* ✅ Controls */}
      {showControls && images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            aria-label="Previous Image"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
          >
            <FaChevronLeft size={16} />
          </button>
          <button
            onClick={goToNext}
            aria-label="Next Image"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
          >
            <FaChevronRight size={16} />
          </button>
        </>
      )}

      {/* ✅ Dots */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/70 w-1.5"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoImageCarousel;
