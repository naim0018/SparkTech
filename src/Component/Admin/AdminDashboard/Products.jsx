import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllProductsQuery, useDeleteProductMutation, useUpdateProductMutation } from '../../../redux/api/ProductApi';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';

// This component displays a list of products with filtering, searching, and pagination capabilities
const Products = () => {
  // State for current page, search term, and filter options
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    inStock: false
  });

  // Fetch products data and mutations
  const { data, isLoading, isError, error } = useGetAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Set initial filtered products when data is loaded
  useEffect(() => {
    if (data?.data) {
      setFilteredProducts(data.data);
      
      // Extract unique categories and brands
      const uniqueCategories = [...new Set(data.data.map(product => product.category))];
      const uniqueBrands = [...new Set(data.data.map(product => product.brand))];
      
      setCategories(uniqueCategories);
      setBrands(uniqueBrands);
    }
  }, [data]);

  // Filter products based on search term and filter options
  useEffect(() => {
    if (data?.data) {
      const filtered = data.data.filter(product => {
        const matchesSearch = (product.title && product.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                              (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
                              (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = !filterOptions.category || (product.category && product.category === filterOptions.category);
        const matchesBrand = !filterOptions.brand || (product.brand && product.brand === filterOptions.brand);
        const matchesPrice = (!filterOptions.minPrice || product.price >= Number(filterOptions.minPrice)) &&
                             (!filterOptions.maxPrice || product.price <= Number(filterOptions.maxPrice));
        const matchesStock = !filterOptions.inStock || (product.stockQuantity && product.stockQuantity > 0);

        return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock;
      });
      setFilteredProducts(filtered);
      setCurrentPage(1);
      
      // Show toast if no products match the filter criteria
      if (filtered.length === 0) {
        toast.info('No relative data found', {
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

  // Handle product edit (placeholder function)
  const handleEdit = useCallback(async (productId) => {
    try {
      // Assuming you have the updated product data
      const updatedProductData = {
        // Add the fields you want to update
      };
      await updateProduct({ id: productId, ...updatedProductData }).unwrap();
      // Refresh the product list or update the state as needed
    } catch (err) {
      console.error('Failed to update the product', err);
      toast.error('Failed to update the product');
    }
  }, [updateProduct]);

  // Handle product deletion
  const handleDelete = useCallback(async (productId) => {
    try {
      await deleteProduct(productId).unwrap();
      setFilteredProducts(prevProducts => prevProducts.filter(product => product._id !== productId));
    } catch (err) {
      console.error('Failed to delete the product', err);
      toast.error('Failed to delete the product');
    }
  }, [deleteProduct]);

  // Handle page change for pagination
  const handlePageChange = useCallback((page) => setCurrentPage(page), []);

  // Handle search input change
  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Reset to first page when search input loses focus
  const handleSearchBlur = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Handle filter option changes
  const handleFilterChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFilterOptions(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  // Show loading or error states
  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (isError) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error.message}</div>;

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredProducts.length / 10);

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-full mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 md:mb-8 text-gray-800 w-64 text-center mx-auto underline">All Products</h1>
        
        {/* Search and filter options */}
        <div className="flex flex-col sm:flex-row justify-between mb-4 sm:mb-6 md:mb-8 gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search products..."
              className="px-4 py-2 border rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
              onBlur={handleSearchBlur}
            />
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
              className="px-4 py-2 border rounded-lg w-full sm:w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price"
              value={filterOptions.maxPrice}
              onChange={handleFilterChange}
              className="px-4 py-2 border rounded-lg w-full sm:w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                name="inStock"
                checked={filterOptions.inStock}
                onChange={handleFilterChange}
                className="mr-2"
              />
              In Stock Only
            </label>
          </div>
          <Link to="/admin/add-product" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 text-center">
            Add New Product
          </Link>
        </div>

        {/* Product table */}
        {filteredProducts.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-600">
                  <tr>
                    {['Image', 'Title', 'Brand', 'Category', 'Code', 'Price', 'Discount', 'Stock', 'Featured', 'On Sale', 'Actions'].map((header) => (
                      <th key={header} className="px-4 py-4 text-center text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product, index) => (
                    <tr key={product._id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-100'}`}>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <img src={product.images && product.images[0]} alt={product.title} className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover" />
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="w-48 overflow-hidden text-ellipsis" title={product.title}>
                          {product.title}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{product.brand}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{product.category}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{product.productCode}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">${product.price && product.price.toFixed(2)}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {product.discountPrice ? `$${product.discountPrice.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{product.stockQuantity}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isFeatured ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {product.isFeatured ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isOnSale ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {product.isOnSale ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button onClick={() => handleEdit(product._id)} className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-1 px-2 rounded transition duration-300 flex items-center justify-center">
                            <FaEdit className="mr-1" /> Update
                          </button>
                          <button 
                            onClick={() => handleDelete(product._id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded transition duration-300 flex items-center justify-center"
                          >
                            <FaTrash className="mr-1" /> Delete
                          </button>
                          <Link to={`/admin/product/${product._id}`} className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded transition duration-300 text-center flex items-center justify-center">
                            <FaEye className="mr-1" /> View Details
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
          <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-4 sm:mt-6 md:mt-8 flex justify-center flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`m-1 px-3 sm:px-4 py-1 sm:py-2 rounded text-sm sm:text-base ${
                currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-blue-500 hover:bg-blue-100'
              } transition duration-300`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
