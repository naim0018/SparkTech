import { useState } from "react";
import PropTypes from "prop-types";
import Checkout from "../../../Checkout/Checkout";

const CheckoutSection = ({ product, selectedVariants = [], currentPrice }) => {
  const [orderDetails, setOrderDetails] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails({ ...orderDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add order functionality here
    console.log("Order submitted:", {
      product,
      selectedVariants,
      currentPrice,
      orderDetails,
    });
  };

  return (
    <div className="container mx-auto mt-20">
      <Checkout />
      <div className="mt-10 p-5 bg-gray-100 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-5">Order Summary</h2>
        <p className="mb-2"><strong>Product:</strong> {product.name}</p>
        <p className="mb-2"><strong>Price:</strong> ${currentPrice}</p>
        <div className="mb-4">
          <label className="block text-gray-700">Select Variant</label>
          <select
            name="variant"
            className="w-full p-2 border border-gray-300 rounded-lg"
            onChange={handleInputChange}
          >
            {Array.isArray(selectedVariants) && selectedVariants.map((variant, index) => (
              <option key={index} value={variant}>
                {variant}
              </option>
            ))}
          </select>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-10 p-5 bg-gray-100 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-5">Checkout Form</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={orderDetails.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={orderDetails.address}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
            value={orderDetails.phone}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={orderDetails.email}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};
CheckoutSection.propTypes = {
  product: PropTypes.object.isRequired,
  selectedVariants: PropTypes.array,
  currentPrice: PropTypes.number.isRequired,
};

export default CheckoutSection;

