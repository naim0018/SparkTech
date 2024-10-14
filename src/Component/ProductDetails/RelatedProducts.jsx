/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import Title from '../../UI/Title';
import { useGetAllProductsQuery } from '../../redux/api/ProductApi';
import { useTheme } from '../../ThemeContext'; // Import useTheme hook

const RelatedProducts = ({ category, currentProductId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { data: productsData, isLoading, isError } = useGetAllProductsQuery();
  const { isDarkMode } = useTheme(); // Use the useTheme hook

  useEffect(() => {
    if (productsData && productsData.data) {
      const filtered = productsData.data
        .filter(product => product.category === category && product._id !== currentProductId)
        .slice(0, 4);
      setRelatedProducts(filtered);
    }
  }, [productsData, category, currentProductId]);

  if (isLoading) return <div className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>Loading...</div>;
  if (isError) return <div className={isDarkMode ? 'text-red-400' : 'text-red-600'}>Error loading related products</div>;

  return (
    <div className={isDarkMode ? 'bg-gray-900' : 'bg-white'}>
      <Title title="Related Products" />
      <div className="flex flex-col gap-4">
        {relatedProducts.map((product) => (
          <a href={`/product/${product._id}`} key={product._id} className={`border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} rounded-lg overflow-hidden shadow-md flex hover:shadow-lg transition-shadow`}>
            <img 
              src={product.images[0].url} 
              alt={product.title} 
              className="w-24 h-24 object-contain p-1"
            />
            <div className="p-2 flex-1 text-sm">
              <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{product.title}</h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{product.brand}</p>
              <p className={`font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                ${product.price.discounted || product.price.regular}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
