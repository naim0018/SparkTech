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
      <Title title="New Arrivals" className="mb-6 text-center lg:text-left" />
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3">
          <FeaturedProduct />
        </div>
        <div className="w-full lg:w-2/3">
          <ProductGrid products={products} />
        </div>
      </div>
    </section>
  );
};

// Loading indicator component
const LoadingIndicator = () => (
  <div className="flex justify-center items-center h-48">
    <div className="animate-spin rounded-full h-16 w-16 md:h-24 md:w-24 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Error message component
const ErrorMessage = ({ message }) => (
  <div className="text-center py-8 text-red-500">
    <p className="text-lg md:text-xl font-semibold">Error occurred!</p>
    <p className="mt-2 text-sm md:text-base">{message}</p>
  </div>
);

// Featured product component
const FeaturedProduct = () => (
  <div className="w-full h-64 md:h-full">
    <img
      src="https://i.imgur.com/vZLZS8L.png"
      alt="Featured Product"
      className="w-full h-full object-contain rounded-lg"
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
  <div className="bg-white h-fit rounded-lg shadow-md p-3 md:p-4 flex items-start space-x-2 md:space-x-3 hover:shadow-lg transition duration-300 ease-in-out">
    <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg flex-shrink-0 overflow-hidden">
      {product.images && product.images.length > 0 && (
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-contain"
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
    <div className="flex-grow">
      <h3 className="font-semibold text-sm md:text-base mb-1 line-clamp-2">{product.title}</h3>
      <RatingStars rating={product.rating} />
      <div className="mt-1 flex flex-wrap items-center">
        <span className="font-bold text-sm md:text-base">${product.price.toFixed(2)}</span>
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
