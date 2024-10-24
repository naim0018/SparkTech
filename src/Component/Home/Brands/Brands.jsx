import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '../../../ThemeContext';
import Title from '../../../UI/Title';

const brandLogos = [
  { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
  { name: 'LG', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/LG_logo_%282015%29.svg' },
  { name: 'Panasonic', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Panasonic_logo_%282019%29.svg' },
  { name: 'Android', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Android_robot.svg' },
];

const Brands = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, threshold: 0.1 });
  const { isDarkMode } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <section ref={ref} className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        <Title title="Trusted by Leading Brands" className="mb-12 text-center" />
        
        <motion.div 
          className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {brandLogos.map((brand) => (
            <motion.div
              key={brand.name}
              variants={itemVariants}
              className={`w-24 h-24 md:w-32 md:h-32 flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src={brand.logo} 
                alt={`${brand.name} logo`} 
                className={`w-16 h-16 md:w-20 md:h-20 ${isDarkMode ? 'filter invert' : ''}`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Brands;