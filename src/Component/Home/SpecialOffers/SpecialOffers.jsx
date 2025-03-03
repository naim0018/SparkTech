/* eslint-disable react/prop-types */
import { useGetAllProductsQuery } from "../../../redux/api/ProductApi";
import Title from "../../../UI/Title";
import {  FaHeart } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { TbCurrencyTaka } from "react-icons/tb";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../../redux/features/CartSlice';
import { addToWishlist, removeFromWishlist } from '../../../redux/features/wishlistSlice';
import { toast } from 'react-toastify';
import { useTheme } from '../../../ThemeContext';

const SpecialOffers = () => {
  const { data, isLoading } = useGetAllProductsQuery({
    'additionalInfo.isOnSale': true
  });
  const [products, setProducts] = useState([]);
  const [swiper, setSwiper] = useState(null);
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const wishlistItems = useSelector(state => state.wishlist.wishlistItems);

  useEffect(() => {
    if (data?.products) {
      // Ensure we only show 8 products that are on sale
      const onSaleProducts = data.products.filter(product => product.additionalInfo.isOnSale);
      setProducts(onSaleProducts.slice(0, 8));
    }
  }, [data]);

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

  const handleAddToCart = (product) => {
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

  const handleAddToWishlist = (product) => {

    if (wishlistItems.some(item => item._id === product._id)) {
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
    toast.success('Product added to wishlist!', {
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
    <div className={`container mx-auto ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <Title title="Special Offers" />
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDarkMode ? 'border-blue-400' : 'border-blue-500'}`}></div>
        </div>
      ) : (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
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
            className="special-offers-swiper"
          >
            {products.map((product) => (
              <SwiperSlide key={product._id}>
                <div className={`w-full flex flex-col items-center justify-center mb-10 p-4 group cursor-pointer transition duration-300 ease-in-out hover:shadow-lg ${isDarkMode ? 'hover:bg-gray-800 bg-gray-800' : 'hover:bg-white'} rounded-lg lg:rounded-lg mb-5`}>
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

                    <div className={`w-full p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
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

                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                          className={`flex-1 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                          }`}
                        >
                          <MdOutlineShoppingCart className="w-5 h-5" />
                          Add to Cart
                        </button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToWishlist(product);
                           }}
                          className={`p-2 rounded-lg transition-colors ${
                            wishlistItems.some(item => item._id === product._id)
                              ? 'bg-red-500 text-white'
                              : isDarkMode 
                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                          }`}
                        >
                          <FaHeart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
            <div className="swiper-button-next swiper-button-white"></div>
            <div className="swiper-button-prev swiper-button-white"></div>
          </Swiper>
        </div>
      )}
      
    </div>
  );
};

export default SpecialOffers;
