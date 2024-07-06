import React from 'react';
import { motion as m } from 'framer-motion';
import { container, items } from '../Animations/Variance';
import SlideInLeft from '../Animations/SlideInLeft';
import SlideInRight from '../Animations/SlideInRight';
import HeroImg from '../assets/HeroImg.jpg';
import { useNavigate } from 'react-router';

const WelcomeSection = () => {

  const navigate = useNavigate();
  return (
    <section className=' max-w-7xl relative md:top-32 md:my-10 mx-6 md:mx-auto '>
       <SlideInLeft duration={2}>
          <m.h1 variants={items} className="text-center font-header text-3xl font-bold text-white md:text-7xl">
            Welcome to OnlineGrade
          </m.h1>
        </SlideInLeft>
    
      
      <m.div className="z-10 pt-24 relative w-full flex justify-between mx-auto p-4 " variants={container} initial={'hidden'} whileInView={'show'}>
       

      <div className='text-center flex flex-col items-center justify-center'>
        <m.h1 variants={items} className="text-center font-header  text-xl  font-light text-white md:text-2xl">
          We have made it simple, Just sign up and start adding classes,
          Add Students, and Bam everything will be done Grading and ranking of Students,plus remarks.
          Report cards will be generated for your students
        </m.h1>
         <div className='w-full text-center my-6'>
          <button onClick={()=> navigate('/register')} className="bg-primary hover:scale-105 text-white py-3 px-6 rounded-full text-lg font-semibold shadow-md hover:bg-accent transition duration-300">
            Get Started
          </button>
          </div>
          </div>
           <SlideInRight>
        <div className="overflow-hidden hidden md:block rounded-full w-full    mx-6">
          <img src={HeroImg} alt="Hero Image" className="object-cover object-center w-full h-full " />
        </div>
      </SlideInRight>
      </m.div>

     

     
    </section>
  );
};

export default WelcomeSection;
