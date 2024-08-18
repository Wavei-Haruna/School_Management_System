import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Ensure Link and useNavigate are imported from react-router-dom
import { FiMenu, FiX } from 'react-icons/fi'; // Example icons from react-icons
import Logo from '../assets/react.svg'; // Replace with your actual logo file path
import { useAuth } from "../AuthContext";
import { toast } from 'react-toastify';


function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await logout(); 
    toast.success("logged out")
      // Call the logout function from useAuth
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-primary p-4 fixed w-screen z-50 top-0 left-0 right-0">
      <div className="container mx-auto flex justify-between items-center relative">
        <Link to="/" className="flex items-center text-white">
          <img src={Logo} alt="Logo" className="h-8 mr-2" /> {/* Adjust size as needed */}
          <span className="font-bold text-xl">Grading System</span>
        </Link>

        {/* Hamburger menu icon */}
        <div className="md:hidden px-4">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </button>
        </div>

        {/* Menu items */}
        <div
          className={`md:flex absolute md:relative top-16 transition-all ease-in-out duration-200 right-0 md:top-0 md:right-auto md:flex-row md:space-x-4 p-3 text-center font-semibold ${
            isOpen ? 'w-full md:w-auto bg-primary rounded-md' : 'hidden'
          }`}
        >
          <Link
            to="/"
            className="block text-white px-3 py-2 rounded-md text-base font-medium hover:bg-secondary hover:text-white"
          >
            Home
          </Link>
          <Link
            to="/about-us"
            className="block text-white px-3 py-2 rounded-md text-base font-medium hover:bg-secondary hover:text-white"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block text-white px-3 py-2 rounded-md text-base font-medium hover:bg-secondary hover:text-white"
          >
            Contact
          </Link>

          {currentUser ? (
            <>
              <Link
                to="/teacher-dashboard"
                className="block text-white px-3 py-2 border border-white my-4 md:my-0 rounded-md bg-accent text-base font-medium hover:bg-secondary hover:text-white"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block text-white px-3 py-2 rounded-md bg-purple-700 border-accent border text-base font-medium hover:bg-secondary hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block text-white px-3 py-2 border border-white my-4 md:my-0 rounded-md bg-accent text-base font-medium hover:bg-secondary hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block text-white px-3 py-2 rounded-md bg-purple-700 border-accent border text-base font-medium hover:bg-secondary hover:text-white"
              >
                Register
              </Link>
              {/* <Link
                to="/admin-login"
                className="block text-white px-3 py-2 rounded-md  border-accent border text-base font-medium hover:bg-secondary hover:text-white"
              >
                Admin Login
              </Link> */}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
