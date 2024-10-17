// Import necessary dependencies and components
import  { useState } from 'react';
import { useGetAllProductsQuery, useDeleteProductMutation } from '../../../../redux/api/ProductApi';
import { toast } from 'react-toastify';
import UpdateProducts from '../UpdateProducts';

import FilterOptions from '../../../Shop/FilterOptions';
import ProductTable from './ProductTable';
import { Link, useLocation } from 'react-router-dom';
import SearchAndAddProduct from './SearchAndAddProduct';

const Products = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [queryOptions, setQueryOptions] = useState({
    search: searchParams.get('search') || '',
    page: 1,
    limit: 10,
    sort: '-createdAt',
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
  });

  const { data, isLoading, isFetching } = useGetAllProductsQuery(queryOptions);
  const [deleteProduct] = useDeleteProductMutation();

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // useEffect(() => {
  //   setQueryOptions(prev => ({
  //     ...prev,
  //     search: searchParams.get('search') || '',
  //   }));
  // }, [location.search]);

  const handleSearch = (searchTerm) => {
    setQueryOptions(prev => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setQueryOptions(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setQueryOptions(prev => ({ ...prev, page: newPage }));
  };

  const openUpdateModal = (product) => {
    setSelectedProduct(product);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedProduct(null);
  };

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

  if (isLoading) return <div className="flex justify-center items-center h-screen dark:text-gray-200">Loading...</div>;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8 overflow-x-hidden">
      <div className="max-w-full mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 dark:text-gray-200 text-center">Product Management</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <SearchAndAddProduct handleSearch={handleSearch} searchTerm={queryOptions.search} />
            <Link to="/admin/add-product" className="mt-4 md:mt-0 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
              Add New Product
            </Link>
          </div>
          
          <FilterOptions 
            filterOptions={queryOptions}
            handleFilterChange={handleFilterChange}
            categories={data?.meta?.categories || []}
            brands={data?.meta?.brands || []}
          />
        </div>

        <div className="overflow-x-auto">
          <ProductTable 
            products={data?.data || []}
            currentPage={queryOptions.page}
            totalPages={data?.meta?.totalPages || 1}
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
