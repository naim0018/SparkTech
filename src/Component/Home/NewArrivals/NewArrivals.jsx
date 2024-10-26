/* eslint-disable react/prop-types */
import { useGetAllProductsQuery } from "../../../redux/api/ProductApi";
import Title from "../../../UI/Title";
import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import FeaturedProduct from "./FeaturedProduct";
import ProductCard from "./ProductCard";

const NewArrivals = () => {
  const { data, isLoading } = useGetAllProductsQuery({});
  
  const [products, setProducts] = useState([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  useEffect(() => {
    if (data?.products) {
      setProducts(data.products.slice(0, 8));
    }
  }, [data]);

  return (
    <section ref={ref} className="container mx-auto px-4 py-8 overflow-x-hidden">
      <Title title="New Arrivals" className="mb-6 text-center" />
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div 
            className="md:col-span-2 lg:col-span-1"
            initial={{ x: -50 }}
            animate={isInView ? { x: 0 } : { x: -50 }}
            exit={{ x: -50 }}
            transition={{ duration: 1 }}
          >
            <FeaturedProduct />
          </motion.div>
          <motion.div 
            className="md:col-span-2"
            initial={{ x: 50 }}
            animate={isInView ? { x: 0 } : { x: 50 }}
            transition={{ duration: 1 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
              <AnimatePresence>
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ x: 50, }}
                    animate={isInView ? { x: 0  } : { x: 50 }}
                    exit={{ x: -50 }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  >
                    <ProductCard product={product} isInView={isInView} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default NewArrivals;
