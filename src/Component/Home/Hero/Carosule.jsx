import { useCallback, useEffect, useState } from "react";
import { useTheme } from "../../../ThemeContext"; // Import useTheme hook

const Carousel = () => {
  const [currentSlider, setCurrentSlider] = useState(0);
  const { isDarkMode } = useTheme(); // Use the useTheme hook
  const carouselImages = [
    "https://res.cloudinary.com/dgehg6ds1/image/upload/v1752256309/psvgb2qoeypkrcvn0dqt_lrx7te.webp",
    "https://res.cloudinary.com/dgehg6ds1/image/upload/v1752256309/tz5agmdtvpohmqbv2jpq_kn0ubw.webp",
    // "https://i.imgur.com/8JPX5tf.jpg",
  ];

  const prevSlider = useCallback(() => {
    setCurrentSlider((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  }, [carouselImages.length]);

  const nextSlider = useCallback(() => {
    setCurrentSlider((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  }, [carouselImages.length]);

  useEffect(() => {
    const intervalId = setInterval(nextSlider, 5000);
    return () => clearInterval(intervalId);
  }, [nextSlider]);

  return (
    <div className={`relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[522px] mt-6 overflow-hidden rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Carousel container */}
      <div
        className="flex transition-transform duration-500 ease-linear h-full"
        style={{ transform: `translateX(-${currentSlider * 100}%)` }}
      >
        {carouselImages.map((slide, idx) => (
          <img
            key={idx}
            src={slide}
            className="min-w-full h-full object-fill"
            alt={`Slider - ${idx + 1}`}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlider}
        className={`absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-black/30 text-white'} p-1 sm:p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-black/50'} transition text-sm sm:text-base`}
      >
        &#10094;
      </button>
      <button
        onClick={nextSlider}
        className={`absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-black/30 text-white'} p-1 sm:p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-black/50'} transition text-sm sm:text-base`}
      >
        &#10095;
      </button>

      {/* Indicators */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2">
        {carouselImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlider(idx)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
              currentSlider === idx 
                ? (isDarkMode ? "bg-gray-300 w-4 sm:w-8" : "bg-white w-4 sm:w-8")
                : (isDarkMode ? "bg-gray-600" : "bg-white/50")
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
