import { useState, useMemo } from 'react';
import { useGetAllProductsQuery } from '../../redux/api/ProductApi';
import ProductCard from '../Shop/ProductCard';
import { useTheme } from '../../ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const BestDeals = () => {
  const { isDarkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  const { data: productsData, isLoading, isError } = useGetAllProductsQuery({
    page: currentPage,
    limit: productsPerPage
  });
console.log(productsData)
  // Filter products that are on sale and have a discount
  const saleProducts = useMemo(() => {
    if (!productsData?.products) return [];
    return productsData.products.filter(product => 
      product.additionalInfo.isOnSale ||
      product.price.discounted < product.price.regular

    );
  }, [productsData?.products]);

  // Calculate total pages based on filtered products
  const totalPages = Math.ceil(saleProducts.length / productsPerPage);

  // Get current page products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = saleProducts.slice(indexOfFirstProduct, indexOfLastProduct);

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
        Error loading deals
      </div>
    );
  }

  return (
    <div className={`max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-12 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
    }`}>
      <h2 className="text-3xl font-bold mb-8 text-center">Best Deals</h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Products with the biggest discounts
      </p>
      {saleProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No products on sale</p>
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
                  <div className="relative">
                    {product.price.discounted < product.price.regular && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md z-10">
                        {Math.round(product.price.savingsPercentage || ((product.price.regular - product.price.discounted) / product.price.regular) * 100)}% OFF
                      </div>
                    )}
                    <ProductCard product={product} />
                  </div>
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

export default BestDeals;