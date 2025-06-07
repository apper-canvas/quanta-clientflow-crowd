import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-surface-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="mb-8"
        >
          <ApperIcon name="SearchX" className="w-24 h-24 text-surface-300 mx-auto" />
        </motion.div>
        
        <h1 className="text-4xl font-heading font-bold text-surface-900 dark:text-white mb-4">
          404
        </h1>
        
        <h2 className="text-xl font-semibold text-surface-700 dark:text-surface-300 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-surface-500 dark:text-surface-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <motion.button
          onClick={() => window.history.back()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium shadow-soft hover:shadow-card transition-all inline-flex items-center space-x-2"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4" />
          <span>Go Back</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;