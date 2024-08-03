// Home.jsx
import React from 'react';
import WelcomeSection from './WelcomeSection';
import HowItWorksSection from './HowItWorksSection';
import TeamSection from './TeamSection';
import Footer from './Footer';
import AdminDashboard from './admin/AdminDashboard';

const Home = () => {
  return (
    <div className=' relative top-28  w-screen overflow-hidden  '>
      <WelcomeSection />
      <HowItWorksSection />
      <TeamSection />
      <AdminDashboard/>
      <Footer />
    </div>
  );
};

export default Home;
