/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import Title from '../../UI/Title';
import { useGetAllProductsQuery } from '../../redux/api/ProductApi';
import { useTheme } from '../../ThemeContext';
import { TbCurrencyTaka } from 'react-icons/tb';
import { Link } from 'react-router-dom';

const RelatedProducts = ({ subcategory, currentProductId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { data: productsData, isLoading, isError } = useGetAllProductsQuery();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (productsData && productsData.data) {
      const filtered = productsData.data
        .filter(product => 
          product.basicInfo.subcategory === subcategory && 
          product._id !== currentProductId
        )
        .slice(0, 4);
      setRelatedProducts(filtered);
    }
  }, [productsData, subcategory, currentProductId]);

  if (isLoading) return null;
  if (isError) return null;

  if (relatedProducts.length === 0) return null;

  return (
    <div className={isDarkMode ? 'bg-gray-900' : 'bg-white'}>
      <Title title="Related Products" />
      <div className="flex flex-col gap-4">
        {relatedProducts.map((product) => (
          <Link to={`/product/${product._id}`} key={product._id} className={`border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} rounded-lg overflow-hidden shadow-md flex hover:shadow-lg transition-shadow`}>
            <img 
              src={product.images[0].url} 
              alt={product.images[0].alt} 
              className="w-24 h-24 object-contain p-1"
            />
            <div className="p-2 flex-1 text-sm">
              <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{product.basicInfo.title}</h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{product.basicInfo.brand}</p>
              <p className={`font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} flex items-center`}>
                <TbCurrencyTaka className="mr-1" />
                {product.price.discounted || product.price.regular}
              </p>
              {product.stockStatus && (
                <p className={`text-xs ${product.stockStatus === 'In Stock' ? 'text-green-500' : 'text-red-500'}`}>
                  {product.stockStatus}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
