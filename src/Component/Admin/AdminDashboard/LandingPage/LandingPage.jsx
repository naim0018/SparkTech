/* eslint-disable no-unused-vars */
import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../../../../redux/api/ProductApi";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import CheckoutSection from "./CheckoutSection";
import { useDispatch } from "react-redux";
import { addToCart, clearCart } from "../../../../redux/features/CartSlice";


const LandingPage = () => {
  const { productId } = useParams();
  const { data, isLoading, error } = useGetProductByIdQuery(productId);
  const product = data?.data;
  const dispatch = useDispatch();

  const [currentSlider, setCurrentSlider] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState(new Map());
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    if (product) {
      const initialPrice = product.price.discounted || product.price.regular;
      if (typeof initialPrice === 'number' && !isNaN(initialPrice)) {
        setCurrentPrice(initialPrice);
      } else {
        console.error('Invalid initial price:', initialPrice);
        setCurrentPrice(0);
      }
      setSelectedVariants(new Map());
      setCurrentImage(product.images[0]);
      dispatch(addToCart(product)); // Add product to cart on load
    }
    return () => {
      if (product) {
        dispatch(clearCart()); // Remove product from cart when leaving the page
      }
    };
  }, [product, dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Oops! There was an error loading the product: {error.message}</div>;
  }

  if (!product) {
    return <div className="text-red-500">Sorry, the product you are looking for was not found.</div>;
  }
  
  const carouselImages = product?.images;
  const prevSlider = () => {
    setCurrentSlider((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };

  const nextSlider = () => {
    setCurrentSlider((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  };

  const handleVariantSelect = (groupName, variant) => {
    const newSelectedVariants = new Map(selectedVariants);
    
    if (selectedVariants.get(groupName)?.value === variant.value) {
      newSelectedVariants.delete(groupName);
      let newPrice = product.price.discounted || product.price.regular;
      newSelectedVariants.forEach((selectedVariant) => {
        if (selectedVariant.price && selectedVariant.price > 0) {
          newPrice = selectedVariant.price; 
        }
      });
      setCurrentPrice(newPrice);
      const lastSelectedVariant = Array.from(newSelectedVariants.values()).pop();
      if (lastSelectedVariant?.image?.url) {
        setCurrentImage({
          url: lastSelectedVariant.image.url,
          alt: lastSelectedVariant.image.alt || product.images[0].alt
        });
      } else {
        setCurrentImage(product.images[0]);
      }
    } else {
      newSelectedVariants.set(groupName, {
        value: variant.value,
        price: variant.price,
        image: variant.image
      });
      const variantPrices = Array.from(newSelectedVariants.values())
        .map(v => v.price)
        .filter(price => typeof price === 'number' && !isNaN(price) && price > 0);
      if (variantPrices.length > 0) {
        const highestPrice = Math.max(...variantPrices);
        setCurrentPrice(highestPrice);
      } else {
        setCurrentPrice(product.price.discounted || product.price.regular);
      }
      if (variant.image?.url) {
        setCurrentImage({
          url: variant.image.url,
          alt: variant.image.alt || product.images[0].alt
        });
      }
    }
    setSelectedVariants(newSelectedVariants);
  };

  return (
    <div className="container mx-auto">
      <Helmet>
        <title>{product?.seo.metaTitle}</title>
        <meta name="description" content={product?.seo.metaDescription} />
        <meta name="slug" content={product?.seo.metaSlug} />
      </Helmet>
      <div className="grid grid-cols-2 h-[90vh]">
      <div className={`relative mt-6 overflow-hidden rounded-lg `}>
        {/* Carousel container */}
        <div
          className="flex transition-transform duration-500 ease-linear h-full"
          style={{ transform: `translateX(-${currentSlider * 100}%)` }}
        >
          {carouselImages?.map((slide, idx) => (
            <img
              key={idx}
              src={slide.url}
              className="min-w-full h-[90vh] object-cover"
              alt={slide.alt}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevSlider}
          className={`absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-black/30 text-white p-1 sm:p-2 rounded-full hover:bg-black/50 transition text-sm sm:text-base`}
        >
          &#10094;
        </button>
        <button
          onClick={nextSlider}
          className={`absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-black/30 text-white p-1 sm:p-2 rounded-full hover:bg-black/50 transition text-sm sm:text-base`}
        >
          &#10095;
        </button>

        {/* Indicators */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2">
          {carouselImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlider(idx)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                currentSlider === idx 
                  ? "bg-white w-4 sm:w-8"
                  : "bg-white/50"
              }`}
            ></button>
          ))}
        </div>
      </div>
      <div className=" mt-6 rounded-lg">
        <div className="p-5">
        <h1 className="text-5xl font-bold">{product?.basicInfo.title}</h1>
        <h1 className="text-3xl font-bold py-5 mt-10 text-gray-800">বিস্তারিত বিবরণ</h1>
        <p className="text-2xl text-gray-500 my-2 text-justify">{product?.basicInfo.description}</p>
        </div>
        
        {/* Variant Selection */}
        {product.variants && product.variants.length > 0 && (
          <div className="p-5">
            <h2 className="text-2xl font-bold">Select Variants:</h2>
            <div className="grid grid-cols-2 gap-2">
              {product.variants.map((variantGroup) => (
                <div key={variantGroup.group} className="space-y-3">
                  <h3 className="font-medium text-gray-700">{variantGroup.group}</h3>
                  <div className="flex flex-wrap gap-2">
                    {variantGroup.items.map((variant) => (
                      <button
                        key={variant.value}
                        onClick={() => handleVariantSelect(variantGroup.group, variant)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          selectedVariants.get(variantGroup.group)?.value === variant.value
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {variant.value}
                        {variant.price > 0 && (
                          <span className={`ml-1 text-sm ${
                            selectedVariants.get(variantGroup.group)?.value === variant.value
                              ? 'text-blue-200'
                              : 'text-gray-500'
                          }`}>
                            +৳{variant.price}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Display Selected Variant Group */}
        {selectedVariants.size > 0 && (
          <div className="p-5">
            <h3 className="text-xl font-bold">Selected Variant: {Array.from(selectedVariants.keys()).join(', ')}</h3>
            <p className="text-sm text-gray-600 mt-1 animate-pulse">{Array.from(selectedVariants.values()).map(v => v.value).join(', ')}</p>
          </div>
        )}
        <div className="p-5">
          <div className="flex gap-10 justify-center items-center bg-green-100 p-5 rounded-lg shadow-lg border border-gray-300">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">দাম মাত্র</h1>
            <div className="flex items-center justify-center">
              <span className="text-green-700 text-3xl font-extrabold flex items-center justify-center gap-2">{currentPrice} <span className="text-gray-500 text-lg">টাকা</span></span>
              <span className="text-lg line-through ml-4 text-red-500 font-bold flex items-center justify-center gap-2">{product?.price.regular} </span>
            </div>
            <p className="text-sm text-gray-600 mt-1 animate-pulse">Limited time offer!</p>
          </div>
        </div>
          <div className="p-5">
            <h1 className="text-3xl font-bold py-5 text-gray-800 text-center bg-green-100 p-5 rounded-lg shadow-lg border border-gray-300 cursor-pointer">অর্ডার করতে এখানে ক্লিক করুন।</h1>
          </div>
          {/* Checkout Form */}
          <div className="p-5">
           
          </div>
      </div>
      </div>
      <div className="">
        <CheckoutSection
          product={product}
          selectedVariants={selectedVariants}
          currentPrice={currentPrice}
        />
      </div>
    </div>
  );
};

export default LandingPage;
