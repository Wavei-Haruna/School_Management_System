import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home'; // Example component import
import TeacherSignupForm from './components/TeacherSignUpForm';
import TeacherDashboard from './components/TeacherDashboard';
import TeacherLoginForm from './components/TeacherLoginForm';
import { AuthProvider } from './AuthContext';
import Students from './components/Students';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/Contact';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className=" welcome-section ">
          <Navbar />
          <div className=" hide-scrollbar">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
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
