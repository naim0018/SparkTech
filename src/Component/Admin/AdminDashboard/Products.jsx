/* eslint-disable react/prop-types */
/* This component handles the product management section of the admin dashboard.
   It includes features like:
   - Displaying a list of products in both desktop and mobile views
   - Filtering products by category, stock status, price range and search term
   - CRUD operations (Create, Read, Update, Delete) for products
   - Responsive design with different layouts for different screen sizes
   - Dark mode support
   - Pagination support
*/
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useState } from 'react';
import { useDeleteProductMutation, useGetAllProductsQuery } from '../../../redux/api/ProductApi';
import { useGetAllCategoriesQuery } from '../../../redux/api/CategoriesApi';

import Swal from 'sweetalert2';
import UpdateProduct from './UpdateProduct';


const Products = () => {
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    stockStatus: '',
    minPrice: 0,
    maxPrice: 10000,
    searchTerm: '',
    sortPrice: ''
  });

  const { data: productData, isLoading } = useGetAllProductsQuery({
    page: currentPage,
    limit: itemsPerPage,
    category: filters.category || undefined,
    subcategory: filters.subcategory || undefined,
    stockStatus: filters.stockStatus || undefined,
    priceRange: filters.minPrice && filters.maxPrice ? [filters.minPrice, filters.maxPrice] : undefined,
    search: filters.searchTerm || undefined,
    sort: filters.sortPrice || undefined
  });
  const [deleteProduct] = useDeleteProductMutation();
  const { data } = useGetAllCategoriesQuery();
  const categories = data?.data || []
  const products = productData?.products || [];
  const pagination = productData?.pagination || {};

  // Get subcategories for selected category
  const selectedCategoryData = categories.find(cat => cat.name === filters.category);
  const subcategories = selectedCategoryData?.subCategories || [];
  const toggleProductExpansion = (productId) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  const openUpdateModal = (product) => {
    setSelectedProduct(product);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDelete = async (productId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning", 
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: '#fff',
      customClass: {
        title: 'text-xl font-bold',
        content: 'text-gray-600'
      }
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct(productId).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: "Product has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
      } catch { 
        Swal.fire({
          title: "Error!",
          text: "Failed to delete product.",
          icon: "error",
          timer: 1500,
          showConfirmButton: false
        });
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value === 'all' ? '' : value,
      // Reset subcategory when category changes
      ...(name === 'category' && {subcategory: ''})
    }));
    setCurrentPage(1);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value ? Number(value) : undefined
    }));
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const totalPages = pagination.totalPages || 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Product Management
          </h1>
          <Link 
            to="/admin/dashboard/add-product"
            className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm sm:text-base"
          >
            Add New Product
          </Link>
        </header>

        {/* Filter Section */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
              <input
                type="text"
                name="searchTerm"
                value={filters.searchTerm}
                onChange={handleFilterChange}
                placeholder="Search products..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories?.map(category => (
                  <option key={category._id} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>

            {/* Show subcategories filter if available */}
            {subcategories.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subcategory</label>
                <select
                  name="subcategory"
                  value={filters.subcategory?.name}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">All Subcategories</option>
                  {subcategories.map(subcategory => (
                    <option key={subcategory._id} value={subcategory.name}>{subcategory.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock Status</label>
              <select
                name="stockStatus"
                value={filters.stockStatus}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">All Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sort by Price</label>
              <select
                name="sortPrice"
                value={filters.sortPrice}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Default</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Items Per Page</label>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price Range</label>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Min: ৳{filters.minPrice}</span>
                  <input
                    type="range"
                    name="minPrice"
                    min="0"
                    max={filters.maxPrice}
                    value={filters.minPrice}
                    onChange={handlePriceChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Max: ৳{filters.maxPrice}</span>
                  <input
                    type="range"
                    name="maxPrice"
                    min={filters.minPrice}
                    max="10000"
                    value={filters.maxPrice}
                    onChange={handlePriceChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Table/Grid Section */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            {products.length > 0 ? (
              <div className="min-w-full">
                {/* Desktop View */}
                <table className="hidden lg:table min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                    <tr>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Details
                      </th>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Additional Info
                      </th>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Landing Page
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                              <img className="h-full w-full rounded-lg object-cover shadow-sm" src={product.images?.[0]?.url} alt="" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {product.basicInfo?.title}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                {product.basicInfo?.brand}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.basicInfo?.category}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {product.basicInfo?.subcategory}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.price.discounted ? (
                              <div>
                                <span className="line-through text-gray-500">৳{product.price.regular.toFixed(2)}</span>
                                <span className="ml-2 text-green-600">৳{product.price.discounted.toFixed(2)}</span>
                              </div>
                            ) : (
                              <span>৳{product.price.regular.toFixed(2)}</span>
                            )}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            Code: {product.basicInfo?.productCode}
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <div className={`inline-flex items-center px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium ${product.stockStatus === 'In Stock' ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-green-200' : 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-red-200'} shadow-sm transition-all duration-200 hover:shadow-md`}>
                            <span className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full mr-1.5 sm:mr-2 ${product.stockStatus === 'In Stock' ? 'bg-green-100' : 'bg-red-100'}`}></span>
                            {product.stockStatus}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {product.additionalInfo?.isOnSale && (
                              <span className="px-2 sm:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                On Sale
                              </span>
                            )}
                            {product.additionalInfo?.isFeatured && (
                              <span className="px-2 sm:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                Featured
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2 sm:space-x-4">
                            <button
                              onClick={() => openUpdateModal(product)}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transform hover:scale-110 transition-transform duration-200"
                            >
                              <FaEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transform hover:scale-110 transition-transform duration-200"
                            >
                              <FaTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <Link
                              to={`/product/${product._id}`}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transform hover:scale-110 transition-transform duration-200"
                            >
                              <FaEye className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Link>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2 sm:space-x-4">
                            <button
                              onClick={() => window.location.href = `/landing-page/${product._id}`}
                              className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:text-gray-200 dark:hover:bg-green-400 font-medium py-2 px-4 rounded transition-transform duration-200 transform hover:scale-105"
                            >
                              LandingPage
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile/Tablet View */}
                <div className="lg:hidden space-y-4 p-4">
                  {products.map((product) => (
                    <div key={product._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition-all duration-200 hover:shadow-lg">
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <img className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg object-cover shadow" src={product.images?.[0]?.url} alt="" />
                            <div>
                              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white line-clamp-1">{product.basicInfo?.title}</h3>
                              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{product.basicInfo?.brand}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => toggleProductExpansion(product._id)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                          >
                            {expandedProduct === product._id ? <FaChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <FaChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
                          </button>
                        </div>
                        
                        {expandedProduct === product._id && (
                          <div className="mt-4 sm:mt-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4 sm:gap-6">
                              <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Category</p>
                                <p className="mt-1 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{product.basicInfo?.category}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Price</p>
                                <p className="mt-1 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                                  {product.price.discounted ? (
                                    <div>
                                      <span className="line-through text-gray-500">৳{product.price.regular.toFixed(2)}</span>
                                      <span className="ml-2 text-green-600">৳{product.price.discounted.toFixed(2)}</span>
                                    </div>
                                  ) : (
                                    <span>৳{product.price.regular.toFixed(2)}</span>
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</p>
                                <div className={`mt-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${product.stockStatus === 'In Stock' ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-green-200' : 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-red-200'} shadow-sm transition-all duration-200 hover:shadow-md`}>
                                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${product.stockStatus === 'In Stock' ? 'bg-green-100' : 'bg-red-100'}`}></span>
                                  {product.stockStatus}
                                </div>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Product Code</p>
                                <p className="mt-1 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{product.basicInfo?.productCode}</p>
                              </div>
                            </div>
                            
                            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <button
                                onClick={() => openUpdateModal(product)}
                                className="p-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transform hover:scale-110 transition-all duration-200"
                              >
                                <FaEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transform hover:scale-110 transition-all duration-200"
                              >
                                <FaTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                              <Link
                                to={`/product/${product._id}`}
                                className="p-2 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transform hover:scale-110 transition-all duration-200"
                              >
                                <FaEye className="w-4 h-4 sm:w-5 sm:h-5" />
                              </Link>
                            </div>
                            <button
                              onClick={() => window.location.href = `/landing-page/${product._id}`}
                              className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:text-gray-200 dark:hover:bg-green-400 font-medium py-2 px-4 rounded transition-transform duration-200 transform hover:scale-105"
                            >
                              Landing Page
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400">No products found</p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center py-4 px-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                } transition-colors duration-200`}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === pageNumber
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  } transition-colors duration-200`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                } transition-colors duration-200`}
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Modal */}
      {isUpdateModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-[90vw] max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300">
            {/* <ProductInput product={selectedProduct} closeModal={closeUpdateModal} /> */}
            <UpdateProduct product={selectedProduct} closeModal={closeUpdateModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
