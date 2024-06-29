/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { navItems } from '../utils';

const MobileNav = ({ showMenu, setShowMenu, isActive, setIsActive }) => {
  const variants = {
    open: {
      opacity: 1,
      transition: {
        transition: { type: 'spring', stiffness: 300, damping: 24 },
      },
    },
    close: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.nav
      initial={false}
      animate={showMenu ? 'open' : 'close'}
      className={`${
        !showMenu && 'hidden'
      }  absolute left-0 top-0 mt-[14vh] w-full  items-center justify-between bg-white lg:hidden`}
    >
      <div className="absolute inset-0 -z-10 h-screen w-full bg-gray-500  opacity-80  lg:hidden"></div>
      <motion.ul
        variants={{
          open: {
            transition: {
              type: 'spring',
              bounce: 0,
              duration: 0.7,
              delayChildren: 0.3,
              staggerChildren: 0.3,
            },
          },
          close: {
            transition: {
              type: 'spring',
              bounce: 0,
              duration: 0.3,
            },
          },
        }}
        className="mt-4 flex flex-col font-medium lg:mt-0 lg:flex-row lg:space-x-8"
      >
        {navItems.map((item) => (
          <motion.li key={item.id} variants={variants}>
            <Link
              onClick={(e) => {
                e.preventDefault();
                setIsActive(item.id);
                setShowMenu(false);
                let page = document.getElementById(item.title);
                const yOffset = -72;
                const y = page?.getBoundingClientRect()?.top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }}
              className={`${
                isActive === item.id && 'bg-primary text-white'
              } m-2 block   rounded py-2 pl-3 pr-4 transition-all duration-200 ease-in-out hover:bg-primary hover:text-white`}
            >
              {item.title}
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </motion.nav>
  );
};

export default MobileNav;
