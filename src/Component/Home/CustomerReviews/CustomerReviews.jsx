import { useState } from "react";
import Title from "../../../UI/Title";
import { useTheme } from "../../../ThemeContext"; // Import useTheme hook

// Sample reviews data
const reviews = [
  {
    id: 1,
    name: "John Doe",
    review: "Great product! It really improved my experience.",
    rating: 5,
  },
  {
    id: 2,
    name: "Jane Smith",
    review: "Very satisfied with the quality and the customer service.",
    rating: 4,
  },
  {
    id: 3,
    name: "Samuel Green",
    review: "Decent product, but there's room for improvement.",
    rating: 3,
  },
  // Add more reviews as needed
];

const CustomerReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isDarkMode } = useTheme(); // Use the useTheme hook

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={`container mx-auto my-8 ${isDarkMode ? 'text-white' : 'text-black'}`}>
      <Title title={"Customer Reviews"} />

      {/* Review Card */}
      <div className={`relative p-6 border rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-full ${
            isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
          }`}
        >
          ❮
        </button>
        <button
          onClick={handleNext}
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-full ${
            isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
          }`}
        >
          ❯
        </button>
        {/* Review Content */}
        <div className="relative w-full overflow-hidden after:clear-both after:block after:content-['']">
          {reviews.map((slide, index) => (
            <div
              key={index}
              className={`relative float-left -mr-[100%] w-full transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none ${
                index === currentIndex ? "block" : "hidden"
              }`}
            >
              {/* Star Ratings */}
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`${
                      index < reviews[currentIndex].rating
                        ? "text-yellow-500"
                        : isDarkMode ? "text-gray-600" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              {/* Reviewer Name */}
              <p className={`mt-2 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                {reviews[currentIndex].name}
              </p>
              <div className={`absolute inset-x-[15%] bottom-5 hidden py-5 text-center md:block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <h5 className="text-xl">{slide.title}</h5>
                <p>{slide.review}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CustomerReviews;
