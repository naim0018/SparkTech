import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { FaArrowUp } from "react-icons/fa"
import { useTheme } from "../ThemeContext"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"

const Mainlayout = () => {
  const [showGoToTop, setShowGoToTop] = useState(false)
  const { isDarkMode } = useTheme()
  const { scrollYProgress } = useScroll()
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowGoToTop(true)
      } else {
        setShowGoToTop(false) 
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
      
    })
  }

  return (
    <div className={`relative ${isDarkMode ? 'dark' : ''}`}>
      <Navbar/>
      
      <Outlet/>
      <Footer/>
      <AnimatePresence>
        {showGoToTop && (
          <motion.button
            onClick={scrollToTop}
            className={`fixed bottom-16 right-16 bg-gradient-to-r from-primary to-primary-dark text-white p-3 rounded-full shadow-lg hover:from-secondary hover:to-secondary-dark transition duration-300`}
            aria-label="Go to top"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.5 }}
            style={{ rotate }}

          >
            <FaArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Mainlayout