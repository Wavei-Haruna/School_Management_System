// Dashboard.jsx

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Students from './Students';
import Grades from './Grades';
import Settings from './Settings';

import AssignedClasses from './AssignedClasses';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('classes');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
     
      
      case 'classes':
        return <AssignedClasses/>;
      case 'settings':
        return <Settings />;
      default:
        return <Students />;
    }
  };

  return (
    <div className="flex  relative w-screen top-24">
      {isSidebarOpen && <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />}
      <div className={`main-content flex-1 `}>
        <Topbar toggleSidebar={toggleSidebar} />
        <div className="p-6 mx-auto container">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
