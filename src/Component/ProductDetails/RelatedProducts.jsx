/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import Title from '../../UI/Title';
import { useGetAllProductsQuery } from '../../redux/api/ProductApi';

const RelatedProducts = ({ category, currentProductId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { data: productsData, isLoading, isError } = useGetAllProductsQuery();

  useEffect(() => {
    if (productsData && productsData.data) {
      const filtered = productsData.data
        .filter(product => product.category === category && product._id !== currentProductId)
        .slice(0, 4);
      setRelatedProducts(filtered);
    }
  }, [productsData, category, currentProductId]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading related products</div>;

  return (
    <div>
      <Title title="Related Products" />
      <div className="flex flex-col gap-4">
        {relatedProducts.map((product) => (
          <a href={`/product/${product._id}`} key={product._id} className="border rounded-lg overflow-hidden shadow-md flex hover:shadow-lg transition-shadow">
            <img 
              src={product.images[0].url} 
              alt={product.title} 
              className="w-24 h-24 object-contain p-1"
            />
            <div className="p-2 flex-1 text-sm">
              <h3 className="font-semibold mb-1 text-gray-800">{product.title}</h3>
              <p className="text-gray-600 mb-1">{product.brand}</p>
              <p className="font-bold">
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
