/* eslint-disable react/prop-types */
import { useGetAllProductsQuery } from '../../../redux/api/ProductApi'
import Title from '../../../UI/Title'
import { FaStar } from 'react-icons/fa'
import { MdOutlineShoppingCart } from 'react-icons/md'
import { useState, useEffect } from 'react'

const ProductCard = ({ product }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-4 rounded-lg group cursor-pointer">
      <div className="relative w-full aspect-square overflow-hidden">
        <img 
          src={product.images[0]?.url} 
          alt={product.images[0]?.alt || product.title} 
          className="absolute top-0 left-0 w-full h-full object-contain p-2 sm:p-4 group-hover:scale-110 transition duration-300"
        />
      </div>
      <div className="flex items-center my-1 sm:my-2">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`${index < product.rating.average ? "text-yellow-500" : "text-gray-300"} text-xs sm:text-sm`}
          />
        ))}
        <span className="text-gray-600 ml-1 sm:ml-2 text-xs sm:text-sm">{product.rating.count}</span>
      </div>
      <h2 className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 overflow-hidden text-ellipsis h-8 sm:h-10 text-center text-gray-900">
        {product.title}
      </h2>
      <div className="flex items-center justify-between w-full px-1 sm:px-2">
        <div className="flex items-center mb-1 sm:mb-2">
          <span className="text-sm sm:text-base font-bold">${product.price.regular}</span>
          {product.price.discounted && (
            <span className="text-gray-500 line-through ml-1 sm:ml-2 text-xs sm:text-sm">${product.price.discounted}</span>
          )}
        </div>
        <button className="bg-gray-100 text-gray-700 p-1 sm:p-2 rounded hover:bg-gray-200">
          <MdOutlineShoppingCart className="text-base sm:text-lg" />
        </button>
      </div>
    </div>
  )
}

const TrendingProducts = () => {
  const { data, isLoading, error } = useGetAllProductsQuery()
  const [trendingProducts, setTrendingProducts] = useState([])

  useEffect(() => {
    if (data?.data) {
      const filtered = data.data.filter(product => product.isFeatured || product.isOnSale).slice(0, 8)
      setTrendingProducts(filtered)
    }
  }, [data])

  if (isLoading) return <div className="text-center py-4 sm:py-8">Loading...</div>
  if (error) return <div className="text-center py-4 sm:py-8 text-red-500">Error occurred!</div>

  return (
    <div className='container mx-auto px-2 sm:px-4 py-4 sm:py-8'>
      <Title title="Trending Products" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
        {trendingProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default TrendingProducts