/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';

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
        {/* Main Image Container with gradient border */}
        <div className="relative h-[400px] md:h-[500px] mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 p-1">
          <div className="relative h-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                className="w-full h-full relative group"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <img 
                  src={selectedImage}
                  alt={`Product image ${currentIndex + 1}`}
                  className="w-full h-full object-contain rounded-2xl cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Expand button overlay */}
                <motion.button
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  onClick={() => setShowEnlargedImage(true)}
                  className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-black/80 transition-all duration-300 opacity-0 group-hover:opacity-100"
                >
                  <FaExpand className="text-lg" />
                </motion.button>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons with gradient */}
            {images.length > 1 && (
              <>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevImage} 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg z-10"
                >
                  <FaChevronLeft className="text-lg" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextImage} 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg z-10"
                >
                  <FaChevronRight className="text-lg" />
                </motion.button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>

        {/* Thumbnails with gradient borders */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-200 dark:scrollbar-track-gray-800">
          {images.map((img, index) => (
            <motion.div
              key={index}
              className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
                index === currentIndex 
                  ? 'ring-4 ring-orange-500 shadow-lg shadow-orange-500/50' 
                  : 'ring-2 ring-gray-300 dark:ring-gray-700 hover:ring-orange-400'
              }`}
              onClick={() => {
                setCurrentIndex(index);
                setSelectedImage(img.url);
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={img.url}
                alt={img.alt || `Product thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>

        {/* Enlarged Image Modal with backdrop blur */}
        <AnimatePresence>
          {showEnlargedImage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
              onClick={() => setShowEnlargedImage(false)}
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                className="relative max-w-[90vw] max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage}
                  alt={`Enlarged product image ${currentIndex + 1}`}
                  className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
                />
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute -top-4 -right-4 text-white bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-full hover:from-orange-600 hover:to-orange-700 shadow-lg text-xl font-bold"
                  onClick={() => setShowEnlargedImage(false)}
                >
                  ✕
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

export default ProductImages;

