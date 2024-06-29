// Dashboard.jsx

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Students from './Students';
import Grades from './Grades';
import Settings from './Settings';
import Classes from './Classes';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'students':
        return <Students />;
      case 'grades':
        return <Grades />;
      case 'classes':
        return <Classes />;
      case 'settings':
        return <Settings />;
      default:
        return <Students />;
    }
  };

  return (
    <div className="flex  relative w-screen top-24">
      {isSidebarOpen && <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />}
      <div className={`main-content flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Topbar toggleSidebar={toggleSidebar} />
        <div className="p-6">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
