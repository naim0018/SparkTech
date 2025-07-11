
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p className="text-sm">We are passionate about delivering high-quality products and exceptional customer service.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="text-sm">
              <li className="mb-2"><a href="/" className="hover:text-gray-300">Home</a></li>
              <li className="mb-2"><a href="/shop" className="hover:text-gray-300">Shop</a></li>
              {/* <li className="mb-2"><a href="/about" className="hover:text-gray-300">About</a></li>
              <li className="mb-2"><a href="/contact" className="hover:text-gray-300">Contact</a></li> */}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p className="text-sm mb-2">Dhaka, Bangladesh</p>
            <p className="text-sm mb-2">Phone: +8801610403011</p>
            <p className="text-sm">Email: support@bestbuy4ubd.com</p>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} SparkTech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
