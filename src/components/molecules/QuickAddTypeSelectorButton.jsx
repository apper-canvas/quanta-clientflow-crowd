import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const QuickAddTypeSelectorButton = ({ typeKey, label, icon, isSelected, onClick }) => {
    return (
        <Button
            onClick={() => onClick(typeKey)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium ${
                isSelected
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-soft'
                    : 'bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <ApperIcon name={icon} className="w-4 h-4" />
            <span>{label}</span>
        </Button>
    );
};

export default QuickAddTypeSelectorButton;