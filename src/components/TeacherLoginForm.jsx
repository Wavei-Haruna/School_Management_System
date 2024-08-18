import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import { useAuth } from '../AuthContext';

const TeacherLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth(); // Access the setCurrentUser function from context
  const db = getFirestore(); // Initialize Firestore

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { email, password } = formData;

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setCurrentUser(user); // Set the current user in context

      // Fetch the user's role from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;

        // Redirect based on role
        if (role === 'admin') {
          toast.success('Admin login successful');
          navigate('/admin-dashboard');
        } else if (role === 'teacher') {
          toast.success('Teacher login successful');
          navigate('/teacher-dashboard');
        } else {
          toast.error('Access denied. Invalid role.');
        }
      } else {
        toast.error('User data not found.');
      }
    } catch (error) {
      toast.error('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast.error('Please enter your email to reset password');
      return;
    }

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, formData.email);
      toast.success('Password reset email sent. Please check your inbox.');
    } catch (error) {
      toast.error('Failed to send password reset email. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      setCurrentUser(userCredential.user); // Set the current user in context

      // Fetch the user's role from Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;

        // Redirect based on role
        if (role === 'admin') {
          toast.success('Login with Google successful (Admin)');
          navigate('/admin-dashboard');
        } else if (role === 'teacher') {
          toast.success('Login with Google successful (Teacher)');
          navigate('/teacher-dashboard');
        } else {
          toast.error('Access denied. Invalid role.');
        }
      } else {
        toast.error('User data not found.');
      }
    } catch (error) {
      toast.error('Failed to log in with Google.');
    } finally {
      setLoading(false);
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

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-primary font-semibold hover:underline"
          >
            Forgot Password?
          </button>
          <button
            type="submit"
            className="bg-primary text-white py-2 px-4 rounded-md shadow-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {loading ? <FaSpinner className="animate-spin" /> : 'Login'}
          </button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="bg-red-500 text-white py-2 px-4 rounded-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {loading ? <FaSpinner className="animate-spin" /> : 'Login with Google'}
        </button>
      </div>
    </div>
  );
};

export default TeacherLogin;
