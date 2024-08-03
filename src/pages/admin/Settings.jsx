import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const Settings = () => {
  const [settings, setSettings] = useState({ schoolName: '', address: '', contactEmail: '' });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const settingsRef = doc(db, 'settings', 'schoolSettings');
      await updateDoc(settingsRef, settings);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="font-header text-2xl font-bold md:text-4xl w-fit py-2 text-white text-center mb-10 border-b-[4px] border-b-accent">Settings</h2>
      <form onSubmit={handleSaveSettings} className="bg-primary p-6 rounded shadow-lg flex flex-col space-y-4">
        <div>
          <label className="block text-white">School Name</label>
          <input
            type="text"
            name="schoolName"
            value={settings.schoolName}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-white">Address</label>
          <input
            type="text"
            name="address"
            value={settings.address}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-white">Contact Email</label>
          <input
            type="email"
            name="contactEmail"
            value={settings.contactEmail}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded shadow hover:bg-blue-600 transition duration-300">
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default Settings;
