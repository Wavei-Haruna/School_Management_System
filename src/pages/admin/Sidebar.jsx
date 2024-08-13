import React from 'react';
import { FiUsers, FiSettings, FiBookOpen, FiClipboard } from 'react-icons/fi';
import { MdPerson } from 'react-icons/md';

const Sidebar = ({ setActiveTab, activeTab, isSidebarOpen }) => {
  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div
      className={`sidebar bg-gray-800 text-white h-screen z-50  left-0 overflow-y-auto transition-transform transform ${
        isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'
      }`}
    >
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
      <ul className="mt-6">
        <li
          className={`px-4 py-3 cursor-pointer hover:bg-primary ${
            activeTab === 'teachers' && 'bg-gray-700'
          }`}
          onClick={() => handleSetActiveTab('teachers')}
        >
          <MdPerson className="inline mr-2" />
          Teachers
        </li>
        {/* <li
          className={`px-4 py-3 cursor-pointer hover:bg-primary ${
            activeTab === 'students' && 'bg-gray-700'
          }`}
          onClick={() => handleSetActiveTab('students')}
        >
          <FiUsers className="inline mr-2" />
          Students
        </li> */}
        <li
          className={`px-4 py-3 cursor-pointer hover:bg-primary ${
            activeTab === 'classes' && 'bg-gray-700'
          }`}
          onClick={() => handleSetActiveTab('classes')}
        >
          <FiBookOpen className="inline mr-2" />
          Classes
        </li>
        <li
          className={`px-4 py-3 cursor-pointer hover:bg-primary ${
            activeTab === 'reportCards' && 'bg-gray-700'
          }`}
          onClick={() => handleSetActiveTab('reportCards')}
        >
          <FiClipboard className="inline mr-2" />
          Report Cards
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
