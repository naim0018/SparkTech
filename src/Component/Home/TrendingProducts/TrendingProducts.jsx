/* eslint-disable react/prop-types */
import { useGetAllProductsQuery } from '../../../redux/api/ProductApi'
import Title from '../../../UI/Title'
import { FaStar } from 'react-icons/fa'
import { MdOutlineShoppingCart } from 'react-icons/md'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../../redux/features/CartSlice'
import { toast } from 'react-toastify'

const TrendingProducts = () => {
  const { data, isLoading } = useGetAllProductsQuery()
  const [trendingProducts, setTrendingProducts] = useState([])
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false})
  const dispatch = useDispatch()

  useEffect(() => {
    if (data?.data) {
      const filtered = data.data.filter(product => product.isFeatured || product.isOnSale).slice(0, 8)
      setTrendingProducts(filtered)
    }
  }, [data])

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      id: product._id,
      name: product.title,
      price: product.price.discounted || product.price.regular,
      image: product.images[0].url,
      quantity: 1
    }))
    toast.success('Product added to cart!', {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }

  return (
    <div ref={ref} className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <Title title="Trending Products" className="mb-6 text-center"/>
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : !data || !data.data ? (
        <div className="text-center py-4 sm:py-8">No data available</div>
      ) : (
        <motion.div  
          initial={{ y: 50 }}
          animate={isInView ? { y: 0 } : { y: 50 }}
          transition={{ duration: 1.5 }}
        >
          {trendingProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
              <AnimatePresence>
                {trendingProducts.map((product, index) => (
                  <motion.div 
                    key={product._id}
                    initial={{ y: 20, scale: 0.5 }}
                    animate={isInView ? { y: 0, scale: 1 } : { y: 20, scale: 0.5 }}
                    exit={{ y: -20, scale: 0.5 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="block w-full">
                      <motion.div 
                        className="w-full flex flex-col items-center justify-center p-2 sm:p-4 rounded-lg group cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                      >
                        <Link to={`/product/${product._id}`} className="relative w-[90%] aspect-square overflow-hidden">
                          <motion.img 
                            src={product.images[0]?.url} 
                            alt={product.images[0]?.alt || product.title} 
                            className="absolute top-0 left-0 w-full h-full object-contain p-2 sm:p-4"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                          />
                        </Link>
                        <div className="flex items-center my-1 sm:my-2">
                          {[...Array(5)].map((_, starIndex) => (
                            <FaStar
                              key={starIndex}
                              className={`${starIndex < (product.rating?.average || 0) ? "text-yellow-500" : "text-gray-300"} text-xs sm:text-sm`}
                            />
                          ))}
                          <span className="text-gray-600 ml-1 sm:ml-2 text-xs sm:text-sm">{product.rating?.count || 0}</span>
                        </div>
                        <h2 className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 overflow-hidden text-ellipsis h-8 sm:h-10 text-center text-gray-900">
                          {product.title}
                        </h2>
                        <div className="flex items-center justify-between w-full px-1 sm:px-2">
                          <div className="flex items-center mb-1 sm:mb-2">
                            <motion.span 
                              className="text-sm sm:text-base font-bold"
                              whileHover={{ scale: 1.1 }}
                            >
                              ${product.price?.discounted || product.price?.regular || 'N/A'}
                            </motion.span>
                            {product.price?.discounted && product.price?.regular && (
                              <span className="text-gray-500 line-through ml-1 sm:ml-2 text-xs sm:text-sm">
                                ${product.price.regular}
                              </span>
                            )}
                          </div>
                          <motion.button 
                            className="bg-gray-100 text-gray-700 p-1 sm:p-2 rounded hover:bg-gray-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleAddToCart(product)}
                          >
                            <MdOutlineShoppingCart className="text-base sm:text-lg" />
                          </motion.button>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-4 sm:py-8">
              No trending products available.
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default TrendingProducts