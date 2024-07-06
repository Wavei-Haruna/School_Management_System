import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaGithub } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-primary left-0 right-0 w-screen mx-0 relative  h-72 mb-0 pb-9">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 h-28">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2 font-header text-white"><span className='text-amber-950'>AAMUSTED</span> OnlineGrade</h3>
            <p>&copy; 2024 <span className='text-amber-950'>AAMUSTED</span>  OnlineGrade. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopeer noreferrer" className="text-gray-400 hover:text-white">
              <FaFacebookF size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <FaTwitter size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <FaLinkedinIn size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <FaInstagram size={24} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <FaGithub size={24} />
            </a>
          </div>
        </div>
        <div className=" text-center text-gray-400 text-sm">
          <p>Contact us: info@onlinegradeaamusted.com | 055137449</p>
          <p>Tanoso Street, Kumasi, AAMUSTED</p>
        </div>
      </div>
    </footer>
  );
}
