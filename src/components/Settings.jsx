import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { updateProfile } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


export default function Settings() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser.displayName || '');

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(currentUser, { displayName });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleLogout = () => {
    // Implement logout logic here
    toast.success('Logged out successfully');
    navigate('/login'); // Navigate to login page after logout
  };

  return (
    <div className="p-4">
      <h2 className="font-header text-2xl font-bold md:text-4xl w-fit py-2 text-white text-center mb-10 border-b-[4px] border-b-accent">Settings</h2>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-white mb-2">Display Name</label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-3 text-sm border rounded shadow-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded shadow hover:bg-blue-600 transition duration-300">
            Update Profile
          </button>
        </form>
        <button onClick={handleLogout} className="w-full mt-4 bg-red-500 text-white p-3 rounded shadow hover:bg-red-600 transition duration-300">
          Logout
        </button>
      </div>
    </div>
  );
}
