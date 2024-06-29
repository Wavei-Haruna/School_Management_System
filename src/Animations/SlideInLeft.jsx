/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';

const SlideInLeft = ({ children, initialX, afterX, duration, delay }) => {
  return (
    <motion.div
      initial={{ x: initialX || -50, opacity: 0 }}
      whileInView={{ x: afterX || 0, opacity: 1 }}
      transition={{ duration: duration || 0.5, delay: delay || 0 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
};

export default SlideInLeft;
