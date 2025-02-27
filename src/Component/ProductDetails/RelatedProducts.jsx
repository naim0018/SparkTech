/* eslint-disable react/prop-types */
import { useGetAllProductsQuery } from '../../redux/api/ProductApi';
import Title from '../../UI/Title';
import { useTheme } from '../../ThemeContext';
import { TbCurrencyTaka } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { FaHeart } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/features/CartSlice';
import { addToWishlist, removeFromWishlist } from '../../redux/features/wishlistSlice';
import { toast } from 'react-toastify';
import CartSidebar from '../Common/CartSidebar';
import WishlistSidebar from '../Common/WishlistSidebar';

const RelatedProducts = ({ currentProduct }) => {
  const { isDarkMode } = useTheme();
  const [swiper, setSwiper] = useState(null);
  const dispatch = useDispatch();
  const wishlistItems = useSelector(state => state.wishlist.wishlistItems);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [showWishlistSidebar, setShowWishlistSidebar] = useState(false);
  
  const { data: relatedProducts, isLoading } = useGetAllProductsQuery({
    category: currentProduct?.basicInfo?.category,
    limit: 8
  });

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
    setShowCartSidebar(true);
    toast.success('Product added to cart!');
  };

  const toggleWishlist = (product, e) => {
    e.preventDefault();
    const isInWishlist = wishlistItems.some(item => item._id === product._id);
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
      toast.success('Removed from wishlist!');
    } else {
      dispatch(addToWishlist({
        _id: product._id,
        title: product.basicInfo.title,
        price: product.price.discounted || product.price.regular,
        image: product.images[0].url
      }));
      setShowWishlistSidebar(true);
      toast.success('Added to wishlist!');
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-48">
      <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDarkMode ? 'border-blue-400' : 'border-blue-500'}`}></div>
    </div>
  );

  // Filter out the current product from related products
  const filteredProducts = relatedProducts?.products?.filter(
    product => product._id !== currentProduct._id
  ) || [];

  if (filteredProducts.length === 0) return null;

  return (
    <div className={`container mx-auto ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <Title title="Related Products" />
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
          className="category-showcase-swiper"
        >
          {filteredProducts.map((product) => (
            <SwiperSlide key={product._id}>
              <div className={`flex flex-col items-center justify-center p-4 pt-8 group cursor-pointer transition duration-300 ease-in-out hover:shadow-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-white'} rounded-lg`}>
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
      <CartSidebar 
        isOpen={showCartSidebar} 
        onClose={() => setShowCartSidebar(false)} 
      />
      <WishlistSidebar 
        isOpen={showWishlistSidebar} 
        onClose={() => setShowWishlistSidebar(false)} 
      />
    </div>
  );
};

export default RelatedProducts;
