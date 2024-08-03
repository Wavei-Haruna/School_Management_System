import React from 'react';
import { FiMenu } from 'react-icons/fi';

const Topbar = ({ toggleSidebar }) => {
  return (
    <div className="topbar bg-gray-800 text-white p-4 flex justify-between items-center">
      <button onClick={toggleSidebar} className="text-white focus:outline-none">
        <FiMenu className="text-2xl" />
      </button>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
    </div>
  );
};

export default Topbar;
