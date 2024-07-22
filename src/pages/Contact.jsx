import React from 'react';
import { motion } from 'framer-motion';

const ContactUs = () => {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.div
      className="flex flex-col items-center p-6 md:p-12 bg-gray-100 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Contact Us</h1>
      <p className="text-lg md:text-xl mb-8 text-gray-700 text-center max-w-3xl">
        We’d love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to reach out to us using the form below or via email.
      </p>

      <form className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Your Name"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Your Email"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-700 text-sm font-semibold mb-2">
            Message
          </label>
          <textarea
            id="message"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Your Message"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full px-6 py-3 bg-primary text-white text-lg font-semibold rounded-md hover:bg-secondary transition duration-300"
        >
          Send Message
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-lg md:text-xl text-gray-700">
          Alternatively, you can reach us via email at: <a href="mailto:Selasibanini@gmail.com" className="text-primary hover:underline">Selasibanini@gmail.com</a>
        </p>
      </div>
    </motion.div>
  );
};

export default ContactUs;
