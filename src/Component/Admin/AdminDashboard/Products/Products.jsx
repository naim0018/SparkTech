// Import necessary dependencies and components
import { useState, useEffect, useCallback } from 'react';
import { useGetAllProductsQuery, useDeleteProductMutation } from '../../../../redux/api/ProductApi';
import { toast } from 'react-toastify';
import UpdateProducts from '../UpdateProducts';
import SearchAndAddProduct from './SearchAndAddProduct';
import FilterOptions from './FilterOptions';
import ProductTable from './ProductTable';


const Products = () => {
  // State variables for pagination, search, and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    stockStatus: ''
  });
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products data and delete mutation
  const { data, isLoading } = useGetAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Effect to set initial filtered products, categories, and brands
  useEffect(() => {
    if (data?.data) {
      setFilteredProducts(data.data);
      // Extract unique categories and brands from the product data
      setCategories([...new Set(data.data.map(product => product.category))]);
      setBrands([...new Set(data.data.map(product => product.brand))]);
    }
  }, [data]);

  // Effect to filter products based on search term and filter options
  useEffect(() => {
    if (data?.data) {
      const filtered = data.data.filter(product => {
        // Check if product matches search term (case-insensitive)
        const matchesSearch = (product.title && product.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                              (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
                              (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()));
        // Check if product matches selected category
        const matchesCategory = !filterOptions.category || (product.category && product.category === filterOptions.category);
        // Check if product matches selected brand
        const matchesBrand = !filterOptions.brand || (product.brand && product.brand === filterOptions.brand);
        // Check if product price is within the specified range
        const matchesPrice = (!filterOptions.minPrice || product.price.regular >= Number(filterOptions.minPrice)) &&
                             (!filterOptions.maxPrice || product.price.regular <= Number(filterOptions.maxPrice));
        // Check if product matches selected stock status
        const matchesStockStatus = !filterOptions.stockStatus || product.stockStatus === filterOptions.stockStatus;

        return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStockStatus;
      });
      setFilteredProducts(filtered);
      setCurrentPage(1); // Reset to first page after filtering
      
      // Show toast if no matching products found
      if (filtered.length === 0) {
        toast.info('No matching products found', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  }, [data, searchTerm, filterOptions]);

  // Callback functions for modal operations
  const openUpdateModal = useCallback((product) => {
    setSelectedProduct(product);
    setIsUpdateModalOpen(true);
  }, []);

  const closeUpdateModal = useCallback(() => {
    setSelectedProduct(null);
    setIsUpdateModalOpen(false);
  }, []);

  // Function to handle product deletion
  const handleDelete = useCallback(async (productId) => {
    try {
      await deleteProduct(productId).unwrap();
      // Remove the deleted product from the filtered products list
      setFilteredProducts(prevProducts => prevProducts.filter(product => product._id !== productId));
      toast.success('Product deleted successfully');
    } catch (err) {
      console.error('Failed to delete the product', err);
      toast.error('Failed to delete the product');
    }
  }, [deleteProduct]);

  // Callback functions for pagination, search, and filtering
  const handlePageChange = useCallback((page) => setCurrentPage(page), []);
  const handleSearch = useCallback((e) => setSearchTerm(e.target.value), []);
  const handleSearchBlur = useCallback(() => setCurrentPage(1), []); // Reset to first page after search
  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({ ...prev, [name]: value }));
  }, []);

  // Loading and error states
  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;


  // Calculate total number of pages for pagination
  const totalPages = Math.ceil(filteredProducts.length / 10);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8 overflow-x-hidden">
      <div className="max-w-full mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 dark:text-gray-200 text-center">Product Management</h1>
        
        {/* Search and Add Product section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <SearchAndAddProduct handleSearch={handleSearch} handleSearchBlur={handleSearchBlur} />
          
          {/* Filter options */}
          <FilterOptions 
            filterOptions={filterOptions}
            handleFilterChange={handleFilterChange}
            categories={categories}
            brands={brands}
          />
        </div>

        {/* Product table */}
        <div className="overflow-x-auto">
          <ProductTable 
            filteredProducts={filteredProducts}
            currentPage={currentPage}
            openUpdateModal={openUpdateModal}
            handleDelete={handleDelete}
          />
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 sm:mt-8 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-2 sm:px-4 py-2 border text-sm font-medium ${
                    currentPage === page
                      ? 'z-10 bg-indigo-50 dark:bg-indigo-900 border-indigo-500 text-indigo-600 dark:text-indigo-200'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
      {/* Update Product Modal */}
      {isUpdateModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative mx-auto p-4 sm:p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800">  
            <UpdateProducts products={selectedProduct} closeModal={closeUpdateModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
