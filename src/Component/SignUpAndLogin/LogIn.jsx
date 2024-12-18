// This component handles both login and signup functionality
// It uses Framer Motion for animations and React Icons for icons

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLock, FaGoogle, FaGithub, FaUser, FaHome } from 'react-icons/fa';
import { useTheme } from '../../ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateUserMutation } from '../../redux/api/UserApi';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useLoginMutation } from '../../redux/api/AuthApi';
import { decodeToken } from '../../utils/verifyToken';
import { setCredentials } from '../../redux/features/AuthSlice';
import { useDispatch } from 'react-redux';

const LogIn = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register: registerLogin, handleSubmit: handleLoginSubmit, reset: resetLogin, formState: { errors: loginErrors } } = useForm({
  
  });
  const { register: registerSignup, handleSubmit: handleSignupSubmit, reset: resetSignup } = useForm();

  const [createUser] = useCreateUserMutation();
  const [login] = useLoginMutation();

  // Handle login form submission
  const handleLogin = async (data) => {
    try {
      const response = await login({
        email: data.loginEmail,
        password: data.loginPassword
      });
      if (response.data) {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'Welcome back!',
          confirmButtonColor: '#4B5563',
          timer: 1500,
          timerProgressBar: true
        });
        const decodedToken = decodeToken(response?.data?.data?.accessToken)
        dispatch(setCredentials({ user: decodedToken, accessToken: response?.data?.data?.accessToken }))
        // Clear login form
        resetLogin();
        // Navigate to dashboard or home page
        navigate('/');
      } else if (response.error) {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: response.error.data?.message || 'Invalid email or password',
          confirmButtonColor: '#4B5563'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message || 'Something went wrong',
        confirmButtonColor: '#4B5563'
      });
    }
  };

  // Handle signup form submission  
  const handleSignup = async (data) => {
    try {
      const userData = {
        name: data.name,
        email: data.signupEmail,
        password: data.signupPassword
      };
      await createUser(userData);
      
      Swal.fire({
        icon: 'success',
        title: 'Sign Up Successful!',
        text: 'Please login to continue',
        confirmButtonColor: '#4B5563',
        timer: 3000,
        timerProgressBar: true
      });
      
      // Clear signup form
      resetSignup();
      
      // Switch to login mode after a short delay
      setTimeout(() => {
        setIsLogin(true);
      }, 1000);
      
    } catch (error) {
      console.error('Signup error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Sign Up Failed',
        text: 'Please try again',
        confirmButtonColor: '#4B5563'
      });
    }
  };

  // Toggle between login and signup modes
  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  // Handle Google sign up/login
  const handleGoogleSignUp = () => {
      
  };

  // Handle GitHub sign up/login
  const handleGithubSignUp = () => {
    
  };

  return (
    <div className={`flex h-screen items-center justify-center ${isDarkMode ? 'bg-gray-100' : 'bg-white'}`}>
      {/* Go Back Home Button */}
      <Link 
        to="/"
        className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-600 to-gray-800 text-white hover:from-gray-800 hover:to-gray-600 transition-all"
      >
        <FaHome className="text-lg" />
        <span>Back to Home</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={`flex h-[90%] w-[90%] max-w-5xl overflow-hidden rounded-3xl shadow-2xl ${isDarkMode ? 'bg-white' : 'bg-gray-50'}`}
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
                className="relative hidden h-full items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800 md:flex md:w-1/2 overflow-hidden"
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
                className={`flex w-full md:w-1/2 flex-col justify-center py-10 px-8 ${isDarkMode ? 'bg-white' : 'bg-gray-50'}`}
              >
                <h2 className={`mb-8 text-center text-4xl font-bold text-gray-800`}>Welcome Back</h2>
                <form onSubmit={handleLoginSubmit(handleLogin)} className="flex w-full flex-col items-center justify-center gap-6">
                  <div className="relative w-full max-w-md">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      className={`w-full rounded-lg border ${loginErrors.loginEmail ? 'border-red-500' : 'border-gray-200'} bg-white text-gray-800 px-10 py-3 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent`}
                      type="email"
                      placeholder="Email"
                      {...registerLogin('loginEmail', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                    />
                    {loginErrors.loginEmail && (
                      <p className="mt-1 text-xs text-red-500">{loginErrors.loginEmail.message}</p>
                    )}
                  </div>
                  <div className="relative w-full max-w-md">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      className={`w-full rounded-lg border ${loginErrors.loginPassword ? 'border-red-500' : 'border-gray-200'} bg-white text-gray-800 px-10 py-3 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent`}
                      type="password"
                      placeholder="Password"
                      {...registerLogin('loginPassword', { 
                        required: 'Password is required',
                        minLength: {
                          value: 3,
                          message: 'Password must be at least 3 characters'
                        }
                      })}
                    />
                    {loginErrors.loginPassword && (
                      <p className="mt-1 text-xs text-red-500">{loginErrors.loginPassword.message}</p>
                    )}
                  </div>
                  <div className="flex w-full max-w-md justify-between items-center">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2 rounded text-gray-600 focus:ring-gray-600" />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-gray-600 hover:underline">Forgot password?</a>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full max-w-md rounded-lg bg-gradient-to-r from-gray-600 to-gray-800 px-6 py-3 font-medium text-white shadow-lg transition-all hover:from-gray-800 hover:to-gray-600"
                  >
                    Log In
                  </motion.button>
                </form>
                <p className="mt-8 text-center text-sm text-gray-600">
                  Don&apos;t have an account? <button onClick={toggleMode} className="text-gray-600 hover:underline font-medium">Create now</button>
                </p>
                {/* Divider and social login buttons */}
                <div className="my-8 flex items-center px-8">
                  <hr className="flex-1 border-gray-200" />
                  <div className="mx-4 text-gray-500">OR</div>
                  <hr className="flex-1 border-gray-200" />
                </div>
                <div className="flex justify-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center justify-center space-x-2 rounded-full bg-white border border-gray-200 px-4 py-2 text-sm text-gray-700 shadow-md hover:bg-gray-50"
                  >
                    <FaGoogle />
                    <span>Google</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center justify-center space-x-2 rounded-full bg-white border border-gray-200 px-4 py-2 text-sm text-gray-700 shadow-md hover:bg-gray-50"
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
      className={`flex w-full md:w-1/2 flex-col justify-center py-10 px-8 ${isDarkMode ? 'bg-white' : 'bg-gray-50'}`}
    >
      <h2 className="mb-8 text-center text-4xl font-bold text-gray-800">Create Account</h2>
      <form onSubmit={handleSignupSubmit(handleSignup)} className="flex w-full flex-col items-center justify-center gap-6">
        <div className="relative w-full max-w-md">
          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className={`w-full rounded-lg border border-gray-200 bg-white text-gray-800 px-10 py-3 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent`}
            type="text"
            placeholder="Name"
            {...registerSignup('name', { required: true })}
          />
        </div>
        <div className="relative w-full max-w-md">
          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className={`w-full rounded-lg border border-gray-200 bg-white text-gray-800 px-10 py-3 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent`}
            type="email"
            placeholder="Email"
            {...registerSignup('signupEmail', { required: true })}
          />
        </div>
        <div className="relative w-full max-w-md">
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className={`w-full rounded-lg border border-gray-200 bg-white text-gray-800 px-10 py-3 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent`}
            type="password"
            placeholder="Password"
            {...registerSignup('signupPassword', { required: true })}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full max-w-md rounded-lg bg-gradient-to-r from-gray-600 to-gray-800 px-6 py-3 font-medium text-white shadow-lg transition-all hover:from-gray-800 hover:to-gray-600"
        >
          Sign Up
        </motion.button>
      </form>
      <div className="mt-6 flex justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoogleSignUp}
          className="flex items-center justify-center rounded-full bg-white border border-gray-200 p-2 text-gray-700 shadow-md transition-all hover:bg-gray-50"
        >
          <FaGoogle className="text-xl" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGithubSignUp}
          className="flex items-center justify-center rounded-full bg-white border border-gray-200 p-2 text-gray-700 shadow-md transition-all hover:bg-gray-50"
        >
          <FaGithub className="text-xl" />
        </motion.button>
      </div>
      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account? <button onClick={toggleMode} className="text-gray-600 hover:underline font-medium">Login</button>
      </p>
    </motion.div>
              {/* Welcome Section for Sign Up */}
              <motion.div
                key="welcome-signup"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.5 }}
                className="relative hidden h-full items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800 md:flex md:w-1/2 overflow-hidden"
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
