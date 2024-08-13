import React from 'react';
import { FiUsers, FiBook, FiSettings } from 'react-icons/fi';
import { MdFamilyRestroom } from 'react-icons/md';

const Sidebar = ({ setActiveTab, activeTab }) => {
  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="sidebar bg-gray-800 text-white h-screen w-64 fixed left-0 overflow-y-auto">
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
      </div>
      <ul className="mt-6">
        {/* <li
          className={`px-4 py-3 cursor-pointer hover:bg-primary ${
            activeTab === 'students' && 'bg-gray-700'
          }`}
          onClick={() => handleSetActiveTab('students')}
        >
          <FiUsers className="inline mr-2" />
          Students
        </li> */}
        {/* <li
          className={`px-4 py-3 cursor-pointer hover:bg-primary ${
            activeTab === 'grades' && 'bg-gray-700'
          }`}
          onClick={() => handleSetActiveTab('grades')}
        >
          <FiBook className="inline mr-2" />
          Grades
        </li> */}
        <li
          className={`px-4 py-3 cursor-pointer hover:bg-primary ${
            activeTab === 'classes' && 'bg-gray-700'
          }`}
          onClick={() => handleSetActiveTab('classes')}
        >
          <MdFamilyRestroom className="inline mr-2" />
          Classes
        </li>
        <li
          className={`px-4 py-3 cursor-pointer hover:bg-primary ${
            activeTab === 'settings' && 'bg-gray-700'
          }`}
          onClick={() => handleSetActiveTab('settings')}
        >
          <FiSettings className="inline mr-2" />
          Settings
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
