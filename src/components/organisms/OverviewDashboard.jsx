import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import StatCard from '@/components/molecules/StatCard';
import DealListItem from '@/components/molecules/DealListItem';

const OverviewDashboard = ({ contacts, recentDeals }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard 
                    iconName="Users" 
                    iconBgClass="bg-primary/10" 
                    iconColorClass="text-primary" 
                    value={contacts.length} 
                    label="Total Contacts" 
                />
                <StatCard 
                    iconName="Target" 
                    iconBgClass="bg-secondary/10" 
                    iconColorClass="text-secondary" 
                    value={recentDeals.length} 
                    label="Recent Deals" 
                />
                <StatCard 
                    iconName="DollarSign" 
                    iconBgClass="bg-success/10" 
                    iconColorClass="text-success" 
                    value={`$${recentDeals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}`} 
                    label="Pipeline Value" 
                />
            </div>

            {/* Recent Deals */}
            <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700">
                <div className="p-4 border-b border-surface-200 dark:border-surface-700">
                    <h3 className="font-semibold text-surface-900 dark:text-white">Recent Deals</h3>
                </div>
                <div className="p-4 space-y-3">
                    {recentDeals.length > 0 ? (
                        recentDeals.map((deal, index) => (
                            <DealListItem key={deal.id} deal={deal} index={index} />
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <ApperIcon name="Target" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                            <p className="text-surface-500 dark:text-surface-400">
                                No deals yet. Add your first deal to get started!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default OverviewDashboard;