import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ iconName, iconBgClass, iconColorClass, value, label }) => {
    return (
        <div className="bg-white dark:bg-surface-800 rounded-xl p-4 border border-surface-200 dark:border-surface-700">
            <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBgClass}`}>
                    <ApperIcon name={iconName} className={`w-5 h-5 ${iconColorClass}`} />
                </div>
                <div>
                    <p className="text-2xl font-bold text-surface-900 dark:text-white">
                        {value}
                    </p>
                    <p className="text-sm text-surface-600 dark:text-surface-400">{label}</p>
                </div>
            </div>
        </div>
    );
};

export default StatCard;