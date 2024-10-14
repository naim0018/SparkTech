// This component handles both login and signup functionality
// It uses Framer Motion for animations and React Icons for icons
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLock, FaGoogle, FaGithub, FaUser } from 'react-icons/fa';
import { useTheme } from '../../ThemeContext'; // Import useTheme hook

const LogIn = () => {
  // State variables for form inputs and login/signup mode
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { isDarkMode } = useTheme(); // Use the useTheme hook

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log('Login attempted with:', { email, password });
    } else {
      console.log('Sign up attempted with:', { name, email, password });
    }
  };

  // Toggle between login and signup modes
  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  // Handle Google sign up/login
  const handleGoogleSignUp = () => {
    console.log('Google sign up/login attempted');
  };

  // Handle GitHub sign up/login
  const handleGithubSignUp = () => {
    console.log('GitHub sign up/login attempted');
  };

  return (
    <div className={`flex h-screen items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={`flex h-[90%] w-[90%] max-w-5xl overflow-hidden rounded-3xl shadow-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <AnimatePresence initial={false}>
          {isLogin ? (
            <>
              {/* Create Account side */}
              <motion.div
                key="create-account"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.5 }}
                className="relative hidden h-full items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 md:flex md:w-1/2 overflow-hidden"
              >
                <motion.div 
                  className="z-10 space-y-6 text-center p-8 rounded-xl backdrop-blur-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <motion.h2 
                    className="text-5xl font-bold text-white mb-4 text-center"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    Join Our Tech Community
                  </motion.h2>
                  <motion.div
                    className="w-16 h-1 bg-white mx-auto mb-6"
                    initial={{ width: 0 }}
                    animate={{ width: 64 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  />
                  <motion.ul 
                    className="text-xl text-white space-y-4 text-left"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <motion.li
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1, duration: 0.5 }}
                    >
                      <span className="mr-2">🚀</span> Access exclusive tech deals
                    </motion.li>
                    <motion.li
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.2, duration: 0.5 }}
                    >
                      <span className="mr-2">📱</span> Stay updated with latest innovations
                    </motion.li>
                    <motion.li
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.4, duration: 0.5 }}
                    >
                      <span className="mr-2">🌐</span> Connect with fellow tech enthusiasts
                    </motion.li>
                  </motion.ul>
                </motion.div>
              </motion.div>
              {/* Login side */}
              <motion.div
                key="login"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.5 }}
                className={`flex w-full md:w-1/2 flex-col justify-center py-10 px-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <h2 className={`mb-8 text-center text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Welcome Back</h2>
                <form onSubmit={handleSubmit} className="flex w-full flex-col items-center justify-center gap-6">
                  <div className="relative w-full max-w-md">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      className={`w-full rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-gray-50'} px-10 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative w-full max-w-md">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      className={`w-full rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-gray-50'} px-10 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex w-full max-w-md justify-between items-center">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2 rounded text-purple-600 focus:ring-purple-500" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-purple-600 hover:underline">Forgot password?</a>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full max-w-md rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:from-indigo-600 hover:to-purple-600"
                  >
                    Log In
                  </motion.button>
                </form>
                <p className={`mt-8 text-center text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Don&apos;t have an account? <button onClick={toggleMode} className="text-purple-600 hover:underline font-medium">Create now</button>
                </p>
                {/* Divider and social login buttons */}
                <div className="my-8 flex items-center px-8">
                  <hr className={`flex-1 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />
                  <div className={`mx-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>OR</div>
                  <hr className={`flex-1 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />
                </div>
                <div className="flex justify-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center justify-center space-x-2 rounded-full bg-red-500 px-4 py-2 text-sm text-white shadow-md hover:bg-red-600"
                  >
                    <FaGoogle />
                    <span>Google</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center justify-center space-x-2 rounded-full bg-gray-800 px-4 py-2 text-sm text-white shadow-md hover:bg-gray-900"
                  >
                    <FaGithub />
                    <span>GitHub</span>
                  </motion.button>
                </div>
              </motion.div>
            </>
          ) : (
            <>
              {/* Sign up form */}
              <motion.div
      key="signup"
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'tween', duration: 0.5 }}
      className={`flex w-full md:w-1/2 flex-col justify-center py-10 px-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <h2 className={`mb-8 text-center text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Create Account</h2>
      <form onSubmit={handleSubmit} className="flex w-full flex-col items-center justify-center gap-6">
        <div className="relative w-full max-w-md">
          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className={`w-full rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-gray-50'} px-10 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="relative w-full max-w-md">
          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className={`w-full rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-gray-50'} px-10 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="relative w-full max-w-md">
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className={`w-full rounded-lg border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-gray-50'} px-10 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full max-w-md rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:from-indigo-600 hover:to-purple-600"
        >
          Sign Up
        </motion.button>
      </form>
      <div className="mt-6 flex justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoogleSignUp}
          className={`flex items-center justify-center rounded-full p-2 shadow-md transition-all ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
        >
          <FaGoogle className="text-red-500 text-xl" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGithubSignUp}
          className="flex items-center justify-center rounded-full bg-gray-800 p-2 text-white shadow-md transition-all hover:bg-gray-700"
        >
          <FaGithub className="text-xl" />
        </motion.button>
      </div>
      <p className={`mt-8 text-center text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Already have an account? <button onClick={toggleMode} className="text-purple-600 hover:underline font-medium">Login</button>
      </p>
    </motion.div>
              {/* Welcome Section for Sign Up */}
              <motion.div
                key="welcome-signup"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.5 }}
                className="relative hidden h-full items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 md:flex md:w-1/2 overflow-hidden"
              >
                <motion.div 
                  className="z-10 space-y-6 text-center p-8 rounded-xl backdrop-blur-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <motion.h2 
                    className="text-5xl font-bold text-white mb-4 text-center"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    Welcome to Our Community
                  </motion.h2>
                  <motion.div
                    className="w-16 h-1 bg-white mx-auto mb-6"
                    initial={{ width: 0 }}
                    animate={{ width: 64 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  />
                  <motion.ul 
                    className="text-xl text-white space-y-4 text-left"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <motion.li
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1, duration: 0.5 }}
                    >
                      <span className="mr-2">🚀</span> Access exclusive tech deals
                    </motion.li>
                    <motion.li
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.2, duration: 0.5 }}
                    >
                      <span className="mr-2">📱</span> Stay updated with latest innovations
                    </motion.li>
                    <motion.li
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.4, duration: 0.5 }}
                    >
                      <span className="mr-2">🌐</span> Connect with fellow tech enthusiasts
                    </motion.li>
                  </motion.ul>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LogIn;
