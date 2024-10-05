// Import necessary dependencies
import { motion } from 'framer-motion';
import { FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { useState } from 'react';

// Define the About component
const About = () => {
  // Sample data for team members
  const teamMembers = [
    { name: 'John Doe', role: 'CEO', image: 'https://i.pravatar.cc/150?img=3' },
    { name: 'Jane Smith', role: 'CTO', image: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Mike Johnson', role: 'Lead Developer', image: 'https://i.pravatar.cc/150?img=5' },
    { name: 'Sarah Brown', role: 'Marketing Director', image: 'https://i.pravatar.cc/150?img=9' },
  ];

  // State for contact form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to a server
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Main heading with animation */}
      <motion.h1 
        className="text-4xl font-bold text-center mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        About Us
      </motion.h1>
      
      {/* Company introduction */}
      <motion.div 
        className="w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <p className="text-lg mb-6">
          Welcome to SparkTech, your premier destination for cutting-edge electronics and innovative gadgets. We&apos;re more than just an online store; we&apos;re your trusted partner in the world of technology. With over a decade of experience, our passionate team of tech enthusiasts curates a diverse collection of high-quality products from industry-leading brands, making the latest technological advancements accessible to everyone at competitive prices. We&apos;re committed to providing personalized service and comprehensive support throughout your tech journey, ensuring you find the perfect solution tailored to your unique needs. At SparkTech, we don&apos;t just sell products; we cultivate relationships and build a community of tech-savvy individuals. Experience the SparkTech difference today and let us exceed your expectations in every interaction!
        </p>
      </motion.div>

      {/* Our Team section */}
      <motion.section
        className="mt-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h2 className="text-3xl font-semibold text-center mb-6">Our Team</h2>
      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Map through team members and display their information */}
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
            >
              <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
              <p className="text-gray-600 mb-4">{member.role}</p>
              {/* Social media links */}
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-blue-500 hover:text-blue-600"><FaLinkedin size={20} /></a>
                <a href="#" className="text-blue-400 hover:text-blue-500"><FaTwitter size={20} /></a>
                <a href="#" className="text-gray-600 hover:text-gray-700"><FaEnvelope size={20} /></a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Our History section */}
      <motion.section
        className="mt-12 py-16 rounded-lg "
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 2 }}
      >
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">Our Journey Through Time</h2>
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h3 className="text-2xl font-semibold mb-3 ">2010: The Beginning</h3>
              <p className="text-gray-700">
                Started as a small local shop with a big dream to revolutionize electronics retail.
              </p>
            </div>
            <div className="md:w-1/3">
              <img src="https://i.imgur.com/uKQqsuA.jpg" alt="Our first shop in 2010" className="rounded-lg shadow-md" />
            </div>
          </div>
          <div className="flex flex-col md:flex-row-reverse items-center justify-between mb-8">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h3 className="text-2xl font-semibold mb-3 ">2015: Going Online</h3>
              <p className="text-gray-700">
                Launched our e-commerce platform, expanding our reach to customers nationwide.
              </p>
            </div>
            <div className="md:w-1/3">
              <img src="https://i.imgur.com/uKQqsuA.jpg" alt="Our online store launch in 2015" className="rounded-lg shadow-md" />
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h3 className="text-2xl font-semibold mb-3">Today: A Trusted Name</h3>
              <p className="text-gray-700">
                Now a leading electronics retailer, known for our extensive range, competitive prices, and exceptional service.
              </p>
            </div>
            <div className="md:w-1/3">
              <img src="https://i.imgur.com/uKQqsuA.jpg" alt="Our modern retail and online operations" className="rounded-lg shadow-md w-full h-auto object-cover" />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Customer Testimonials section */}
      <motion.section
        className="mt-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <h2 className="text-3xl font-semibold text-center mb-6">Customer Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Testimonial 1 */}
          <div className="bg-gray-100 p-6 rounded-lg">
            <p className="italic mb-4">&quot;Excellent service and top-quality products. I&apos;m a repeat customer and always satisfied!&quot;</p>
            <p className="font-semibold">- John D.</p>
          </div>
          {/* Testimonial 2 */}
          <div className="bg-gray-100 p-6 rounded-lg">
            <p className="italic mb-4">&quot;The best place to find the latest tech gadgets. Their knowledgeable staff is always helpful.&quot;</p>
            <p className="font-semibold">- Sarah M.</p>
          </div>
        </div>
      </motion.section>

      {/* Contact Us Form */}
      <motion.section
        className="mt-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <h2 className="text-3xl font-semibold text-center mb-6">Contact Us</h2>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              required
            ></textarea>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Send Message
            </button>
          </div>
        </form>
      </motion.section>
    </div>
  );
};

export default About;
