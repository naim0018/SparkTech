/* eslint-disable react/prop-types */
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product image and discount badge */}
      <div className="relative">
        <img 
          src={product.images[0].url} 
          alt={product.images[0].alt} 
          className="w-full h-48 object-contain mt-2"
        />
        {product.price.discounted && product.price.savingsPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Save {product.price.savingsPercentage.toFixed(2)}%
          </div>
        )}
      </div>
      {/* Product details */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2 truncate">{product.title}</h2>
        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
        {/* Product rating */}
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400 mr-1">
            {[...Array(Math.floor(product.rating.average))].map((_, i) => (
              <FaStar key={i} className="w-4 h-4" />
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.rating.count})</span>
        </div>
        {/* Product price and stock status */}
        <div className="flex items-center justify-between mb-2">
          <div>
            {product.price.discounted ? (
              <>
                <span className="text-lg font-bold text-red-600">${product.price.discounted.toFixed(2)}</span>
                <span className="text-sm text-gray-500 line-through ml-2">${product.price.regular.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-lg font-bold">${product.price.regular.toFixed(2)}</span>
            )}
          </div>
          <span className={`text-sm font-semibold ${product.stockStatus === 'In Stock' ? 'text-green-600' : 'text-red-600'}`}>
            {product.stockStatus}
          </span>
        </div>
        {/* Action buttons */}
        <div className="flex space-x-2">
          <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition flex items-center justify-center">
            <FaShoppingCart className="mr-2" />
            Add to Cart
          </button>
          <button className="bg-gray-200 text-gray-800 px-3 py-2 rounded-md hover:bg-gray-300 transition">
            <FaHeart />
          </button>
        </div>
      </div>
      {/* View details link */}
      <Link to={`/product/${product._id}`} className="block text-center bg-gray-100 text-blue-600 py-2 font-semibold hover:bg-gray-200 transition">
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;

