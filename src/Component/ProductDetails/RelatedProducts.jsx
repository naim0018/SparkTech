/* eslint-disable react/prop-types */
import Title from '../../UI/Title';
import { useTheme } from '../../ThemeContext';
import { TbCurrencyTaka } from 'react-icons/tb';
import { Link } from 'react-router-dom';

const RelatedProducts = ({ relatedProducts }) => {
    const { isDarkMode } = useTheme();
  return (
    <div className={isDarkMode ? 'bg-gray-900' : 'bg-white'}>
      <Title title="Related Products" />
      <div className="flex flex-col gap-4">
        {relatedProducts.map((product) => (
          <Link 
            key={product._id}
            to={`/product/${product._id}`}
            className={`border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} rounded-lg overflow-hidden shadow-md flex hover:shadow-lg transition-shadow`}
          >
            <div className="w-24 h-24 flex-shrink-0">
              <img 
                src={product?.images?.[0]?.url}
                alt={product?.images?.[0]?.alt}
                className="w-full h-full object-contain p-1"
              />
            </div>

            <div className="p-2 flex-1 text-sm">
              <h3 className={`font-semibold mb-1 line-clamp-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {product.basicInfo.title}
              </h3>

              <div className="flex flex-col gap-1">
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {product.basicInfo.category}
                </p>

                <div className={`font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} flex items-center`}>
                  <TbCurrencyTaka className="mr-1" />
                  {product.price.discounted}
                  {product.price.discounted < product.price.regular && (
                    <span className="ml-2 text-xs text-green-500">
                      {Math.round(((product.price.regular - product.price.discounted) / product.price.regular) * 100)}% off
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="text-gray-500">
                    {product.basicInfo.subcategory}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
