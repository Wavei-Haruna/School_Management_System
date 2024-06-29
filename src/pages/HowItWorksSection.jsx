import React from 'react';
import { motion as m } from 'framer-motion';
import { FaChalkboardTeacher, FaUserPlus, FaClipboardList, FaPrint, FaSearch, FaEdit } from 'react-icons/fa';
import { CardItems, cardContainer, } from '../Animations/Variance';
import { FaDeleteLeft, FaUserGear } from 'react-icons/fa6';
import SlideInRight from '../Animations/SlideInRight';

const HowItWorksSection = () => {
  const items = [
   { icon: <FaUserGear />, title: 'Register', description: 'Create an account with us' },
    { icon: <FaChalkboardTeacher />, title: 'Create a Class', description: 'Register with us and create a new class.' },
    { icon: <FaUserPlus />, title: 'Add Students', description: 'Enroll students into your created class.' },
    { icon: <FaClipboardList />, title: 'Enter Marks', description: 'Record and manage students\' marks.' },
    { icon: <FaPrint />, title: 'Generate Report Cards', description: 'Print detailed report cards for students.' },
     { icon: <FaSearch />, title: 'Filter Students', description: 'Use our Advance algorithms to filter students' },
      { icon: <FaDeleteLeft />, title: 'Remove students', description: 'Remove students when any time' },
       { icon: <FaEdit />, title: 'Update Records', description: 'Modify any record that you have entered' },
       
  ];

  return (
    <section className="text-black  relative max-w-7xl mx-auto my-64">
      <h3 className="font-header text-2xl font-bold md:text-4xl w-fit py-2 text-white text-center mb-10 border-b-[4px] border-b-accent">How It Works</h3>
      <SlideInRight>
      <m.div variants={cardContainer} initial={'hidden'} whileInView={'show'} className="container relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 overflow-hidden">
        {items.map((item, index) => (
          
          <m.div key={index} variants={CardItems} className="relative bg-secondary rounded-xl shadow-md p-6 text-center transform transition-transform hover:scale-105 overflow-hidden">
            <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            <div className="bg-primary text-5xl text-white p-6 rounded-full inline-block mb-4">
              {item.icon}
            </div>
            <h3 className="text-xl font-body text-white font-semibold mb-2">{item.title}</h3>
            <p className="text-base text-white">{item.description}</p>
          </m.div>
        ))}
      </m.div>
      </SlideInRight>
    </section>
  );
};

export default HowItWorksSection;
