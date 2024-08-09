import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Teachers from './Teachers';
import Students from './Students';
import Classes from './Classes';
import ReportCards from './ReportCards';
import Settings from './Settings';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('teachers');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'teachers':
        return <Teachers />;
      case 'students':
        return <Students />;
      case 'classes':
        return <Classes />;
      case 'reportCards':
        return <ReportCards />;
      case 'settings':
        return <Settings />;
      default:
        return <Teachers />;
    }
  };

  return (
    <div className="flex relative w-full h-screen mx-auto bg-gray-400 text-secondary top-24">
      <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} isSidebarOpen={isSidebarOpen} />
      <div className={`main-content flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-2' : 'ml-0'}`}>
        <Topbar toggleSidebar={toggleSidebar} />
        <div className="p-6">{renderActiveTab()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
