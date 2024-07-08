// Topbar.jsx

import React from 'react';
import { FiMenu } from 'react-icons/fi'; // Example icon, adjust as needed

const Topbar = ({ toggleSidebar }) => {
  return (
    <div className="topbar  ml-72 bg-gray-900 text-white h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <button
          className="mr-4 text-xl"
          onClick={toggleSidebar}
        >
          <FiMenu />
        </button>
        <h2 className="text-xl font-bold">Teacher Dashboard</h2>
      </div>
      <div>
        {/* Add any additional topbar elements like profile dropdown, notifications, etc. */}
      </div>
    </div>
  );
};

export default Topbar;
