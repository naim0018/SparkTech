import Title from "../../../UI/Title"
import { FaHeart } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { TbCurrencyTaka } from "react-icons/tb";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../../redux/features/CartSlice';
import { addToWishlist, removeFromWishlist } from '../../../redux/features/wishlistSlice';
import { toast } from 'react-toastify';
import { useTheme } from '../../../ThemeContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { useState } from 'react';
import PropTypes from 'prop-types';


const CategoryShowcase = ({category, products}) => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const wishlistItems = useSelector(state => state.wishlist.wishlistItems);
  const [swiper, setSwiper] = useState(null);
  const handleMouseEnter = () => {
    if (swiper?.autoplay?.running) {
      swiper.autoplay.stop();
    }
  };

  const handleMouseLeave = () => {
    if (swiper?.autoplay && !swiper.autoplay.running) {
      swiper.autoplay.start();
    }
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    dispatch(addToCart({
      id: product._id,
      name: product.basicInfo.title,
      price: product.price.discounted || product.price.regular,
      image: product.images[0].url,
      quantity: 1
    }));
    toast.success('Product added to cart!', {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const toggleWishlist = (product, e) => {
    e.preventDefault();
    const isInWishlist = wishlistItems.some(item => item._id === product._id);
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
      toast.success('Removed from wishlist!', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      dispatch(addToWishlist({
        _id: product._id,
        title: product.basicInfo.title,
        price: product.price.discounted || product.price.regular,
        image: product.images[0].url
      }));
      toast.success('Added to wishlist!', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className={`container mx-auto ${isDarkMode ? 'bg-gray-900' : 'bg-white'} `}>
      <Title title={category} />
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{ 
            clickable: true,
            el: '.swiper-pagination',
            type: 'bullets',
          }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          onSwiper={setSwiper}
          className="category-showcase-swiper"
        >
          {products.map((product) => (
            <SwiperSlide key={product._id}>
              <div className={`flex flex-col items-center justify-center p-4  group cursor-pointer transition duration-300 ease-in-out hover:shadow-lg ${isDarkMode ? 'hover:bg-gray-800 bg-gray-800' : 'hover:bg-white'} rounded-lg mb-5`}>
                <Link to={`/product/${product._id}`} className="w-full flex flex-col items-center">
                  <div className="relative w-full">
                    <img
                      src={product.images[0]?.url}
                      alt={product.images[0]?.alt || product.basicInfo.title}
                      className="w-full h-80 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    {product.price.discounted && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                        {Math.round(((product.price.regular - product.price.discounted) / product.price.regular) * 100)}% OFF
                      </div>
                    )}
                  </div>

                  <div className={`w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h2 className={`text-base font-semibold mb-2 mt-10 line-clamp-2 h-12 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {product.basicInfo.title}
                    </h2>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className={`text-xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} flex items-center`}>
                          <TbCurrencyTaka className="w-5 h-5" />{product.price.discounted || product.price.regular}
                        </span>
                        {product.price.discounted && (
                          <span className="text-gray-500 line-through ml-2 text-sm flex items-center">
                            <TbCurrencyTaka className="w-4 h-4" />{product.price.regular}
                          </span>
                        )}
                      </div>
                      <div className={`text-sm ${product.stockStatus === 'In Stock' ? 'text-green-500' : 'text-red-500'}`}>
                        {product.stockStatus}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button 
                        onClick={(e) => handleAddToCart(product, e)}
                        className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                          isDarkMode 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        <MdOutlineShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </button>
                      <button 
                        onClick={(e) => toggleWishlist(product, e)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          wishlistItems.some(item => item._id === product._id)
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : isDarkMode 
                              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                        aria-label={wishlistItems.some(item => item._id === product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      >
                        <FaHeart className={`w-5 h-5 ${
                          wishlistItems.some(item => item._id === product._id)
                            ? 'text-white'
                            : 'text-gray-500'
                        }`} />
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          ))}
          
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </Swiper>
      </div>
      <style>{`
        .category-showcase-swiper .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: ${isDarkMode ? '#e2e8f0' : '#222934'};
          opacity: 0.5;
          transition: all 0.3s ease;
        }
        .category-showcase-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: ${isDarkMode ? '#e2e8f0' : '#222934'};
        }
        
      `}</style>
     
    </div>
  )
}

CategoryShowcase.propTypes = {
  category: PropTypes.string.isRequired,
  products: PropTypes.array.isRequired
};

export default CategoryShowcase
