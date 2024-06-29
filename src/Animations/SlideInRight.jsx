/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';

const SlideInRight = ({ children, initialX, afterX, initialScale, afterScale, duration }) => {
  return (
    <motion.div
      initial={{ right: 0, x: initialX || 200, scale: initialScale || 1.5 }}
      whileInView={{ right: 0, x: afterX || 0, scale: afterScale || 1 }}
      transition={{ duration: duration || 1 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
};

export default SlideInRight;
