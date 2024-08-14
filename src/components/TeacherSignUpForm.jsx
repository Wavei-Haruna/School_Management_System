import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore'; // Use setDoc instead of addDoc
import { db, auth } from '../../firebase';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router';

export default function TeacherSignUpForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    schoolName: '',
    subject: '',
    town: '',
    phoneNumber: '',
    agreeTerms: false,
    showPassword: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const togglePasswordVisibility = () => {
    setFormData({ ...formData, showPassword: !formData.showPassword });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, town, phoneNumber, agreeTerms } = formData;

    if (!agreeTerms) {
      toast.error('Please agree to the terms and conditions.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user details to Firestore
      await setDoc(doc(db, 'teachers', user.uid), {
        name,
        email,
        town,
        phoneNumber,
        role: 'teacher',
        timeStamp: serverTimestamp(),
        uid: user.uid,
      });

      toast.success('Account created successfully!');
      navigate("/teacher-dashboard");
    } catch (error) {
      console.error('Error signing up:', error.message);
      toast.error(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Add user details to Firestore
      await setDoc(doc(db, 'teachers', user.uid), {
        name: user.displayName,
        email: user.email,
        town: '',
        phoneNumber: user.phoneNumber || '',
        role: 'teacher',
        timeStamp: serverTimestamp(),
        uid: user.uid,
      });

      toast.success('Signed in with Google successfully!');
      navigate("/teacher-dashboard");
    } catch (error) {
      console.error('Error with Google sign-in:', error.message);
      toast.error(error.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      toast.error('Please enter your email to reset the password.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, formData.email);
      toast.success('Password reset email sent!');
    } catch (error) {
      console.error('Error sending password reset email:', error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 top-32 relative bg-white p-6 rounded-lg shadow-md">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4 text-center">Teacher Sign Up</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {/* Name */}
        <div className="col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border-gray-300 border py-2 px-2 focus:outline-none rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>

        {/* Email */}
        <div className="col-span-2">
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
        <div className="col-span-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              type={formData.showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border-gray-300 border py-2 px-2 focus:outline-none rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm pr-10"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 hover:text-primary focus:outline-none"
            >
              {formData.showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        {/* Town */}
        <div className="col-span-2">
          <label htmlFor="town" className="block text-sm font-medium text-gray-700">
            Town
          </label>
          <input
            type="text"
            id="town"
            name="town"
            value={formData.town}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border-gray-300 border py-2 px-2 focus:outline-none rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>

        {/* Phone Number */}
        <div className="col-span-2">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border-gray-300 border py-2 px-2 focus:outline-none rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>

        {/* Agree to Terms */}
        <div className="col-span-2 flex items-center">
          <input
            type="checkbox"
            id="agreeTerms"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleInputChange}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-900">
            I agree to the{' '}
            <a href="/terms" className="text-primary hover:underline">
              terms and conditions
            </a>
          </label>
        </div>

        {/* Submit Button */}
        <div className="col-span-2">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-white rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Sign Up
          </button>
        </div>
      </form>

      {/* Google Sign-In Button */}
      <div className="col-span-2 mt-4">
        <button
          onClick={handleGoogleSignIn}
          className="w-full py-2 px-4 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Sign Up with Google
        </button>
      </div>

      {/* Reset Password Link */}
      <div className="col-span-2 mt-4 text-center">
        <button
          onClick={handlePasswordReset}
          className="text-primary hover:underline focus:outline-none"
        >
          Forgot Password? Reset here
        </button>
      </div>
    </div>
  );
}
