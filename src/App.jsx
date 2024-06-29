import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home'; // Example component import
import TeacherSignupForm from './components/TeacherSignUpForm';
import TeacherDashboard from './components/TeacherDashboard';
import TeacherLoginForm from './components/TeacherLoginForm';
import { AuthProvider } from './AuthContext';
import Students from './components/Students';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col  welcome-section px-6 ">
          <Navbar />
          <div className="flex-grow overflow-auto hide-scrollbar">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<TeacherSignupForm />} />
              <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
              <Route path="/login" element={<TeacherLoginForm />} />
              <Route path="/class/:classId/students" element={<Students /> }/>

              {/* Add more routes as needed */}
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
