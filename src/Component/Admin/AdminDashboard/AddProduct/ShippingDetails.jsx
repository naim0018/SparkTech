/* eslint-disable react/prop-types */
const ShippingDetails = ({ register, errors }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Shipping Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="weight"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                      >
                        Weight
                      </label>
                      <input
                        id="weight"
                        {...register("weight")}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                        placeholder="Enter product weight"
                      />
                      {errors.weight && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.weight.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="estimatedDelivery"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                      >
                        Estimated Delivery
                      </label>
                      <input
                        id="estimatedDelivery"
                        {...register("additionalInfo.estimatedDelivery")}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                        placeholder="Enter estimated delivery time"
                      />
                      {errors.additionalInfo?.estimatedDelivery && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.additionalInfo.estimatedDelivery.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Dimensions
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {["length", "width", "height"].map((dim) => (
                        <div key={dim}>
                          <label
                            htmlFor={dim}
                            className="block text-xs font-medium text-gray-600 mb-1"
                          >
                            {dim.charAt(0).toUpperCase() + dim.slice(1)}
                          </label>
                          <input
                            id={dim}
                            type="number"
                            step="0.01"
                            {...register(`dimensions.${dim}`, {
                              required: `${dim} is required`,
                            })}
                            placeholder={`Enter ${dim}`}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                          />
                          {errors.dimensions?.[dim] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.dimensions[dim].message}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="dimensionsUnit"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Dimensions Unit
                    </label>
                    <select
                      id="dimensionsUnit"
                      {...register("dimensions.unit", {
                        required: "Unit is required",
                      })}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
                    >
                      <option value="">Select unit</option>
                      <option value="cm">cm</option>
                      <option value="in">in</option>
                    </select>
                    {errors.dimensions?.unit && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.dimensions.unit.message}
                      </p>
                    )}
                  </div>
                </div>
  )
}

export default ShippingDetails
