/* eslint-disable react/prop-types */
import { FaStar } from 'react-icons/fa'
import { useGetAllProductsQuery } from '../../../redux/api/ProductApi'
import Title from '../../../UI/Title'
import { MdOutlineShoppingCart } from 'react-icons/md'

const ProductCard = ({ product }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-4 rounded-lg group cursor-pointer">
      <div className="relative w-full pb-[100%] overflow-hidden">
        <img 
          src={product.images[0]} 
          alt={product.title} 
          className="absolute top-0 left-0 w-full h-full object-contain p-4 group-hover:scale-110 transition duration-300"
        />
      </div>
      <div className="flex items-center my-2">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`${index < product.rating ? "text-yellow-500" : "text-gray-300"} text-xs sm:text-sm`}
          />
        ))}
        <span className="text-gray-600 ml-2 text-xs sm:text-sm">{product.ratingCount}</span>
      </div>
      <h2 className="text-xs sm:text-sm font-medium mb-2 overflow-hidden text-ellipsis h-10 text-center text-gray-900">
        {product.title}
      </h2>
      <div className="flex items-center justify-between w-full px-2">
        <div className="flex items-center mb-2">
          <span className="text-sm sm:text-base font-bold">${product.price}</span>
          {product.oldPrice && (
            <span className="text-gray-500 line-through ml-2 text-xs sm:text-sm">${product.oldPrice}</span>
          )}
        </div>
        <button className="bg-gray-100 text-gray-700 p-2 rounded hover:bg-gray-200">
          <MdOutlineShoppingCart className="text-lg sm:text-xl" />
        </button>
      </div>
    </div>
  )
}

const TrendingProducts = () => {
  const { data, isLoading, error } = useGetAllProductsQuery()

  if (isLoading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-center py-8 text-red-500">Error occurred!</div>

  return (
    <div className='container mx-auto px-4 py-8'>
      <Title title="Trending Products" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {data?.data?.slice(0, 8).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default TrendingProducts