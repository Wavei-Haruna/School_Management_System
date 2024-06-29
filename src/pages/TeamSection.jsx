import React from 'react';
import Team from "../assets/Team.png";
import { motion as m } from 'framer-motion';
import SlideIn from '../Animations/SlideIn';
import SlideInLeft from '../Animations/SlideInLeft';

export default function TeamSection() {
  return (
    <m.section className="max-w-7xl mx-auto ">
      <SlideIn>
        <h3 className="font-header text-2xl font-bold md:text-4xl w-fit py-2 text-white text-center mb-10 border-b-[4px] border-b-accent">Our Team</h3>
      </SlideIn>
      <SlideInLeft>
        <m.div className="flex justify-center">
          <img src={Team} alt="Team" className="w-full  rounded-lg  object-cover" />
        </m.div>
      </SlideInLeft>
    </m.section>
  );
}
