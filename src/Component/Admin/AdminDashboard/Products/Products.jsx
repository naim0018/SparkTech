/**
 * Products component for managing product listings in the admin dashboard
 * 
 * This component provides functionality for:
 * - Displaying a list of products
 * - Pagination
 * - Adding new products
 * - Updating existing products
 * - Deleting products
 * - Filtering products by category, price, stock, and brand
 * 
 * It uses RTK Query for data fetching and mutation, and React state for local UI management.
 */

// Import necessary dependencies and components
import { useState, useEffect } from 'react';
import { useGetAllProductsQuery, useDeleteProductMutation } from '../../../../redux/api/ProductApi';
import { toast } from 'react-toastify';
import UpdateProducts from '../UpdateProducts';
import ProductTable from './ProductTable';
import FilterOptions from './FilterOptions';
import { Link } from 'react-router-dom';

const Products = () => {
  // State for query options, used for pagination and filtering
  const [queryOptions, setQueryOptions] = useState({
    page: 1,
    limit: 10,
    sort: '-createdAt',
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    stockStatus: '',
  });

  // State for storing all categories and brands
  const [allCategories, setAllCategories] = useState([]);
  const [allBrands, setAllBrands] = useState([]);

  // Fetch products data based on query options
  const { data, isLoading, isFetching } = useGetAllProductsQuery(queryOptions);
  
  // Mutation hook for deleting products
  const [deleteProduct] = useDeleteProductMutation();

  // State for managing the update modal
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Effect to update all categories and brands when data changes
  useEffect(() => {
    if (data?.data?.data) {
      setAllCategories([...new Set(data.data.data.map(product => product.category))]);
      setAllBrands([...new Set(data.data.data.map(product => product.brand))]);
    }
  }, [data]);

  // Handler for pagination
  const handlePageChange = (newPage) => {
    setQueryOptions(prev => ({ ...prev, page: newPage }));
  };

  // Handler for filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setQueryOptions(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  // Handlers for update modal
  const openUpdateModal = (product) => {
    setSelectedProduct(product);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedProduct(null);
  };

  // Handler for deleting a product
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        toast.success('Product deleted successfully');
      } catch {
        toast.error('Failed to delete product');
      }
    }
  };

  // Show loading state while fetching initial data
  if (isLoading) return <div className="flex justify-center items-center h-screen dark:text-gray-200">Loading...</div>;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8 overflow-x-hidden">
      <div className="max-w-full mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 dark:text-gray-200 text-center">Product Management</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex justify-end mb-6">
            <Link to="/admin/add-product" className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
              Add New Product
            </Link>
          </div>
          <FilterOptions
            filterOptions={queryOptions}
            handleFilterChange={handleFilterChange}
            categories={allCategories}
            brands={allBrands}
          />
        </div>

        <div className="overflow-x-auto">
          <ProductTable 
            products={data?.data?.data || []}
            currentPage={queryOptions.page}
            totalPages={data?.data?.meta?.totalPages || 1}
            onPageChange={handlePageChange}
            openUpdateModal={openUpdateModal}
            handleDelete={handleDelete}
            isLoading={isFetching}
          />
        </div>
      </div>

      {isUpdateModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative mx-auto p-4 sm:p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800">  
            <UpdateProducts product={selectedProduct} closeModal={closeUpdateModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
