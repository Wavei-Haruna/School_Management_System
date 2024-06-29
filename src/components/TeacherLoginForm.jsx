import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you are using React Router for navigation
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify'; // Ensure you have ToastContainer imported at a higher level
import { FaSpinner } from 'react-icons/fa';

const TeacherLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {

    e.preventDefault();
    setLoading(true)

    const { email, password } = formData;

    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false)
      toast.success('Login successful');
      // Navigate to Teacher Dashboard or any other page after successful login
      navigate('/teacher-dashboard'); // Replace with your actual route
    } catch (error) {
      toast.error('Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 relative top-64 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Teacher Login</h2>
      <form onSubmit={handleLogin} className="grid grid-cols-1 gap-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border-gray-300 border py-2 px-2 focus:outline-none rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border-gray-300 border py-2 px-2 focus:outline-none rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
      
        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-primary text-white py-2 px-4 rounded-md shadow-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {loading ? <FaSpinner className="animate-spin" />: 'Login'} 
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeacherLogin;
