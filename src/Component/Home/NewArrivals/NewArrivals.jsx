/* eslint-disable react/prop-types */
import { useGetAllProductsQuery } from "../../../redux/api/ProductApi";
import { FaStar } from "react-icons/fa";
import Title from "../../../UI/Title";
import { useState, useEffect } from "react";

// Component to display new arrivals section
const NewArrivals = () => {
  const { data, isLoading, error } = useGetAllProductsQuery({});
  const [products, setProducts] = useState([]);

  // Update products when data changes
  useEffect(() => {
    if (data?.data) {
      setProducts(data.data.slice(0, 4)); // Limit to 4 products for better responsiveness
    }
  }, [data]);

  if (isLoading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error.message} />;

  // Check if products array is empty
  if (products.length === 0) {
    return <ErrorMessage message="No products available at the moment." />;
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <Title title="New Arrivals" className="mb-6 text-center" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="md:col-span-2 lg:col-span-1">
          <FeaturedProduct />
        </div>
        <div className="md:col-span-2">
          <ProductGrid products={products} />
        </div>
      </div>
    </section>
  );
};

// Loading indicator component
const LoadingIndicator = () => (
  <div className="flex justify-center items-center h-48">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Error message component
const ErrorMessage = ({ message }) => (
  <div className="text-center py-8 text-red-500">
    <p className="text-base font-semibold">Error occurred!</p>
    <p className="mt-2 text-sm">{message}</p>
  </div>
);

// Featured product component
const FeaturedProduct = () => (
  <div className="w-full h-64 md:h-full">
    <img
      src="https://i.imgur.com/vZLZS8L.png"
      alt="Featured Product"
      className="w-full h-full object-cover rounded-lg"
      loading="lazy"
      decoding="async"
    />  
  </div>
);

// Product grid component
const ProductGrid = ({ products }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {products.map((product) => (
      <ProductCard key={product._id} product={product} />
    ))}
  </div>
);

// Individual product card component
const ProductCard = ({ product }) => (
  <div className="bg-white rounded-lg shadow-md p-3 flex items-start space-x-2 hover:shadow-lg transition duration-300 ease-in-out">
    <div className="w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden">
      {product.images && product.images.length > 0 && (
        <img
          src={product.images[0].url}
          alt={product.images[0].alt}
          className="w-full h-full object-contain"
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
    <div className="flex-grow">
      <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.title}</h3>
      {
        product?.rating && <RatingStars rating={product.rating.average} count={product.rating.count} />
      }
      <div className="mt-1 flex flex-wrap items-center">
        <span className="font-bold text-sm">
          ${product.price?.discounted || product.price?.regular || 'N/A'}
        </span>
        {product.price?.discounted && product.price?.regular && (
          <span className="ml-2 text-xs text-gray-500 line-through">
            ${product.price.regular}
          </span>
        )}
      </div>
    </div>
  </div>
);

// Rating stars component
const RatingStars = ({ rating, count }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`w-3 h-3 ${
          i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ))}
    <span className="ml-1 text-xs text-gray-600">
      {rating ? `(${rating.toFixed(1)})` : ''} {count} reviews
    </span>
  </div>
);

export default NewArrivals;
