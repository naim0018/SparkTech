import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaExclamationTriangle, FaSearch } from 'react-icons/fa';
import { useGetProductByIdQuery } from '../../redux/api/ProductApi';
import RelatedProducts from './RelatedProducts';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/features/CartSlice';
import { addToWishlist, removeFromWishlist } from '../../redux/features/wishlistSlice';
import { toast } from 'react-toastify';
import { useTheme } from '../../ThemeContext';
import ProductImages from './ProductImages';
import { Helmet } from 'react-helmet';

const ProductView = () => {
  const { productId } = useParams();
  const { data: productResponse, isLoading, isError } = useGetProductByIdQuery(productId);
  const product = productResponse?.data;
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState(new Map());
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentImage, setCurrentImage] = useState(null);
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const wishlistItems = useSelector(state => state.wishlist.wishlistItems);
  const isInWishlist = wishlistItems?.some(item => item._id === product?._id);

  // Initialize price and reset variants when product changes
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
    }
  }, [product]);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!product) return <NotFoundState />;

  const handleVariantSelect = (groupName, variant) => {
    const newSelectedVariants = new Map(selectedVariants);
    console.log({newSelectedVariants});
    
    if (selectedVariants.get(groupName)?.value === variant.value) {
      // Deselect variant
      newSelectedVariants.delete(groupName);
      
      // Calculate new price based on remaining selected variants
      let newPrice = product.price.discounted || product.price.regular;
      newSelectedVariants.forEach((selectedVariant) => {
        if (selectedVariant.price && selectedVariant.price > 0) {
          newPrice = selectedVariant.price; 
        }
      });
      
      setCurrentPrice(newPrice);
      
      // Update image based on remaining variants or reset to default
      const lastSelectedVariant = Array.from(newSelectedVariants.values()).pop();
      console.log({lastSelectedVariant});
      
      if (lastSelectedVariant?.image?.url) {
        setCurrentImage({
          url: lastSelectedVariant.image.url,
          alt: lastSelectedVariant.image.alt || product.images[0].alt
        });
      } else {
        setCurrentImage(product.images[0]);
      }
    } else {
      // Select new variant
      newSelectedVariants.set(groupName, {
        value: variant.value,
        price: variant.price,
        image: variant.image
      });
      
      // Get all selected variant prices (excluding 0 prices)
      const variantPrices = Array.from(newSelectedVariants.values())
        .map(v => v.price)
        .filter(price => typeof price === 'number' && !isNaN(price) && price > 0);

      // If we have valid variant prices, use the highest one
      if (variantPrices.length > 0) {
        const highestPrice = Math.max(...variantPrices);
        console.log({highestPrice});
        setCurrentPrice(highestPrice);
      } else {
        // If no valid variant prices, use base product price
        setCurrentPrice(product.price.discounted || product.price.regular);
        console.log({currentPrice});
      }

      // Update image if variant has specific image
      if (variant.image?.url) {
        setCurrentImage({
          url: variant.image.url,
          alt: variant.image.alt || product.images[0].alt
        });
      }
    }
    
    setSelectedVariants(newSelectedVariants);
  };

  const handleAddToCart = () => {
    if (typeof currentPrice !== 'number' || isNaN(currentPrice)) {
      toast.error('Invalid price. Please try again.');
      return;
    }

    // Convert selected variants Map to array
    const selectedVariantsArray = Array.from(selectedVariants, ([group, variant]) => ({
      group,
      value: variant.value,
      price: variant.price,
      image: variant.image
    }));
    
    dispatch(addToCart({
      id: product._id,
      name: product.basicInfo.title,
      price: currentPrice,
      image: currentImage.url,
      quantity,
      selectedVariants: selectedVariantsArray // Send all selected variants
    }));
    toast.success('Product added to cart!');
  };

  const handleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
      toast.info('Removed from wishlist!');
    } else {
      dispatch(addToWishlist({
        _id: product._id,
        title: product.basicInfo.title,
        price: currentPrice,
        image: currentImage.url
      }));
      toast.success('Added to wishlist!');
    }
  };
  console.log(product);
  return (
    <>
      <Helmet>
        <title>{product.basicInfo.title} | BestBuy4uBD</title>
        <meta name="description" content={product.basicInfo.description.substring(0, 160)} />
        <meta name="keywords" content={`${product.basicInfo.category}, ${product.basicInfo.brand}, ${product?.tag}`} />
      </Helmet>
      <div className={`min-h-screen py-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <ProductImages images={product.images} currentImage={currentImage} />

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">{product.basicInfo.title}</h1>
                <p className="text-gray-500">{product.basicInfo.brand}</p>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold">
                  Tk {typeof currentPrice === 'number' ? currentPrice.toFixed(2) : '0.00'}
                </span>
                {product.price.regular !== product.price.discounted && (
                  <span className="text-xl text-gray-500 line-through">
                    Tk {product.price.regular.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Variants */}
              {product.variants?.map((variantGroup, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-medium">{variantGroup.group}</h3>
                  <div className="flex flex-wrap gap-2">
                    {variantGroup.items.map((variant, vIndex) => (
                      <button
                        key={vIndex}
                        onClick={() => handleVariantSelect(variantGroup.group, variant)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          selectedVariants.get(variantGroup.group)?.value === variant.value
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
                        }`}
                      >
                        {variant.value}  {variant.price ? `- Tk ${variant.price}` : ''}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Quantity and Actions */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="font-medium">Quantity:</label>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-x">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <FaShoppingCart className="inline-block mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleWishlist}
                    className={`p-3 rounded-lg transition-colors ${
                      isInWishlist
                        ? 'bg-red-100 text-red-500 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <FaHeart />
                  </button>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <h3 className="font-medium">Product Details</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {product.basicInfo.description}
                </p>
                
                {product.basicInfo.keyFeatures?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Key Features</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {product.basicInfo.keyFeatures.map((feature, index) => (
                        <li key={index} className="text-gray-600 dark:text-gray-300">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Specifications and Additional Info */}
          {product.specifications?.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-4">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {product.specifications.map((specGroup, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="font-medium">{specGroup.group}</h3>
                    <div className="space-y-2">
                      {specGroup.items.map((spec, sIndex) => (
                        <div key={sIndex} className="flex justify-between py-2 border-b">
                          <span className="text-gray-600 dark:text-gray-400">{spec.name}</span>
                          <span>{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Products */}
          {product.relatedProducts?.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-6">Related Products</h2>
              <RelatedProducts relatedProducts={product.relatedProducts} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const LoadingState = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 lg:h-32 lg:w-32 border-t-4 border-b-4 border-blue-500"></div>
  </div>
);

const ErrorState = () => (
  <div className="flex flex-col items-center justify-center h-screen space-y-2 sm:space-y-4">
    <FaExclamationTriangle className="text-4xl sm:text-5xl lg:text-6xl text-red-500" />
    <p className="text-base sm:text-lg lg:text-xl font-medium text-gray-700 dark:text-gray-300">Error loading product details</p>
  </div>
);

const NotFoundState = () => (
  <div className="flex flex-col items-center justify-center h-screen space-y-2 sm:space-y-4">
    <FaSearch className="text-4xl sm:text-5xl lg:text-6xl text-gray-400" />
    <p className="text-base sm:text-lg lg:text-xl font-medium text-gray-700 dark:text-gray-300">Product not found</p>
  </div>
);

export default ProductView;
