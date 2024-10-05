/* eslint-disable react/prop-types */
import { useGetAllProductsQuery } from "../../../redux/api/ProductApi";
import Title from "../../../UI/Title";
import { FaStar } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Link } from 'react-router-dom';

const SpecialOffers = () => {
  const { data, isLoading } = useGetAllProductsQuery({
    isOnSale: true
  });
  const [products, setProducts] = useState([]);
  const [swiper, setSwiper] = useState(null);

  useEffect(() => {
    if (data?.data) {
      setProducts(data.data.slice(0, 8));
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

  return (
    <div className="container mx-auto">
      <Title title="Special Offers" />
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
            pagination={{ clickable: true, el: '.swiper-pagination' }}
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
                <div className="w-full flex flex-col items-center justify-center mb-10 p-4 pt-8 group cursor-pointer transition duration-300 ease-in-out hover:shadow-lg hover:bg-white rounded-lg lg:rounded-lg">
                  <Link to={`/product/${product._id}`} className="w-full flex flex-col items-center">
                    <img
                      src={product.images[0]?.url}
                      alt={product.images[0]?.alt || product.title}
                      className="size-72 object-contain p-6 transition duration-300 ease-in-out group-hover:scale-105"
                    />
                    <div className="flex items-center my-1">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className={`${
                            index < product.rating.average ? "text-yellow-500" : "text-gray-300"
                          } size-[12px] lg:size-[16px]`}
                        />
                      ))}
                    </div>
                    <h2 className="text-sm font-medium mb-3 mt-2 overflow-hidden text-ellipsis h-10 text-gray-900">
                      {product.title}
                    </h2>
                    <div className="flex items-center justify-between w-full px-2">
                      <div className="flex items-center mb-2">
                        <span className="text-xl font-bold">${product.price.discounted || product.price.regular}</span>
                        {product.price.discounted && (
                          <span className="text-gray-500 line-through ml-2">
                            ${product.price.regular}
                          </span>
                        )}
                      </div>
                      <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200">
                        <MdOutlineShoppingCart className="size-[20px]" />
                      </button>
                    </div>
                    <div className="w-full px-2 my-2">
                      <p className="text-gray-500 text-sm">
                        Status: <span className="text-gray-900 font-semibold">{product.stockStatus}</span>
                      </p>
                      {product.stockStatus === 'In Stock' && product.stockQuantity && (
                        <>
                          <p className="text-gray-500 text-sm">
                            Available: <span className="text-gray-900 font-semibold">{product.stockQuantity}</span>
                          </p>
                          <div className="w-full overflow-hidden bg-gray-300 rounded-full h-1 my-[5px]">
                            <div
                              className={`h-1 rounded-full ${product.stockQuantity < 30 ? 'bg-red-500' : 'bg-green-500'}`}
                              style={{ width: `${(product.stockQuantity / 100) * 100}%` }}
                            ></div>
                          </div>
                        </>
                      )}
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
            <div className="swiper-button-next"></div>
            <div className="swiper-button-prev"></div>
          </Swiper>
        </div>
      )}
      <style >{`
        .special-offers-swiper .swiper-button-next,
        .special-offers-swiper .swiper-button-prev {
          color: #222934;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          transition: all 0.5s ease;
          margin: 0 0px;
          padding-left: 5px;
          font-weight: bold;
        }
          .special-offers-swiper .swiper-button-prev{
            padding-left: 0px;
            padding-right: 5px;
          }

        .special-offers-swiper .swiper-button-next:after,
        .special-offers-swiper .swiper-button-prev:after {
          font-size: 20px;
          font-weight: bold;
        }

        .special-offers-swiper .swiper-button-next {
          right: 10px;
        }

        .special-offers-swiper .swiper-button-prev {
          left: 10px;
        }
      `}</style>
    </div>
  );
};

export default SpecialOffers;
