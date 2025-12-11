import { motion } from 'framer-motion';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import { useTheme } from '../ThemeContext';

const Footer = () => {
  const { isDarkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Blog', href: '/blog' },
    ],
    shop: [
      { name: 'All Products', href: '/shop' },
      { name: 'New Arrivals', href: '/shop?filter=new' },
      { name: 'Best Sellers', href: '/shop?filter=bestseller' },
      { name: 'Special Offers', href: '/shop?filter=sale' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Track Order', href: '/track' },
      { name: 'Returns', href: '/returns' },
      { name: 'Shipping Info', href: '/shipping' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Disclaimer', href: '/disclaimer' },
    ],
  };

  const socialLinks = [
    { icon: FaFacebookF, href: 'https://facebook.com', label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:bg-sky-500' },
    { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:bg-pink-600' },
    { icon: FaLinkedinIn, href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:bg-blue-700' },
    { icon: FaYoutube, href: 'https://youtube.com', label: 'YouTube', color: 'hover:bg-red-600' },
  ];

  return (
    <footer className={`relative ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'} text-white overflow-hidden`}>
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-4">
             BestBuy4uBD
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Your trusted destination for premium electronics and gadgets. We deliver quality products with exceptional customer service.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300 hover:text-orange-400 transition-colors">
                  <div className="bg-orange-500/20 p-2 rounded-lg">
                    <FaMapMarkerAlt className="text-orange-500" />
                  </div>
                  <span className="text-sm">Dhaka, Bangladesh</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 hover:text-orange-400 transition-colors">
                  <div className="bg-orange-500/20 p-2 rounded-lg">
                    <FaPhone className="text-orange-500" />
                  </div>
                  <span className="text-sm">+8801610403011</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 hover:text-orange-400 transition-colors">
                  <div className="bg-orange-500/20 p-2 rounded-lg">
                    <FaEnvelope className="text-orange-500" />
                  </div>
                  <span className="text-sm">support@bestbuy4ubd.com</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold mb-4 text-white">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-orange-500 group-hover:w-4 transition-all duration-300"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Shop Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold mb-4 text-white">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-orange-500 group-hover:w-4 transition-all duration-300"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-bold mb-4 text-white">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-orange-500 group-hover:w-4 transition-all duration-300"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-lg font-bold mb-4 text-white">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-orange-500 group-hover:w-4 transition-all duration-300"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="border-t border-gray-700/50 pt-8 mb-8"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Stay Updated
            </h3>
            <p className="text-gray-400 mb-6">Subscribe to our newsletter for exclusive deals and latest updates</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl font-semibold text-white shadow-lg shadow-orange-500/30 transition-all duration-300"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Social Media & Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="border-t border-gray-700/50 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className={`bg-gray-800 p-3 rounded-full ${social.color} transition-all duration-300 shadow-lg`}
                >
                  <social.icon className="text-white text-lg" />
                </motion.a>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm flex items-center gap-2 justify-center md:justify-end">
                © {currentYear} SparkTech. Made with 
                <FaHeart className="text-red-500 animate-pulse" /> 
                in Bangladesh
              </p>
              <p className="text-gray-500 text-xs mt-1">All rights reserved.</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500"></div>
    </footer>
  );
};

export default Footer;
