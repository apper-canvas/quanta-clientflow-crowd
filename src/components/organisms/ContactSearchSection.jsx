import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import ContactListItem from '@/components/molecules/ContactListItem';

const ContactSearchSection = ({ searchTerm, setSearchTerm, filteredContacts }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Search Input */}
            <div className="relative">
                <ApperIcon name="Search" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search contacts by name, email, or company..."
                    className="w-full pl-12 pr-4 py-3"
                />
            </div>

            {/* Search Results */}
            <div className="space-y-3">
                {searchTerm ? (
                    filteredContacts.length > 0 ? (
                        filteredContacts.slice(0, 5).map((contact, index) => (
                            <ContactListItem key={contact.id} contact={contact} index={index} />
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <ApperIcon name="SearchX" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                            <p className="text-surface-500 dark:text-surface-400">
                                No contacts found for "{searchTerm}"
                            </p>
                        </div>
                    )
                ) : (
                    <div className="text-center py-8">
                        <ApperIcon name="Search" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                        <p className="text-surface-500 dark:text-surface-400">
                            Start typing to search your contacts
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ContactSearchSection;