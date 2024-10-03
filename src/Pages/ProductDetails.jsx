import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useGetProductByIdQuery } from '../redux/api/ProductApi';

const ProductDetails = () => {
  const { productId } = useParams();
  const { data: productResponse, isLoading, isError } = useGetProductByIdQuery(productId);
  const product = productResponse?.data;

  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setSelectedImage(product.images[0].url);
    }
  }, [product]);

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (isError) return <div className="flex justify-center items-center h-screen">Error loading product details</div>;
  if (!product) return <div className="flex justify-center items-center h-screen">Product not found</div>;

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column - Images */}
        <div className="md:w-1/2">
          {selectedImage && <img src={selectedImage} alt={product.title} className="w-full h-auto max-h-[450px] object-contain rounded-lg mb-4" />}
          <div className="flex gap-2 overflow-x-auto">
            {product.images && product.images.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={img.alt}
                className="w-20 h-20 object-contain rounded-md cursor-pointer"
                onClick={() => setSelectedImage(img.url)}
              />
            ))}
          </div>
        </div>

        {/* Right column - Product details */}
        <div className="md:w-1/2">
          <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
          
          <div className="mb-4">
            <p>Brand: {product.brand}</p>
            <p>Product Code: {product.productCode}</p>
            <p>Availability: {product.stockStatus}</p>
            <p className="text-xl font-bold text-red-600">
              Tk {product.price.discounted || product.price.regular}
            </p>
            {product.price.discounted && (
              <p className="text-sm text-gray-500">
                Regular Price: <span className="line-through">Tk {product.price.regular}</span>
                {' '}(Save: Tk {product.price.savings} - {product.price.savingsPercentage}%)
              </p>
            )}
            <p className="text-red-600 text-sm">* PLEASE CHECK THE PRODUCT INFRONT OF DELIVERY MAN</p>
            <p className="text-red-600 text-sm">* FREE SHIPPING with bKash Cashback T&C</p>
          </div>

          {product.variants && (
            <div className="mb-4">
              {product.variants.map((variant, index) => (
                <div key={index} className="mb-2">
                  <label className="block mb-1">{variant.name}:</label>
                  <select className="w-full p-2 border border-gray-300 rounded">
                    {variant.value.split(',').map((option, optionIndex) => (
                      <option key={optionIndex} value={option.trim()}>{option.trim()}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center mb-4">
            <button onClick={decrementQuantity} className="w-8 h-8 bg-gray-200 border border-gray-300">-</button>
            <input 
              type="text" 
              value={quantity} 
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-16 h-8 text-center border-t border-b border-gray-300"
            />
            <button onClick={incrementQuantity} className="w-8 h-8 bg-gray-200 border border-gray-300">+</button>
          </div>

          <button className="w-full bg-black text-white py-2 px-4 text-lg mb-2 flex items-center justify-center">
            <FaShoppingCart className="mr-2" />
            ADD TO CART
          </button>
          
          <button className="w-full border border-black py-2 px-4 text-lg flex items-center justify-center">
            <FaHeart className="mr-2" />
            Add to Wishlist
          </button>

          {/* Key Features */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-2">Key Features</h2>
            <ul className="list-disc list-inside">
              {product.keyFeatures.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          {/* Specifications */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Specifications</h2>
            {product.specifications.map((specGroup, groupIndex) => (
              <div key={groupIndex} className="mb-4">
                <h3 className="font-semibold mb-2">{specGroup.group}</h3>
                <table className="w-full border-collapse">
                  <tbody>
                    {specGroup.items.map((item, itemIndex) => (
                      <tr key={itemIndex} className={itemIndex % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                        <td className="border px-4 py-2 font-semibold">{item.name}</td>
                        <td className="border px-4 py-2">{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* Additional Information */}
          {product.additionalInfo && Object.keys(product.additionalInfo).length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Additional Information</h2>
              <table className="w-full border-collapse">
                <tbody>
                  {Object.entries(product.additionalInfo).map(([key, value], index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                      <td className="border px-4 py-2 font-semibold">{key}</td>
                      <td className="border px-4 py-2">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;