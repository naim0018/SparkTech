import { useState, useEffect } from 'react';
import { FaSnowflake, FaVideo, FaLaptop, FaKeyboard, FaTv, FaMobileAlt, FaHeadphones, FaBatteryFull, FaVrCardboard, FaStopwatch, FaCamera, FaHeadphonesAlt, FaEarlybirds, FaVolumeUp, FaGamepad } from 'react-icons/fa';
import { useGetAllProductsQuery } from '../../redux/api/ProductApi';

const iconMap = {
  'AC': FaSnowflake,
  'Gimbal': FaVideo,
  'Laptop': FaLaptop,
  'Laptop Accessories': FaKeyboard,
  'TV': FaTv,
  'Mobile Phone': FaMobileAlt,
  'Mobile Accessories': FaHeadphones,
  'Portable Power Station': FaBatteryFull,
  'VR (Virtual Reality)': FaVrCardboard,
  'Smart Watch': FaStopwatch,
  'Action Camera': FaCamera,
  'Ear Phone': FaHeadphonesAlt,
  'Earbuds': FaEarlybirds,
  'Bluetooth Speakers': FaVolumeUp,
  'Gaming Console': FaGamepad,
};

const CategoryCard = () => {
  const [categories, setCategories] = useState([]);
  const { data: productsData, isLoading, isError } = useGetAllProductsQuery();

  useEffect(() => {
    if (productsData?.data) {
      const uniqueCategories = [...new Set(productsData.data.map(product => product.category))];
      setCategories(uniqueCategories);
    }
  }, [productsData]);

  if (isLoading) return <div>Loading categories...</div>;
  if (isError) return <div>Error loading categories</div>;

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 space-y-1">
          <h2 className="text-3xl font-bold text-gray-800">Shop by Category</h2>
          <p className="text-gray-600">Explore a wide range of products from top brands and categories.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {categories.map((category, index) => {
            const Icon = iconMap[category] || FaGamepad; // Default to FaGamepad if no matching icon
            return (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer"
              >
                <div className="p-6 flex flex-col items-center h-full">
                  <div className="text-4xl mb-4 text-[#222934]">
                    <Icon />
                  </div>
                  <p className="text-sm font-medium text-gray-700 text-center flex-grow h-12 flex items-center">
                    {category}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;