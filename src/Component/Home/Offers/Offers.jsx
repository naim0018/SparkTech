// Import necessary dependencies
import { useState, useEffect } from 'react';
import { FaGift } from 'react-icons/fa';
import { useTheme } from '../../../ThemeContext'; // Import useTheme hook

// Offers component for displaying seasonal sale information and countdown timer
const Offers = () => {
  // State to hold the time left for the sale
  const [timeLeft, setTimeLeft] = useState({});
  const { isDarkMode } = useTheme(); // Use the useTheme hook

  // Effect to update the countdown timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      const difference = +new Date("2024-12-31") - +new Date();
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`py-12 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{backgroundImage: "url('https://i.imgur.com/gsT43Ib.png')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
            {/* Left side: Sale information */}
            <div className="p-8 pr-2">
              <div className={`${isDarkMode ? 'bg-gray-700 bg-opacity-80' : 'bg-white bg-opacity-80'} p-6 rounded-lg h-full`}>
                <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Seasonal Sale 2024</h2>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>Use code <span className="font-semibold text-indigo-400">SALE2024</span> to get 20% off on all items!</p>
                <div className="flex items-center mb-6">
                  <FaGift className="text-2xl text-indigo-400 mr-3" />
                  <span className="text-2xl font-bold text-indigo-400">20% OFF</span>
                </div>
                <button className="bg-indigo-600 text-white py-2 px-6 rounded-full hover:bg-indigo-700 transition duration-300">Shop Now</button>
              </div>
            </div>
            {/* Right side: Countdown timer */}
            <div className="p-8 pl-2">
              <div className={`${isDarkMode ? 'bg-gray-700 bg-opacity-80' : 'bg-white bg-opacity-80'} p-6 rounded-lg h-full flex flex-col justify-center`}>
                <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-4 text-center`}>Sale Ends In:</h3>
                <div className="flex space-x-4 justify-center">
                  {/* Display countdown timer for each time unit */}
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="text-center">
                      <div className={`${isDarkMode ? 'bg-gray-600' : 'bg-white'} rounded-lg shadow p-3 mb-2`}>
                        <span className="text-2xl font-bold text-indigo-400">{value}</span>
                      </div>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} capitalize`}>{unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;
