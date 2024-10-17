import { useTheme } from '../ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';

const DarkMode = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`flex items-center justify-center size-10 rounded-full transition-colors duration-500 ${
        isDarkMode ? 'bg-[#333D4C] text-white' : 'bg-white text-[#333D4C]'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ rotate: 0 }}
      animate={{ rotate: isDarkMode ? 360 : 0 }}
      transition={{ duration: 0.5 }}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        {isDarkMode ? (
          <FaMoon className="size-4" />
        ) : (
          <FaSun className="size-4" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default DarkMode;
