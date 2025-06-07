import React from 'react';

const Input = ({ className = '', ...props }) => {
    return (
        <input
            className={`w-full px-4 py-3 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${className}`}
            {...props}
        />
    );
};

export default Input;