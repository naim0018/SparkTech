/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ProductImages = ({ images, currentImage }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]?.url || '');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showEnlargedImage, setShowEnlargedImage] = useState(false);

    const nextImage = () => {
      const newIndex = (currentIndex + 1) % images.length;
      setCurrentIndex(newIndex);
      setSelectedImage(images[newIndex].url);
    };
  
    const prevImage = () => {
      const newIndex = (currentIndex - 1 + images.length) % images.length;
      setCurrentIndex(newIndex);
      setSelectedImage(images[newIndex].url);
    };
  
    useEffect(() => {
      if (currentImage) {
        setSelectedImage(currentImage.url);
        const index = images.findIndex(img => img.url === currentImage.url);
        if (index !== -1) {
          setCurrentIndex(index);
        }
      } else {
        setSelectedImage(images[0]?.url || '');
        setCurrentIndex(0);
      }
    }, [currentImage, images]);

    return (
      <div className="relative h-full">
        {/* Main Image Container */}
        <div className="relative h-[400px] md:h-[500px] mb-4 overflow-visible rounded-lg flex gap-4">
          <AnimatePresence>
            <motion.div
              key={selectedImage}
              className="w-full h-full relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => setShowEnlargedImage(true)}
            >
              <img 
                src={selectedImage}
                alt={`Product image ${currentIndex + 1}`}
                className="w-full h-full object-contain rounded-lg cursor-zoom-in"
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button 
            onClick={prevImage} 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
          >
            <FaChevronLeft />
          </button>
          <button 
            onClick={nextImage} 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {images.map((img, index) => (
            <motion.div
              key={index}
              className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 cursor-pointer rounded-md ${
                index === currentIndex ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-200 dark:ring-gray-700'
              }`}
              onClick={() => {
                setCurrentIndex(index);
                setSelectedImage(img.url);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={img.url}
                alt={img.alt || `Product thumbnail ${index + 1}`}
                className="w-full h-full object-contain rounded-md"
              />
            </motion.div>
          ))}
        </div>

        {/* Enlarged Image Modal */}
        {showEnlargedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEnlargedImage(false)}
          >
            <div className="relative max-w-[90vw] max-h-[90vh]">
              <img
                src={selectedImage}
                alt={`Enlarged product image ${currentIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain"
              />
              <button
                className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70"
                onClick={() => setShowEnlargedImage(false)}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

export default ProductImages;
