// Import necessary dependencies and components
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllProductsQuery, useDeleteProductMutation } from '../../../redux/api/ProductApi';
import { FaEdit, FaTrash, FaEye, FaSearch} from 'react-icons/fa';
import { toast } from 'react-toastify';
import UpdateProducts from './UpdateProducts';

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
  const { data, isLoading, isError, error } = useGetAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Effect to set initial filtered products, categories, and brands
  useEffect(() => {
    if (data?.data) {
      setFilteredProducts(data.data);
      setCategories([...new Set(data.data.map(product => product.category))]);
      setBrands([...new Set(data.data.map(product => product.brand))]);
    }
  }, [data]);

  // Effect to filter products based on search term and filter options
  useEffect(() => {
    if (data?.data) {
      const filtered = data.data.filter(product => {
        const matchesSearch = (product.title && product.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                              (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
                              (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = !filterOptions.category || (product.category && product.category === filterOptions.category);
        const matchesBrand = !filterOptions.brand || (product.brand && product.brand === filterOptions.brand);
        const matchesPrice = (!filterOptions.minPrice || product.price.regular >= Number(filterOptions.minPrice)) &&
                             (!filterOptions.maxPrice || product.price.regular <= Number(filterOptions.maxPrice));
        const matchesStockStatus = !filterOptions.stockStatus || product.stockStatus === filterOptions.stockStatus;

        return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStockStatus;
      });
      setFilteredProducts(filtered);
      setCurrentPage(1);
      
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
  const handleSearchBlur = useCallback(() => setCurrentPage(1), []);
  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({ ...prev, [name]: value }));
  }, []);

  // Loading and error states
  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (isError) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error.message}</div>;

  const totalPages = Math.ceil(filteredProducts.length / 10);

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-full mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Product Management</h1>
        
        {/* Search and Add Product section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="relative w-full md:w-64 mb-4 md:mb-0">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={handleSearch}
                onBlur={handleSearchBlur}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <Link to="/admin/add-product" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
              Add New Product
            </Link>
          </div>
          
          {/* Filter options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <select
              name="category"
              value={filterOptions.category}
              onChange={handleFilterChange}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              name="brand"
              value={filterOptions.brand}
              onChange={handleFilterChange}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
            <input
              type="number"
              name="minPrice"
              placeholder="Min Price"
              value={filterOptions.minPrice}
              onChange={handleFilterChange}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price"
              value={filterOptions.maxPrice}
              onChange={handleFilterChange}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="stockStatus"
              value={filterOptions.stockStatus}
              onChange={handleFilterChange}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Stock Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Pre-order">Pre-order</option>
            </select>
          </div>
        </div>

        {/* Product table */}
        {filteredProducts.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    {['Image', 'Title', 'Brand', 'Category', 'Code', 'Price', 'Discount', 'Stock Status', 'Featured', 'On Sale', 'Actions'].map((header) => (
                      <th key={header} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.slice((currentPage - 1) * 10, currentPage * 10).map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img src={product.images && product.images[0].url} alt={product.images && product.images[0].alt} className="h-12 w-12 rounded-full object-cover" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs" title={product.title}>
                          {product.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.brand}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.productCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.regular.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.price.discounted ? `$${product.price.discounted.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.stockStatus === 'In Stock' ? 'bg-green-100 text-green-800' : 
                          product.stockStatus === 'Out of Stock' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {product.stockStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.isFeatured ? 'Yes' : 'No'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.isOnSale ? 'Yes' : 'No'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button onClick={() => openUpdateModal(product)} className="text-indigo-600 hover:text-indigo-900">
                            <FaEdit className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900">
                            <FaTrash className="w-5 h-5" />
                          </button>
                          <Link to={`/product/${product._id}`} className="text-green-600 hover:text-green-900">
                            <FaEye className="w-5 h-5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-lg">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === page
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative  mx-auto p-5 border w-full  shadow-lg rounded-md bg-white">  
              <UpdateProducts products={selectedProduct} closeModal={closeUpdateModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
