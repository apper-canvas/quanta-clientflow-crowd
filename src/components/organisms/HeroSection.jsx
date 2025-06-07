import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const HeroSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-12"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6"
      >
        <ApperIcon name="Users" className="w-8 h-8 text-white" />
      </motion.div>
      
      <h1 className="text-4xl md:text-5xl font-heading font-bold text-surface-900 dark:text-white mb-4">
        Welcome to{' '}
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          ClientFlow
        </span>
      </h1>
      
      <p className="text-xl text-surface-600 dark:text-surface-400 max-w-2xl mx-auto mb-8">
        Streamline your customer relationships with our intuitive CRM designed for small businesses.
        Manage contacts, track deals, and close more sales with ease.
      </p>
    </motion.div>
  );
};

export default HeroSection;