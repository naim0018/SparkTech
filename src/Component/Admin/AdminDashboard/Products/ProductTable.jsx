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
          {/* Table header for all screen sizes */}
          <div className="grid grid-cols-12 gap-4 mb-4 font-medium text-sm text-gray-700 uppercase border-b border-gray-200 pb-2 text-center">
            <div className="col-span-3 lg:col-span-1">Image</div>
            <div className="col-span-5 lg:col-span-2">Title</div>
            <div className="hidden lg:block lg:col-span-1">Brand</div>
            <div className="hidden lg:block lg:col-span-1">Category</div>
            <div className="hidden lg:block lg:col-span-1">Code</div>
            <div className="hidden lg:block lg:col-span-1">Price</div>
            <div className="hidden lg:block lg:col-span-1">Discount</div>
            <div className="hidden lg:block lg:col-span-1">Stock</div>
            <div className="hidden lg:block lg:col-span-1">Featured</div>
            <div className="hidden lg:block lg:col-span-1">On Sale</div>
            <div className="col-span-3 lg:block lg:col-span-1 ">Actions</div>
          </div>
          {/* Map through filtered products and display each product */}
          {filteredProducts.slice((currentPage - 1) * 10, currentPage * 10).map((product) => (
            <div key={product._id} className="mb-4 border-b border-gray-200 last:border-b-0">
              {/* Mobile view: Collapsed product information */}
              <div className="grid grid-cols-12 gap-4 items-center py-4 cursor-pointer lg:hidden" onClick={() => toggleProductExpansion(product._id)}>
                <div className="col-span-2">
                  <img src={product.images && product.images[0].url} alt={product.images && product.images[0].alt} className="h-12 w-12 rounded-full object-cover mx-auto" />
                </div>
                <div className="col-span-6">
                  <div className="font-medium text-gray-900 truncate">{product.title}</div>
                  <div className="text-sm text-gray-500 truncate">{product.brand}</div>
                </div>
                <div className="col-span-3 flex justify-center space-x-2 items-center ">
                  <button onClick={(e) => { e.stopPropagation(); openUpdateModal(product); }} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(product._id); }} className="text-red-600 hover:text-red-900" title="Delete">
                    <FaTrash className="w-4 h-4" />
                  </button>
                  <Link to={`/product/${product._id}`} onClick={(e) => e.stopPropagation()} className="text-green-600 hover:text-green-900" title="View">
                    <FaEye className="w-4 h-4" />
                  </Link>
                </div>
                <div className="">
                  {expandedProduct === product._id ? <FaChevronUp className='w-3 h-3'/> : <FaChevronDown className='w-3 h-3'/>}
                </div>
              </div>
              {/* Expanded view for mobile */}
              {expandedProduct === product._id && (
                <div className="bg-gray-50 p-4 rounded-lg shadow-inner lg:hidden">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="text-sm font-medium text-gray-600">Category:</span>
                      <span className="text-sm text-gray-800">{product.category}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="text-sm font-medium text-gray-600">Code:</span>
                      <span className="text-sm text-gray-800">{product.productCode}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="text-sm font-medium text-gray-600">Price:</span>
                      <span className="text-sm text-gray-800">${product.price.regular.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="text-sm font-medium text-gray-600">Discount:</span>
                      <span className="text-sm text-gray-800">{product.price.discounted ? `$${product.price.discounted.toFixed(2)}` : '-'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="text-sm font-medium text-gray-600">Stock:</span>
                      <span className={`text-sm ${product.stockStatus === 'In Stock' ? 'text-green-600' : product.stockStatus === 'Out of Stock' ? 'text-red-600' : 'text-yellow-600'}`}>
                        {product.stockStatus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="text-sm font-medium text-gray-600">Featured:</span>
                      <span className="text-sm text-gray-800">{product.isFeatured ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">On Sale:</span>
                      <span className="text-sm text-gray-800">{product.isOnSale ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              )}
              {/* Desktop view: Full product information */}
              <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 lg:py-4 lg:items-center lg:hover:bg-gray-50 lg:text-center">
                <div className="lg:col-span-1">
                  <img src={product.images && product.images[0].url} alt={product.images && product.images[0].alt} className="h-12 w-12 rounded-full object-cover mx-auto" />
                </div>
                <div className="lg:col-span-2">
                  <div className="font-medium text-gray-900 truncate" title={product.title}>
                    {product.title}
                  </div>
                </div>
                <div className="lg:col-span-1 text-gray-500 truncate" title={product.brand}>
                  {product.brand}
                </div>
                <div className="lg:col-span-1 text-gray-500 truncate" title={product.category}>
                  {product.category}
                </div>
                <div className="lg:col-span-1 text-gray-500 truncate" title={product.productCode}>
                  {product.productCode}
                </div>
                <div className="lg:col-span-1 text-gray-500">
                  ${product.price.regular.toFixed(2)}
                </div>
                <div className="lg:col-span-1 text-gray-500">
                  {product.price.discounted ? `$${product.price.discounted.toFixed(2)}` : '-'}
                </div>
                <div className="lg:col-span-1">
                  <div className="flex items-center justify-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      product.stockStatus === 'In Stock' ? 'bg-green-500' : 
                      product.stockStatus === 'Out of Stock' ? 'bg-red-500' : 
                      'bg-yellow-500'
                    }`}></span>
                    <span className="text-xs font-semibold">
                      {product.stockStatus}
                    </span>
                  </div>
                </div>
                <div className="lg:col-span-1 text-gray-500">
                  {product.isFeatured ? 'Yes' : 'No'}
                </div>
                <div className="lg:col-span-1 text-gray-500">
                  {product.isOnSale ? 'Yes' : 'No'}
                </div>
                <div className=" lg:col-span-1 flex space-x-2 justify-center">
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
          <p className="text-gray-500 text-lg text-center">No products found</p>
        </div>
      )}
    </div>
  )
}

// This component renders a table of products with expandable rows for mobile view
// It displays product information such as image, title, brand, category, price, stock status, etc.
// The component also provides options to edit, delete, and view individual products
export default ProductTable
