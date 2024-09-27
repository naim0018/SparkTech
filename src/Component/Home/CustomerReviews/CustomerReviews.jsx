import { useState } from "react";
import Title from "../../../UI/Title";

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
    <div className="container mx-auto my-8 ">
      <Title title={"Customer Reviews"} />

      {/* Review Card */}
      <div className="relative p-6 border rounded-lg shadow-lg ">
        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded-full"
        >
          ❮
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded-full"
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
              {/* <img
                  src={slide.img}
                  className="block w-full"
                  alt={`Slide ${index + 1}`}
                /> */}
              {/* Star Ratings */}
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`${
                      index < reviews[currentIndex].rating
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              {/* Reviewer Name */}
              <p className="mt-2 font-semibold text-gray-900">
                {reviews[currentIndex].name}
              </p>
              <div className="absolute inset-x-[15%] bottom-5 hidden py-5 text-center text-white md:block">
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
