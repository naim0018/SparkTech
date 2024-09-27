import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BiEdit, BiTrash } from 'react-icons/bi';
import { useGetAllProductsQuery, useDeleteProductMutation } from '../../../redux/api/ProductApi';

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, isError, error } = useGetAllProductsQuery({ page: currentPage, limit: 10 });
  const [deleteProduct] = useDeleteProductMutation();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (data && data.products) {
      setFilteredProducts(data.products);
    }
  }, [data]);

  const handleEdit = (productId) => {
    console.log('Edit product', productId);
    // TODO: Implement edit functionality
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId).unwrap();
      setFilteredProducts(prevProducts => prevProducts.filter(product => product._id !== productId));
    } catch (err) {
      console.error('Failed to delete the product', err);
      // TODO: Show error message to user
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);

  useEffect(() => {
    if (data && Array.isArray(data.products)) {
      const filtered = data.products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, data]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  if (!data || !data.products || !Array.isArray(data.products) || data.products.length === 0) {
    return <div>No data found</div>;
  }

  const totalPages = data.meta?.totalPage || 1;

  console.log('Data:', data);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      
      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="px-4 py-2 border rounded-lg w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link to="/admin/add-product" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Add New Product
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Image</th>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Brand</th>
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Product Code</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Discount Price</th>
              <th className="py-2 px-4 border-b">Stock</th>
              <th className="py-2 px-4 border-b">Featured</th>
              <th className="py-2 px-4 border-b">On Sale</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    <img src={product.images[0]} alt={product.title} width={50} height={50} className="object-cover" />
                  </td>
                  <td className="py-2 px-4 border-b">{product.title}</td>
                  <td className="py-2 px-4 border-b">{product.brand}</td>
                  <td className="py-2 px-4 border-b">{product.category}</td>
                  <td className="py-2 px-4 border-b">{product.productCode}</td>
                  <td className="py-2 px-4 border-b">${product.price.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">
                    {product.discountPrice ? `$${product.discountPrice.toFixed(2)}` : '-'}
                  </td>
                  <td className="py-2 px-4 border-b">{product.stockQuantity}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded ${product.isFeatured ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                      {product.isFeatured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded ${product.isOnSale ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-800'}`}>
                      {product.isOnSale ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => handleEdit(product._id)} className="text-blue-500 hover:text-blue-700 mr-2">
                      <BiEdit />
                    </button>
                    <button 
                      onClick={() => handleDelete(product._id)}
                      className="text-red-500 hover:text-red-700 mr-2"
                    >
                      <BiTrash />
                    </button>
                    <Link to={`/admin/product/${product._id}`} className="text-green-500 hover:text-green-700">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="py-4 text-center">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
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
    </div>
  );
};

export default Products;
