import React from 'react';
import { motion } from 'framer-motion';
import { AiOutlineFileText, AiOutlineBarChart, AiOutlineStar } from 'react-icons/ai'; // Import icons from react-icons

const AboutUs = () => {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.div
      className="flex flex-col items-center p-6 md:p-12 bg-gray-100 min-h-screen mt-16"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">About Us</h1>
      <p className="text-lg md:text-xl mb-8 text-gray-700 text-center max-w-3xl">
        Welcome to <strong>Online Grading system</strong>, where we revolutionize classroom management for educators.
      </p>
      <p className="text-lg md:text-xl mb-8 text-gray-700 text-center max-w-3xl">
        Our mission is to simplify the educational experience for both teachers and students. With a focus on precision and usability, our system provides key features to enhance your teaching workflow:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-white p-3 rounded-lg shadow-lg flex items-start">
          <div>
            <h3 className="text-xl font-semibold text-accent font-header mb-2">          
            <AiOutlineFileText className="text-primary text-4xl mr-4" />
            Automated Report Cards</h3>
            <p className="text-gray-700">
              Effortlessly generate comprehensive report cards with just a few clicks. Our system streamlines the process, saving you time and effort.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg flex items-start">
         
          <div>
            <h3  className="text-xl font-semibold text-accent font-header mb-2">  <AiOutlineBarChart className="text-primary text-4xl mr-4" />Student Ranking</h3>
            <p className="text-gray-700">
              Instantly view and manage student performance with detailed ranking systems. Track progress and make informed decisions with ease.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg flex items-start">
          <div>
            <h3 className="text-xl font-semibold text-accent font-header mb-2">         
            <AiOutlineStar className="text-primary text-4xl mr-4" />
            Grading Made Simple</h3>
            <p className="text-gray-700">
              Easily grade assignments and monitor progress, ensuring a smooth academic experience for both teachers and students.
            </p>
          </div>
        </div>
      </div>

      <p className="text-lg md:text-xl text-gray-700 text-center max-w-3xl mt-8">
        At <strong>Online Grade</strong>, we empower educators with tools designed to simplify daily tasks and focus on what truly matters—teaching and inspiring students.
      </p>

      <a
        href="/register"
        className="mt-8 px-6 py-3 bg-primary text-white text-lg font-semibold rounded-md hover:bg-secondary transition duration-300"
      >
        Sign Up Today
      </a>
    </motion.div>
  );
};

export default AboutUs;
