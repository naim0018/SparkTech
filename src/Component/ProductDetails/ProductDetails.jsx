// Import necessary dependencies and components
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaStar } from 'react-icons/fa';
import { useGetProductByIdQuery } from '../../redux/api/ProductApi';
import RelatedProducts from './RelatedProducts';

// Define the ProductDetails component
const ProductDetails = () => {
  // Extract productId from URL parameters
  const { productId } = useParams();
  
  // Fetch product data using the API hook
  const { data: productResponse, isLoading, isError } = useGetProductByIdQuery(productId);
  const product = productResponse?.data;

  // State for selected image and quantity
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Set the initial selected image when product data is loaded
  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setSelectedImage(product.images[0].url);
    }
  }, [product]);

  // Loading and error states
  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (isError) return <div className="flex justify-center items-center h-screen">Error loading product details</div>;
  if (!product) return <div className="flex justify-center items-center h-screen">Product not found</div>;

  // Functions to handle quantity changes
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  // Render the component
  return (
    <div className="bg-gray-200 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col xl:flex-row gap-12">
            {/* Left column - Images */}
            <div className="xl:w-3/5">
              {selectedImage && (
                <img 
                  src={selectedImage} 
                  alt={product.title} 
                  className="w-full h-[500px] object-contain rounded-lg mb-6"
                />
              )}
              <div className="flex gap-4 overflow-x-auto">
                {product.images && product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img.url}
                    alt={img.alt}
                    className="w-24 h-24 object-contain rounded-md cursor-pointer  hover:border-blue-500 transition"
                    onClick={() => setSelectedImage(img.url)}
                  />
                ))}
              </div>
            </div>

            {/* Right column - Product details */}
            <div className="xl:w-2/5">
              <h1 className="text-3xl font-bold mb-4 text-gray-800">{product.title}</h1>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-xl" />
                  ))}
                </div>
                <span className="text-gray-600 text-base">(50 reviews)</span>
              </div>

              {/* Product information */}
              <div className="mb-6 text-gray-700 text-base">
                <p className="mb-2"><span className="font-semibold">Brand:</span> {product.brand}</p>
                <p className="mb-2"><span className="font-semibold">Product Code:</span> {product.productCode}</p>
                <p><span className="font-semibold">Availability:</span> {product.stockStatus}</p>
              </div>

              {/* Price information */}
              <div className="mb-6">
                <p className="text-3xl font-bold text-blue-600 mb-2">
                  Tk {product.price.discounted || product.price.regular}
                </p>
                {product.price.discounted && (
                  <p className="text-base text-gray-500">
                    Regular Price: <span className="line-through">Tk {product.price.regular}</span>
                    {' '}(Save: Tk {product.price.savings} - {product.price.savingsPercentage}%)
                  </p>
                )}
              </div>

              {/* Key Features */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-gray-800">Key Features</h2>
                <ul className="list-disc list-inside text-gray-700 text-base">
                  {product.keyFeatures.map((feature, index) => (
                    <li key={index} className="mb-1">{feature}</li>
                  ))}
                </ul>
              </div>

              {/* Product variants */}
              {product.variants && (
                <div className="mb-6">
                  {product.variants.map((variant, index) => (
                    <div key={index} className="mb-3">
                      <label className="block mb-1 font-semibold text-gray-700 text-base">{variant.name}:</label>
                      <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base">
                        {variant.value.split(',').map((option, optionIndex) => (
                          <option key={optionIndex} value={option.trim()}>{option.trim()}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity selector */}
              <div className="flex items-center mb-6">
                <button onClick={decrementQuantity} className="w-10 h-10 bg-gray-200 text-gray-600 rounded-l-md hover:bg-gray-300 transition text-xl">-</button>
                <input 
                  type="text" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-16 h-10 text-center border-t border-b border-gray-300 text-base"
                />
                <button onClick={incrementQuantity} className="w-10 h-10 bg-gray-200 text-gray-600 rounded-r-md hover:bg-gray-300 transition text-xl">+</button>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 mb-6">
                <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md text-base font-semibold hover:bg-blue-700 transition flex items-center justify-center">
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </button>
                <button className="flex-1 border border-blue-600 text-blue-600 py-3 px-4 rounded-md text-base font-semibold hover:bg-blue-50 transition flex items-center justify-center">
                  <FaHeart className="mr-2" />
                  Wishlist
                </button>
              </div>

              {/* Additional information */}
              <p className="text-red-600 text-sm mb-1">* PLEASE CHECK THE PRODUCT IN FRONT OF THE DELIVERY PERSON</p>
              <p className="text-blue-600 text-sm">* FREE SHIPPING with bKash Cashback T&C</p>
            </div>
          </div>
        </div>

        {/* Specifications and Additional Information */}
        {/* Specifications and Additional Information Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-3/4">
              {/* Specifications */}
              <h2 className="text-2xl font-bold mb-4 text-gray-800 leading-tight">
                Specifications
              </h2>
              {product.specifications.map((specGroup, groupIndex) => (
                <div key={groupIndex} className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-700 leading-tight">
                    {specGroup.group}
                  </h3>
                  <div className="bg-gray-100 rounded-md overflow-hidden">
                    {specGroup.items.map((item, itemIndex) => (
                      <div key={itemIndex} className={`flex ${itemIndex % 2 === 0 ? 'bg-gray-50' : ''}`}>
                        <div className="w-1/3 p-3 font-semibold text-gray-700 border-r border-gray-200 text-sm">
                          {item.name}
                        </div>
                        <div className="w-2/3 p-3 text-gray-600 text-sm">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Additional Information */}
              {product.additionalInfo && Object.keys(product.additionalInfo).length > 0 && (
                <>
                  <h2 className="text-2xl font-bold mb-4 mt-8 text-gray-800 leading-tight">
                    Additional Information
                  </h2>
                  <div className="bg-gray-100 rounded-md overflow-hidden">
                    {Object.entries(product.additionalInfo).map(([key, value], index) => (
                      <div key={index} className={`flex ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                        <div className="w-1/3 p-3 font-semibold text-gray-700 border-r border-gray-200 text-sm">
                          {key}
                        </div>
                        <div className="w-2/3 p-3 text-gray-600 text-sm">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {/* Related Products */}
            <div className="lg:w-1/4">
              <RelatedProducts category={product.category} currentProductId={product._id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;