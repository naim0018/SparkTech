/* eslint-disable react/prop-types */
const BasicInformation = ({ register, errors }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Basic Information
      </h2>
      {/* Product Title */}
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Product Title
        </label>
        <input
          id="title"
          {...register("title", { required: "Title is required" })}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
          placeholder="Enter product title"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          {...register("description", {
            required: "Description is required",
          })}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200 h-32"
          placeholder="Enter product description"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="regularPrice"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Regular Price
          </label>
          <input
            id="regularPrice"
            type="number"
            step="0.01"
            {...register("price.regular", {
              required: "Regular price is required",
            })}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
            placeholder="Enter regular price"
          />
          {errors.price?.regular && (
            <p className="text-red-500 text-sm mt-1">
              {errors.price.regular.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="discountedPrice"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Discounted Price (optional)
          </label>
          <input
            id="discountedPrice"
            type="number"
            step="0.01"
            {...register("price.discounted")}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
            placeholder="Enter discounted price (if any)"
          />
        </div>
      </div>

      {/* Product Code */}
      <div className="mt-4">
        <label
          htmlFor="productCode"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Product Code
        </label>
        <input
          id="productCode"
          {...register("productCode", {
            required: "Product Code is required",
          })}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
          placeholder="Enter product code"
        />
        {errors.productCode && (
          <p className="text-red-500 text-sm mt-1">
            {errors.productCode.message}
          </p>
        )}
      </div>

      {/* Category and Subcategory */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            {...register("category", {
              required: "Category is required",
            })}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
          >
            <option value="" disabled >
              Select a category
            </option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="home">Home & Garden</option>
            <option value="toys">Toys & Games</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="subcategory"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Subcategory
          </label>
          <input
            id="subcategory"
            {...register("subcategory")}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
            placeholder="Enter subcategory"
          />
        </div>
      </div>

      {/* Stock Quantity */}
      <div className="mt-4">
        <label
          htmlFor="stockQuantity"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Stock Quantity
        </label>
        <input
          id="stockQuantity"
          type="number"
          {...register("stockQuantity", {
            required: "Stock Quantity is required",
          })}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
          placeholder="Enter stock quantity"
        />
        {errors.stockQuantity && (
          <p className="text-red-500 text-sm mt-1">
            {errors.stockQuantity.message}
          </p>
        )}
      </div>

      {/* Brand */}
      <div className="mt-4">
        <label
          htmlFor="brand"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Brand
        </label>
        <input
          id="brand"
          {...register("brand", { required: "Brand is required" })}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
          placeholder="Enter brand name"
        />
        {errors.brand && (
          <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>
        )}
      </div>
    </div>
  );
};

export default BasicInformation;
