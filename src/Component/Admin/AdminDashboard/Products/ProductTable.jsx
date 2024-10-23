/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useState } from 'react';

const ProductTable = ({ products, currentPage, totalPages, onPageChange, openUpdateModal, handleDelete, isLoading }) => {
  const [expandedProduct, setExpandedProduct] = useState(null);
  const toggleProductExpansion = (productId) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <div className="grid grid-cols-12 gap-4 mb-4 font-medium text-sm text-gray-700 dark:text-gray-300 uppercase border-b border-gray-200 dark:border-gray-700 pb-2 text-center">
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
        {products.length > 0 ? (
        products.map((product) => (
          <div key={product._id} className="mb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <div className="grid grid-cols-12 gap-4 items-center py-4 cursor-pointer lg:hidden" onClick={() => toggleProductExpansion(product._id)}>
              <div className="col-span-2">
                <img src={product.images && product.images[0]?.url} alt={product.images && product.images[0]?.alt} className="h-12 w-12 rounded-full object-cover mx-auto" />
              </div>
              <div className="col-span-6">
                <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{product.basicInfo?.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{product.basicInfo?.brand}</div>
              </div>
              <div className="col-span-3 flex justify-center space-x-2 items-center ">
                <button onClick={(e) => { e.stopPropagation(); openUpdateModal(product); }} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" title="Edit">
                  <FaEdit className="w-4 h-4" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(product._id); }} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Delete">
                  <FaTrash className="w-4 h-4" />
                </button>
                <Link to={`/product/${product._id}`} onClick={(e) => e.stopPropagation()} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300" title="View">
                  <FaEye className="w-4 h-4" />
                </Link>
              </div>
              <div className="col-span-1">
                {expandedProduct === product._id ? <FaChevronUp className='w-3 h-3'/> : <FaChevronDown className='w-3 h-3'/>}
              </div>
            </div>
            {expandedProduct === product._id && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-inner lg:hidden">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Category:</span>
                    <span className="text-sm text-gray-800 dark:text-gray-200">{product.basicInfo.category}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Code:</span>
                    <span className="text-sm text-gray-800 dark:text-gray-200">{product.basicInfo.productCode}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Price:</span>
                    <span className="text-sm text-gray-800 dark:text-gray-200">${product.price.regular.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Discount:</span>
                    <span className="text-sm text-gray-800 dark:text-gray-200">{product.price.discounted ? `$${product.price.discounted.toFixed(2)}` : '-'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Stock:</span>
                    <span className={`text-sm ${product.stockStatus === 'In Stock' ? 'text-green-600 dark:text-green-400' : product.stockStatus === 'Out of Stock' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                      {product.stockStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Featured:</span>
                    <span className="text-sm text-gray-800 dark:text-gray-200">{product.additionalInfo.isFeatured ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">On Sale:</span>
                    <span className="text-sm text-gray-800 dark:text-gray-200">{product.additionalInfo.isOnSale ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 lg:py-4 lg:items-center lg:hover:bg-gray-50 lg:dark:hover:bg-gray-700 lg:text-center">
              <div className="lg:col-span-1">
                <img src={product.images && product.images[0]?.url} alt={product.images && product.images[0]?.alt} className="h-12 w-12 rounded-full object-cover mx-auto" />
              </div>
              <div className="lg:col-span-2">
                <div className="font-medium text-gray-900 dark:text-gray-100 truncate" title={product.basicInfo?.title}>
                  {product.basicInfo?.title}
                </div>
              </div>
              <div className="lg:col-span-1 text-gray-500 dark:text-gray-400 truncate" title={product.basicInfo?.brand}>
                {product.basicInfo?.brand}
              </div>
              <div className="lg:col-span-1 text-gray-500 dark:text-gray-400 truncate" title={product.basicInfo?.category}>
                {product.basicInfo?.category}
              </div>
              <div className="lg:col-span-1 text-gray-500 dark:text-gray-400 truncate" title={product.basicInfo?.productCode}>
                {product.basicInfo?.productCode}
              </div>
              <div className="lg:col-span-1 text-gray-500 dark:text-gray-400">
                ${product.price.regular.toFixed(2)}
              </div>
              <div className="lg:col-span-1 text-gray-500 dark:text-gray-400">
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
              <div className="lg:col-span-1 text-gray-500 dark:text-gray-400">
                {product.additionalInfo.isFeatured ? 'Yes' : 'No'}
              </div>
              <div className="lg:col-span-1 text-gray-500 dark:text-gray-400">
                {product.additionalInfo.isOnSale ? 'Yes' : 'No'}
              </div>
              <div className="lg:col-span-1 flex space-x-2 justify-center">
                <button onClick={() => openUpdateModal(product)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" title="Edit">
                  <FaEdit className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Delete">
                  <FaTrash className="w-5 h-5" />
                </button>
                <Link to={`/product/${product._id}`} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300" title="View">
                  <FaEye className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        ))
        ) : (
      <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <p className="text-gray-500 dark:text-gray-400 text-lg text-center">No products found</p>
        </div>
        )}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTable;
