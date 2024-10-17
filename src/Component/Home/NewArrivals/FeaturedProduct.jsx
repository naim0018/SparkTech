import { AnimatePresence, motion } from "framer-motion";

const FeaturedProduct = () => {
  return (
    // Featured product component
    <motion.div
      className="w-full h-56 md:h-[100%]"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        <motion.img
          key="featured-image"
          src="https://i.imgur.com/RRiXXWS.jpg"
          alt="Featured Product"
          className="w-full h-full object-fill rounded-lg"
          loading="lazy"
          decoding="async"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          exit={{ y: -20 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
      </AnimatePresence>
    </motion.div>
  );
};

export default FeaturedProduct;
