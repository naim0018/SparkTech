import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const brandNames = ['Apple', 'Samsung', 'Sony', 'Canon', 'Android'];

const Brands = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  useEffect(() => {
    if (isInView) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isInView]);

  return (
    <section ref={ref} className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Our Trusted Brands</h2>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {brandNames.map((brand, index) => (
            <motion.div
              key={brand}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-32 h-32 flex items-center justify-center bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <span className="text-xl font-semibold text-gray-700">{brand}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Brands;