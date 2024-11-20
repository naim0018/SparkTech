import { useState, useMemo } from 'react';
import { useGetAllProductsQuery } from '../../redux/api/ProductApi';
import ProductCard from '../Shop/ProductCard';
import { useTheme } from '../../ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const NewArrivals = () => {
  const { isDarkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12); // Changed to 12 products per page

  // Query all products sorted by creation date
  const { data: productsData, isLoading, isError } = useGetAllProductsQuery({
    page: currentPage,
    limit: productsPerPage,
    sort: '-createdAt'
  });

  // Filter products from last 7 days
  const recentProducts = useMemo(() => {
    if (!productsData?.products) return [];
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return productsData.products.filter(product => {
      const productDate = new Date(product.createdAt);
      return productDate >= sevenDaysAgo;
    });
  }, [productsData?.products]);

  // Calculate total pages based on filtered products
  const totalPages = Math.ceil(recentProducts.length / productsPerPage);

  // Get current page products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = recentProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-8">
        Error loading new arrivals
      </div>
    );
  }

  return (
    <div className={`max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-12 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
    }`}>
      <h2 className="text-3xl font-bold mb-8 text-center">Check out our latest products</h2>
      {recentProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No new products</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {currentProducts.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center space-x-2">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === idx + 1
                      ? 'bg-blue-500 text-white'
                      : isDarkMode
                      ? 'bg-gray-700 text-gray-200'
                      : 'bg-gray-200 text-gray-700'
                  } hover:opacity-80 transition-opacity`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewArrivals;
