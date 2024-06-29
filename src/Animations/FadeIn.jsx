/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';

export const FadeIn = ({ children, duration }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      exit={{ opacity: 0 }}
      transition={{ duration: duration || 1, ease: 'easeIn' }}
    >
      {children}
    </motion.div>
  );
};
