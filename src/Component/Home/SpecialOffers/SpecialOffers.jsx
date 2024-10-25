/* eslint-disable react/prop-types */
import { useGetAllProductsQuery } from "../../../redux/api/ProductApi";
import Title from "../../../UI/Title";
import { FaStar } from "react-icons/fa";
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
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/features/CartSlice';
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

  useEffect(() => {
    if (data?.data) {
      // Ensure we only show 8 products that are on sale
      const onSaleProducts = data.data.filter(product => product.additionalInfo.isOnSale);
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
            className="special-offers-swiper"
          >
            {products.map((product) => (
              <SwiperSlide key={product._id}>
                <div className={`w-full flex flex-col items-center justify-center mb-10 p-4 pt-8 group cursor-pointer transition duration-300 ease-in-out hover:shadow-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-white'} rounded-lg lg:rounded-lg`}>
                  <Link to={`/product/${product._id}`} className="w-full flex flex-col items-center">
                    <img
                      src={product.images[0]?.url}
                      alt={product.images[0]?.alt || product.basicInfo.title}
                      className="size-72 object-contain bg-white rounded-lg p-6 transition duration-300 ease-in-out group-hover:scale-105"
                    />
                    <div className="flex items-center my-2 mt-3">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className={`${
                            index < product.rating.average ? "text-yellow-500" : isDarkMode ? "text-gray-600" : "text-gray-300"
                          } size-[12px] lg:size-[16px]`}
                        />
                      ))}
                    </div>
                    <h2 className={`text-sm font-medium mb-3 mt-2 overflow-hidden text-ellipsis h-10 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {product.basicInfo.title}
                    </h2>
                    <div className="flex items-center justify-between w-full px-2">
                      <div className="flex items-center mb-2">
                        <span className={`text-xl font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'} flex items-center`}>
                          <TbCurrencyTaka />{product.price.discounted || product.price.regular}
                        </span>
                        {product.price.discounted && (
                          <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'} line-through ml-2 flex items-center`}>
                            <TbCurrencyTaka />{product.price.regular}
                          </span>
                        )}
                      </div>
                      <button 
                        className={`${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} py-2 px-4 rounded`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                      >
                        <MdOutlineShoppingCart className="size-[20px]" />
                      </button>
                    </div>
                    <div className="w-full px-2 my-2 h-[60px]">
                      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                        Status: <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'} font-semibold`}>{product.stockStatus}</span>
                      </p>
                      {product.stockStatus === 'In Stock' && product.stockQuantity ? (
                        <>
                          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                            Available: <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'} font-semibold`}>{product.stockQuantity}</span>
                          </p>
                          <div className={`w-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-full h-1 my-[5px]`}>
                            <div
                              className={`h-1 rounded-full ${product.stockQuantity < 30 ? 'bg-red-500' : 'bg-green-500'}`}
                              style={{ width: `${(product.stockQuantity / 100) * 100}%` }}
                            ></div>
                          </div>
                        </>
                      ) : (
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                          Available: <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'} font-semibold`}>Out of Stock</span>
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
            <div className="swiper-pagination"></div>
          </Swiper>
        </div>
      )}
      <style>{`
        .special-offers-swiper .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: ${isDarkMode ? '#e2e8f0' : '#222934'};
          opacity: 0.5;
          transition: all 0.3s ease;
        }
        .special-offers-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: ${isDarkMode ? '#e2e8f0' : '#222934'};
        }
        .special-offers-swiper .swiper-pagination {
          bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default SpecialOffers;
