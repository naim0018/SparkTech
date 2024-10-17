/* eslint-disable react/prop-types */

const AdditionalOptions = ({ register, errors, defaultValues }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Additional Options
      </h2>
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center space-x-2">
          <input
            id="freeShipping"
            type="checkbox"
            {...register("additionalInfo.freeShipping")}
            defaultChecked={defaultValues?.additionalInfo?.freeShipping || false}
            className="w-5 h-5 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700 rounded focus:ring-gray-500 dark:focus:ring-gray-400"
          />
          <label
            htmlFor="freeShipping"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Free Shipping
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="isFeatured"
            type="checkbox"
            {...register("isFeatured")}
            defaultChecked={defaultValues?.isFeatured || false}
            className="w-5 h-5 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700 rounded focus:ring-gray-500 dark:focus:ring-gray-400"
          />
          <label
            htmlFor="isFeatured"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Featured Product
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="isOnSale"
            type="checkbox"
            {...register("isOnSale")}
            defaultChecked={defaultValues?.isOnSale || false}
            className="w-5 h-5 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700 rounded focus:ring-gray-500 dark:focus:ring-gray-400"
          />
          <label
            htmlFor="isOnSale"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            On Sale
          </label>
        </div>
      </div>
      <div className="mt-4">
        <label
          htmlFor="estimatedDelivery"
          className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1"
        >
          Estimated Delivery
        </label>
        <input
          id="estimatedDelivery"
          {...register("additionalInfo.estimatedDelivery")}
          defaultValue={defaultValues?.additionalInfo?.estimatedDelivery || ''}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-300 focus:border-transparent transition duration-200"
          placeholder="Enter estimated delivery time"
        />
        {errors.additionalInfo?.estimatedDelivery && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.additionalInfo.estimatedDelivery.message}</p>
        )}
      </div>
      <div className="mt-4">
        <label
          htmlFor="returnPolicy"
          className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1"
        >
          Return Policy
        </label>
        <input
          id="returnPolicy"
          {...register("additionalInfo.returnPolicy")}
          defaultValue={defaultValues?.additionalInfo?.returnPolicy || ''}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-300 focus:border-transparent transition duration-200"
          placeholder="Enter return policy details"
        />
        {errors.additionalInfo?.returnPolicy && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.additionalInfo.returnPolicy.message}</p>
        )}
      </div>
      <div className="mt-4">
        <label
          htmlFor="warranty"
          className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1"
        >
          Warranty
        </label>
        <input
          id="warranty"
          {...register("additionalInfo.warranty")}
          defaultValue={defaultValues?.additionalInfo?.warranty || ''}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-300 focus:border-transparent transition duration-200"
          placeholder="Enter warranty information"
        />
        {errors.additionalInfo?.warranty && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.additionalInfo.warranty.message}</p>
        )}
      </div>
    </div>
  )
}

export default AdditionalOptions
