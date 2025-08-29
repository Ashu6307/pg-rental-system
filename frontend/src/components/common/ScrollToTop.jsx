// src/components/common/ScrollToTop.jsx
import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

/**
 * Reusable ScrollToTop Button
 *
 * @param {number} showAfter - Scroll offset in px before showing button (default: 200)
 * @param {"light"|"dark"} theme - Button theme (default: "light")
 * @param {"right"|"left"} position - Position on screen (default: "right")
 * @param {boolean} smooth - Smooth scroll enabled (default: true)
 * @param {JSX.Element} icon - Custom icon (default: ChevronUp)
 * @param {string} className - Extra Tailwind classes (for full customization)
 */
const ScrollToTop = ({
  showAfter = 200,
  theme = "light",
  position = "right",
  smooth = true,
  icon = <ChevronUp className="w-6 h-6" />,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Track scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > showAfter);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [showAfter]);

  // Scroll to top action
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className={`
            fixed bottom-6 ${position === "right" ? "right-6" : "left-6"}
            p-3 rounded-full shadow-lg transition-all duration-300
            hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2
            ${theme === "dark" 
              ? "bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-500"
              : "bg-white text-gray-800 hover:bg-gray-100 focus:ring-gray-300"}
            ${className}
          `}
        >
          {icon}
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
