import { FaStar } from 'react-icons/fa'
import { useGetAllProductQuery } from '../../../redux/api/ProductApi'
import Title from '../../../UI/Title'
import { MdOutlineShoppingCart } from 'react-icons/md'

const TrendingProducts = () => {
  const {data, isLoading, error} = useGetAllProductQuery()
  if(isLoading) return <div>Loading...</div>
  if(error) return <div>Error occurred!</div>
  console.log(data.data)
  return (
    <div className='container lg:h-[916px] mx-auto'>
        <Title title={"Trending Products"}/>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
      {
        data.data.slice(0,8).map((product) => {
          return (
            <div key={product._id} className="w-[306px] lg:w-full flex flex-col  items-center justify-center h-[402px]  p-4 rounded-lg  group cursor-pointer">
              <img src={product.images[0]} alt={product.title} className="w-[258px] h-[240px] p-6 group-hover:scale-110 group-hover:transition group-hover:duration-300 " />
              <div className="flex items-center my-1">
              {[...Array(5)].map((star, index) => {
                return (
                  <FaStar
                    key={index}
                    className={`${index < product.rating ? "text-yellow-500 " : "text-gray-300 "} size-[12px] lg:size-[16px] `}
                  />
                );
              })}
              <span className="text-gray-600 ml-2">{product.ratingCount}</span>
            </div>
            
              <h2 className="text-sm font-medium mb-3 mt-2 overflow-hidden text-ellipsis h-10 text-gray-900">{product.title}</h2>


              <div className="flex items-center justify-between w-full px-8">
              <div className="flex items-center mb-2">
                <span className="text-xl font-bold">${product.price}</span>
                {product.oldPrice && (
                  <span className="text-gray-500 line-through ml-2">${product.oldPrice}</span>
                )}
              </div>
              <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded hover:">
              <MdOutlineShoppingCart className=' size-[20px]'/>
              </button>
              </div>
            </div>
          )
        })
      }
    </div>
    </div>
  )
}

export default TrendingProducts