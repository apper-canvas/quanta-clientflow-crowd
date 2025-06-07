import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import QuickAddTypeSelectorButton from '@/components/molecules/QuickAddTypeSelectorButton';

const QuickAddForm = ({ quickAdd, setQuickAdd, handleQuickAdd, loading }) => {
    const activityTypes = [
        { key: 'call', label: 'Call', icon: 'Phone' },
        { key: 'email', label: 'Email', icon: 'Mail' },
        { key: 'meeting', label: 'Meeting', icon: 'Calendar' },
        { key: 'note', label: 'Note', icon: 'FileText' }
    ];

    const entityTypes = [
        { key: 'contact', label: 'Contact', icon: 'User' },
        { key: 'deal', label: 'Deal', icon: 'Target' },
        { key: 'activity', label: 'Activity', icon: 'Activity' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Type Selector */}
            <div className="flex flex-wrap gap-3">
                {entityTypes.map(({ key, label, icon }) => (
                    <QuickAddTypeSelectorButton
                        key={key}
                        typeKey={key}
                        label={label}
                        icon={icon}
                        isSelected={quickAdd.type === key}
                        onClick={(selectedKey) => setQuickAdd({ ...quickAdd, type: selectedKey })}
                    />
                ))}
            </div>

            {/* Dynamic Form */}
            <form onSubmit={handleQuickAdd} className="space-y-4">
                <AnimatePresence mode="wait">
                    {quickAdd.type === 'contact' && (
                        <motion.div
                            key="contact"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            <FormField
                                label="Full Name *"
                                placeholder="Full Name"
                                type="text"
                                required
                                value={quickAdd.name}
                                onChange={(e) => setQuickAdd({ ...quickAdd, name: e.target.value })}
                            />
                            <FormField
                                label="Email Address *"
                                placeholder="Email Address"
                                type="email"
                                required
                                value={quickAdd.email}
                                onChange={(e) => setQuickAdd({ ...quickAdd, email: e.target.value })}
                            />
                            <FormField
                                label="Phone Number"
                                placeholder="Phone Number"
                                type="tel"
                                value={quickAdd.phone}
                                onChange={(e) => setQuickAdd({ ...quickAdd, phone: e.target.value })}
                            />
                            <FormField
                                label="Company"
                                placeholder="Company"
                                type="text"
                                value={quickAdd.company}
                                onChange={(e) => setQuickAdd({ ...quickAdd, company: e.target.value })}
                            />
                        </motion.div>
                    )}

                    {quickAdd.type === 'deal' && (
                        <motion.div
                            key="deal"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            <FormField
                                label="Deal Title *"
                                placeholder="Deal Title"
                                type="text"
                                required
                                value={quickAdd.dealTitle}
                                onChange={(e) => setQuickAdd({ ...quickAdd, dealTitle: e.target.value })}
                                className="md:col-span-2"
                            />
                            <FormField
                                label="Deal Value ($) *"
                                placeholder="Deal Value"
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={quickAdd.dealValue}
                                onChange={(e) => setQuickAdd({ ...quickAdd, dealValue: e.target.value })}
                            />
                        </motion.div>
                    )}

                    {quickAdd.type === 'activity' && (
                        <motion.div
                            key="activity"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <div className="flex flex-wrap gap-3">
                                {activityTypes.map(({ key, label, icon }) => (
                                    <Button
                                        key={key}
                                        type="button"
                                        onClick={() => setQuickAdd({ ...quickAdd, activityType: key })}
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
                                            quickAdd.activityType === key
                                                ? 'bg-secondary text-white'
                                                : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                                        }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <ApperIcon name={icon} className="w-3 h-3" />
                                        <span>{label}</span>
                                    </Button>
                                ))}
                            </div>
                            <FormField
                                label="Activity Description *"
                                placeholder="Activity Description"
                                multiline
                                required
                                rows={3}
                                value={quickAdd.activityDescription}
                                onChange={(e) => setQuickAdd({ ...quickAdd, activityDescription: e.target.value })}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-6 rounded-xl font-medium shadow-soft hover:shadow-card disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Adding...</span>
                        </>
                    ) : (
                        <>
                            <ApperIcon name="Plus" className="w-4 h-4" />
                            <span>Add {quickAdd.type.charAt(0).toUpperCase() + quickAdd.type.slice(1)}</span>
                        </>
                    )}
                </Button>
            </form>
        </motion.div>
    );
};

export default QuickAddForm;