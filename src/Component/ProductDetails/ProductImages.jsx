/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ProductImages = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]?.url || '');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const imageRef = useRef(null);

    const nextImage = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };
  
    const prevImage = () => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };
  
    useEffect(() => {
      setSelectedImage(images[currentIndex]?.url || '');
    }, [currentIndex, images]);
  
    const handleMouseMove = (e) => {
      if (!isZoomed || !imageRef.current) return;
      
      const { left, top, width, height } = imageRef.current.getBoundingClientRect();
      
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      imageRef.current.style.transformOrigin = `${x * 100}% ${y * 100}%`;
    };

    return (
      <div className="w-full max-w-full mx-auto relative h-[200px] sm:h-[300px] md:h-[400px] lg:h-[522px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            className="w-full h-full flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              ref={imageRef}
              src={selectedImage}
              alt={`Product image ${currentIndex + 1}`}
              className={`w-full h-full object-contain rounded-lg shadow-md transition-transform duration-300 ${isZoomed ? 'scale-150' : ''}`}
            />
          </motion.div>
        </AnimatePresence>
        <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">
          <FaChevronLeft />
        </button>
        <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">
          <FaChevronRight />
        </button>
        <div className="flex justify-center mt-4 gap-2 flex-wrap">
          {images.map((img, index) => (
            <motion.div
              key={index}
              className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-md cursor-pointer ${index === currentIndex ? 'border-2 border-blue-500' : 'border border-gray-300'}`}
              onClick={() => setCurrentIndex(index)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <img
                src={img.url}
                alt={img.alt || `Product image ${index + 1}`}
                className="w-full h-full object-contain rounded-md"
              />
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

export default ProductImages;
