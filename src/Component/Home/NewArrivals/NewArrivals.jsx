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
      setProducts(data.data.slice(0, 6));
    }
  }, [data]);

  if (isLoading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <section className="container mx-auto px-4 py-8">
      <Title title="New Arrivals" className="mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FeaturedProduct />
        <ProductGrid products={products} />
      </div>
    </section>
  );
};

// Loading indicator component
const LoadingIndicator = () => (
  <div className="flex justify-center items-center h-48">
    <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Error message component
const ErrorMessage = ({ message }) => (
  <div className="text-center py-8 text-red-500">
    <p className="text-xl font-semibold">Error occurred!</p>
    <p className="mt-2">{message}</p>
  </div>
);

// Featured product component
const FeaturedProduct = () => (
  <div className="col-span-1 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg p-6 flex flex-col justify-between h-full">
    <div>
      <h2 className="text-3xl font-bold mb-2">MacBook Pro</h2>
      <p className="mb-4 text-lg">Unleash Your Creativity Anywhere</p>
    </div>
    <div className="w-full h-40 bg-gray-300 rounded-lg mb-4 overflow-hidden">
      <img
        src="/path-to-macbook-image.jpg"
        alt="MacBook Pro"
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
    <button className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold transition duration-300 ease-in-out hover:bg-blue-100 hover:text-blue-700">
      Starting at $1999
    </button>
  </div>
);

// Product grid component
const ProductGrid = ({ products }) => (
  <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
    {products.map((product) => (
      <ProductCard key={product._id} product={product} />
    ))}
  </div>
);

// Individual product card component
const ProductCard = ({ product }) => (
  <div className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-3 hover:shadow-lg transition duration-300 ease-in-out">
    <div className="w-20 h-fit bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden border-2 border-gray-300">
      {product.images && product.images.length > 0 && (
        <img 
          src={product.images[0]} 
          alt={product.title} 
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
    <div className="flex-grow border-2 border-gray-300">
      <h3 className="font-semibold text-base mb-1">{product.title}</h3>
      <RatingStars rating={product.rating} />
      <div className="mt-1">
        <span className="font-bold text-base">${product.price.toFixed(2)}</span>
        {product.discountPrice && (
          <span className="ml-2 text-xs text-gray-500 line-through">
            ${product.discountPrice.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  </div>
);

// Rating stars component
const RatingStars = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`w-3 h-3 ${
          i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ))}
    <span className="ml-1 text-xs text-gray-600">({rating.toFixed(1)})</span>
  </div>
);

export default NewArrivals;