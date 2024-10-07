/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useState } from 'react';

// ProductTable component for displaying a table of products with expandable rows
const ProductTable = ({ filteredProducts, currentPage, openUpdateModal, handleDelete }) => {
  // State to track which product is currently expanded
  const [expandedProduct, setExpandedProduct] = useState(null);

  // Function to toggle the expansion of a product row
  const toggleProductExpansion = (productId) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  return (
    <div className="w-full overflow-x-auto">
      {filteredProducts.length > 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-4">
          {/* Table header for large screens */}
          <div className="hidden lg:grid grid-cols-12 gap-4 mb-4 font-medium text-sm text-gray-700 uppercase">
            <div className="col-span-1">Image</div>
            <div className="col-span-3">Title</div>
            <div className="col-span-1">Brand</div>
            <div className="col-span-1">Category</div>
            <div className="col-span-1">Code</div>
            <div className="col-span-1">Price</div>
            <div className="col-span-1">Discount</div>
            <div className="col-span-1">Stock</div>
            <div className="col-span-1">Featured</div>
            <div className="col-span-1">On Sale</div>
          </div>
          {/* Map through filtered products and display each product */}
          {filteredProducts.slice((currentPage - 1) * 10, currentPage * 10).map((product) => (
            <div key={product._id} className="mb-4 border-b border-gray-200 last:border-b-0">
              {/* Mobile view: Collapsed product information */}
              <div className="flex items-center justify-between py-4 cursor-pointer lg:hidden" onClick={() => toggleProductExpansion(product._id)}>
                <div className="flex items-center w-full">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <img src={product.images && product.images[0].url} alt={product.images && product.images[0].alt} className="h-12 w-12 rounded-full object-cover mr-4" />
                      <div>
                        <div className="font-medium text-gray-900">{product.title}</div>
                        <div className="text-sm text-gray-500">{product.brand}</div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => openUpdateModal(product)} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                        <FaEdit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900" title="Delete">
                        <FaTrash className="w-5 h-5" />
                      </button>
                      <Link to={`/product/${product._id}`} className="text-green-600 hover:text-green-900" title="View">
                        <FaEye className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
                {expandedProduct === product._id ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {/* Desktop view: Full product information */}
              <div className={`lg:grid lg:grid-cols-12 lg:gap-4 lg:py-4 lg:items-center lg:hover:bg-gray-50 ${expandedProduct === product._id ? 'block' : 'hidden lg:grid'}`}>
                <div className="hidden lg:block lg:col-span-1">
                  <img src={product.images && product.images[0].url} alt={product.images && product.images[0].alt} className="h-12 w-12 rounded-full object-cover" />
                </div>
                <div className="hidden lg:flex lg:col-span-3 lg:justify-between lg:items-center">
                  <div className="font-medium text-gray-900 truncate" title={product.title}>
                    {product.title}
                  </div>
                  {/* Action buttons for editing, deleting, and viewing */}
                  <div className="hidden lg:flex space-x-2">
                    <button onClick={() => openUpdateModal(product)} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900" title="Delete">
                      <FaTrash className="w-5 h-5" />
                    </button>
                    <Link to={`/product/${product._id}`} className="text-green-600 hover:text-green-900" title="View">
                      <FaEye className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
                {/* Display other product details */}
                <div className="hidden lg:block lg:col-span-1 text-gray-500 truncate" title={product.brand}>
                  {product.brand}
                </div>
                <div className="text-gray-500 lg:col-span-1 truncate py-2 lg:py-0" title={product.category}>
                  <span className="font-medium lg:hidden">Category: </span>{product.category}
                </div>
                <div className="text-gray-500 lg:col-span-1 truncate py-2 lg:py-0" title={product.productCode}>
                  <span className="font-medium lg:hidden">Code: </span>{product.productCode}
                </div>
                <div className="text-gray-500 lg:col-span-1 py-2 lg:py-0">
                  <span className="font-medium lg:hidden">Price: </span>${product.price.regular.toFixed(2)}
                </div>
                <div className="text-gray-500 lg:col-span-1 py-2 lg:py-0">
                  <span className="font-medium lg:hidden">Discount: </span>
                  {product.price.discounted ? `$${product.price.discounted.toFixed(2)}` : '-'}
                </div>
                {/* Display stock status with color-coded badge */}
                <div className="lg:col-span-1 py-2 lg:py-0">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    product.stockStatus === 'In Stock' ? 'bg-green-100 text-green-800' : 
                    product.stockStatus === 'Out of Stock' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.stockStatus}
                  </span>
                </div>
                <div className="text-gray-500 lg:col-span-1 py-2 lg:py-0">
                  <span className="font-medium lg:hidden">Featured: </span>{product.isFeatured ? 'Yes' : 'No'}
                </div>
                <div className="text-gray-500 lg:col-span-1 py-2 lg:py-0">
                  <span className="font-medium lg:hidden">On Sale: </span>{product.isOnSale ? 'Yes' : 'No'}
                </div>
                {/* Mobile view: Action buttons */}
                <div className="flex space-x-2 mt-2 lg:hidden">
                  <button onClick={() => openUpdateModal(product)} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                    <FaEdit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900" title="Delete">
                    <FaTrash className="w-5 h-5" />
                  </button>
                  <Link to={`/product/${product._id}`} className="text-green-600 hover:text-green-900" title="View">
                    <FaEye className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Display message when no products are found
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-lg">
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      )}
    </div>
  )
}

export default ProductTable
