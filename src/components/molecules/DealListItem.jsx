import React from 'react';
import { motion } from 'framer-motion';

const DealListItem = ({ deal, index }) => {
    return (
        <motion.div
            key={deal.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 hover:bg-surface-50 dark:hover:bg-surface-700/50 rounded-lg transition-colors"
        >
            <div>
                <h4 className="font-medium text-surface-900 dark:text-white">
                    {deal.title}
                </h4>
                <p className="text-sm text-surface-600 dark:text-surface-400">
                    Stage: {deal.stage.replace('-', ' ')}
                </p>
            </div>
            <div className="text-right">
                <p className="font-bold text-success">
                    ${deal.value.toLocaleString()}
                </p>
                <p className="text-xs text-surface-500 dark:text-surface-400">
                    {deal.probability}% likely
                </p>
            </div>
        </motion.div>
    );
};

export default DealListItem;