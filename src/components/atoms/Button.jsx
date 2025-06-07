import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ onClick, children, className = '', type = 'button', disabled = false, whileHover, whileTap, ...props }) => {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            className={`transition-all ${className}`}
            disabled={disabled}
            whileHover={whileHover || { scale: 1.02 }}
            whileTap={whileTap || { scale: 0.98 }}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;