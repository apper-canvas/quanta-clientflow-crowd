import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const TabHeaderButton = ({ id, label, icon, description, isActive, onClick }) => {
    return (
        <Button
            onClick={() => onClick(id)}
            className={`flex-1 px-6 py-4 text-left ${
                isActive
                    ? 'bg-gradient-to-r from-primary/5 to-secondary/5 border-b-2 border-primary'
                    : 'hover:bg-surface-50 dark:hover:bg-surface-700/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isActive
                        ? 'bg-gradient-to-r from-primary to-secondary text-white'
                        : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400'
                }`}>
                    <ApperIcon name={icon} className="w-4 h-4" />
                </div>
                <div>
                    <h3 className={`font-medium ${
                        isActive
                            ? 'text-primary'
                            : 'text-surface-900 dark:text-white'
                    }`}>
                        {label}
                    </h3>
                    <p className="text-sm text-surface-600 dark:text-surface-400">
                        {description}
                    </p>
                </div>
            </div>
        </Button>
    );
};

export default TabHeaderButton;