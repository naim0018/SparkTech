import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaChevronDown } from 'react-icons/fa';
import { useGetAllProductsQuery } from '../../redux/api/ProductApi';

const AllProducts = () => {
  const [currentPage] = useState(1);
  const [productsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState('default');

  const { data: productsData, isLoading, isError } = useGetAllProductsQuery();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (productsData?.data) {
      let sorted = [...productsData.data];
      if (sortBy === 'price-low-high') {
        sorted.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high-low') {
        sorted.sort((a, b) => b.price - a.price);
      }
      setFilteredProducts(sorted);
    }
  }, [productsData, sortBy]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading products</div>;
  console.log(filteredProducts[1]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Products</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="mr-2">Show:</span>
            <button className="border px-2 py-1 rounded flex items-center">
              {productsPerPage} <FaChevronDown className="ml-1" size={16} />
            </button>
          </div>
          <div className="flex items-center">
            <span className="mr-2">Sort By:</span>
            <select
              className="border px-2 py-1 rounded"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentProducts.map((product) => (
          <div key={product._id} className="border rounded-lg p-4 flex flex-col h-full hover:shadow-lg transition-shadow duration-300 group">
            <div className="relative mb-4 overflow-hidden">
              <img 
                src={product.images[0]} 
                alt={product.title} 
                className="w-full h-48 object-cover rounded transition-transform duration-300 transform group-hover:scale-110" 
              />
              {product.isFeatured && (
                <div className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
                  Featured
                </div>
              )}
              {product.discountPrice && (
                <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                  Save: ${(product.price - product.discountPrice).toFixed(2)}
                </div>
              )}
            </div>
            <h2 className="font-bold mb-2">{product.title}</h2>
            <div className="flex-grow flex flex-col">
              <p className="text-sm text-gray-600 mb-4 h-20 overflow-hidden">
                {product.description ? product.description : 'No description available.'}
              </p>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar key={star} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded flex-grow">Buy Now</button>
              <Link to={`/product/${product._id}`} className="bg-gray-200 text-gray-800 px-4 py-2 rounded">View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
