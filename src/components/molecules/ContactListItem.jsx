import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ContactListItem = ({ contact, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 p-3 bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 hover:shadow-soft transition-all"
        >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                    {contact.name.charAt(0).toUpperCase()}
                </span>
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-surface-900 dark:text-white truncate">
                    {contact.name}
                </h4>
                <p className="text-sm text-surface-600 dark:text-surface-400 truncate">
                    {contact.email} • {contact.company || 'No company'}
                </p>
            </div>
            <Button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors">
                <ApperIcon name="ExternalLink" className="w-4 h-4 text-surface-400" />
            </Button>
        </motion.div>
    );
};

export default ContactListItem;