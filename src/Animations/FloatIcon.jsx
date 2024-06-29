/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';

const FloatIcon = ({ children, x, y, duration, className }) => {
  return (
    <div className={`absolute z-0 opacity-25 ${className}`}>
      <motion.div
        animate={{
          y: y || [0, 200, 0],
          x: x || [0, 100, 200],
        }}
        transition={{
          duration: duration || 20,
          repeat: Infinity,
          repeatType: 'mirror',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default FloatIcon;
