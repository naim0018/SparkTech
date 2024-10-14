import { NavLink } from "react-router-dom";
import { useTheme } from "../../ThemeContext"; // Import useTheme hook

const ErrorPage = () => {
  const { isDarkMode } = useTheme(); // Use the useTheme hook

  return (
    <div className={`relative w-full h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="absolute z-10 -top-28 w-full h-full flex flex-col items-center justify-center px-2 md:px-0">
        <h1 className="text-[200px] font-medium text-[#FA7C70]">404</h1>
        <h2 className={`text-[42px] font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Page not found</h2>
        <p className={`font-bold pt-2 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Oops! The page you are looking for does not exist. It might have been
          moved or deleted
        </p>
        <div className="relative mt-20">
          <NavLink to="/">
            <button className={`uppercase w-[262px] h-[52px] border-2 ${isDarkMode ? 'border-white bg-gray-800 text-white' : 'border-black bg-white text-black'} text-base font-bold`}>
              Back to home
            </button>
          </NavLink>
          <div className={`w-[262px] h-[52px] absolute top-1 left-1 bg-[#FA7C70] z-[-2] border-2 ${isDarkMode ? 'border-white' : 'border-black'}`}></div>
        </div>
      </div>

      <img className="absolute" src="https://i.imgur.com/CI3u4UU.png" alt="" />
      <img
        className="absolute top-0 right-0 hidden md:flex"
        src="https://i.imgur.com/g64QwzA.png"
        alt=""
      />
      <img
        className="absolute bottom-0 right-0"
        src="https://i.imgur.com/NY5CnPz.png"
        alt=""
      />
    </div>
  );
};
export default ErrorPage;
