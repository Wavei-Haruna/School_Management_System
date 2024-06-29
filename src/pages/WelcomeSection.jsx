import React from 'react';
import { motion as m } from 'framer-motion';
import { container, items } from '../Animations/Variance';
import SlideInLeft from '../Animations/SlideInLeft';
import SlideInRight from '../Animations/SlideInRight';
import HeroImg from '../assets/HeroImg.png';

const WelcomeSection = () => {
  return (
    <section className='flex justify-between max-w-7xl relative md:top-32 md:my-10 mx-auto px-4'>
      <m.div className="z-10 pt-24 relative w-full" variants={container} initial={'hidden'} whileInView={'show'}>
        <SlideInLeft>
          <m.h1 variants={items} className="text-center font-header text-3xl font-bold text-white md:text-7xl">
            Welcome to OnlineGrade
          </m.h1>
        </SlideInLeft>

        <m.h1 variants={items} className="my-8 text-center font-header text-xl font-bold text-white md:text-2xl">
          We Make your work easier, Just click click and Bam
        </m.h1>
        <m.h1 variants={items} className="text-center font-header text-xl font-bold text-white md:text-2xl">
          Report cards will be generated for your students
        </m.h1>
         <div className='w-full text-center my-6'>
          <button className="bg-primary hover:scale-105 text-white py-3 px-6 rounded-full text-lg font-semibold shadow-md hover:bg-accent transition duration-300">
            Get Started
          </button>
          </div>
      </m.div>

      <SlideInRight>
        <div className="overflow-hidden hidden md:block rounded-full ml-10 w-72 h-72 md:w-96 md:h-96">
          <img src={HeroImg} alt="Hero Image" className="object-cover object-center w-full h-full" />
        </div>
      </SlideInRight>
    </section>
  );
};

export default WelcomeSection;
