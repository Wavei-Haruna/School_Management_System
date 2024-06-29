/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';

const SlideIn = ({ children, duration, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: duration || 1, delay: delay || 0 }}
      viewport={{ once: false }}
    >
      {children}
    </motion.div>
  );
};

export default SlideIn;
