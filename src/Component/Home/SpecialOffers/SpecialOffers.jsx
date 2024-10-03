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

// Component to display a single product card
const ProductCard = ({ product }) => {
  const { images, title, rating, price, stockStatus, stockQuantity } = product;

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 pt-8 group cursor-pointer">
      <img
        src={images[0]?.url}
        alt={images[0]?.alt || title}
        className="size-72 object-contain p-6 group-hover:scale-110 group-hover:transition group-hover:duration-300"
      />
      <RatingStars rating={rating.average} />
      <h2 className="text-sm font-medium mb-3 mt-2 overflow-hidden text-ellipsis h-10 text-gray-900">
        {title}
      </h2>
      <PriceDisplay price={price} />
      <StockInfo stockStatus={stockStatus} stockQuantity={stockQuantity} />
    </div>
  );
};

// Component to display rating stars
const RatingStars = ({ rating }) => (
  <div className="flex items-center my-1">
    {[...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`${
          index < rating ? "text-yellow-500" : "text-gray-300"
        } size-[12px] lg:size-[16px]`}
      />
    ))}
  </div>
);

// Component to display product price
const PriceDisplay = ({ price }) => (
  <div className="flex items-center justify-between w-full px-2">
    <div className="flex items-center mb-2">
      <span className="text-xl font-bold">${price.discounted || price.regular}</span>
      {price.discounted && (
        <span className="text-gray-500 line-through ml-2">
          ${price.regular}
        </span>
      )}
    </div>
    <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200">
      <MdOutlineShoppingCart className="size-[20px]" />
    </button>
  </div>
);

// Component to display stock information
const StockInfo = ({ stockStatus, stockQuantity }) => (
  <div className="w-full px-2 my-2">
    <p className="text-gray-500 text-sm">
      Status: <span className="text-gray-900 font-semibold">{stockStatus}</span>
    </p>
    {stockStatus === 'In Stock' && stockQuantity && (
      <>
        <p className="text-gray-500 text-sm">
          Available: <span className="text-gray-900 font-semibold">{stockQuantity}</span>
        </p>
        <div className="w-full overflow-hidden bg-gray-300 rounded-full h-1 my-[5px]">
          <div
            className={`h-1 rounded-full ${stockQuantity < 30 ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${(stockQuantity / 100) * 100}%` }}
          ></div>
        </div>
      </>
    )}
  </div>
);

// Main component for Special Offers section
const SpecialOffers = () => {
  const { data, isLoading, error } = useGetAllProductsQuery({
    isOnSale: true
  });
  const [products, setProducts] = useState([]);
  const [swiper, setSwiper] = useState(null);

  // Update products when data changes
  useEffect(() => {
    if (data?.data) {
      setProducts(data.data.slice(0, 8));
    }
  }, [data]);

  // Handle mouse enter event to stop autoplay
  const handleMouseEnter = () => {
    if (swiper?.autoplay?.running) {
      swiper.autoplay.stop();
    }
  };

  // Handle mouse leave event to start autoplay
  const handleMouseLeave = () => {
    if (swiper?.autoplay && !swiper.autoplay.running) {
      swiper.autoplay.start();
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred!</div>;

  return (
    <div className="container mx-auto">
      <Title title="Special Offers" />
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
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </Swiper>
      </div>
      <style >{`
        .special-offers-swiper .swiper-button-next,
        .special-offers-swiper .swiper-button-prev {
          color: #222934;
          // background-color: rgba(0, 0, 0, 0.5);
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
