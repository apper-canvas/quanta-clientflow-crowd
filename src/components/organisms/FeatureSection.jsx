import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { contactService, dealService, activityService } from '@/services';

import TabHeaderButton from '@/components/molecules/TabHeaderButton';
import QuickAddForm from '@/components/organisms/QuickAddForm';
import ContactSearchSection from '@/components/organisms/ContactSearchSection';
import OverviewDashboard from '@/components/organisms/OverviewDashboard';

const FeatureSection = () => {
  const [activeTab, setActiveTab] = useState('quick-add');
  const [contacts, setContacts] = useState([]);
  const [recentDeals, setRecentDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Quick Add Form State
  const [quickAdd, setQuickAdd] = useState({
    type: 'contact',
    name: '',
    email: '',
    phone: '',
    company: '',
    dealTitle: '',
    dealValue: '',
    activityType: 'call',
    activityDescription: ''
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [contactsData, dealsData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll()
      ]);
      setContacts(contactsData);
      setRecentDeals(dealsData.slice(0, 5));
    } catch (err) {
      console.error('Failed to load data:', err);
      toast.error('Failed to load data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (quickAdd.type === 'contact') {
        const newContact = await contactService.create({
          name: quickAdd.name,
          email: quickAdd.email,
          phone: quickAdd.phone,
          company: quickAdd.company,
          tags: [],
          createdAt: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        });
        setContacts([newContact, ...contacts]);
        toast.success('Contact added successfully!');
      } else if (quickAdd.type === 'deal') {
        const newDeal = await dealService.create({
          title: quickAdd.dealTitle,
          value: parseFloat(quickAdd.dealValue) || 0,
          stage: 'lead',
          contactId: '',
          probability: 10,
          expectedClose: '',
          createdAt: new Date().toISOString()
        });
        setRecentDeals([newDeal, ...recentDeals.slice(0, 4)]);
        toast.success('Deal added successfully!');
      } else if (quickAdd.type === 'activity') {
        await activityService.create({
          type: quickAdd.activityType,
          contactId: '',
          dealId: '',
          description: quickAdd.activityDescription,
          date: new Date().toISOString(),
          completed: false
        });
        toast.success('Activity logged successfully!');
      }

      // Reset form
      setQuickAdd({
        type: 'contact',
        name: '',
        email: '',
        phone: '',
        company: '',
        dealTitle: '',
        dealValue: '',
        activityType: 'call',
        activityDescription: ''
      });
    } catch (err) {
      toast.error('Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    {
      id: 'quick-add',
      label: 'Quick Add',
      icon: 'Plus',
      description: 'Quickly add contacts, deals, or activities'
    },
    {
      id: 'search',
      label: 'Search',
      icon: 'Search',
      description: 'Find contacts and information instantly'
    },
    {
      id: 'overview',
      label: 'Overview',
      icon: 'BarChart3',
      description: 'View recent deals and activity'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-surface-800 rounded-2xl shadow-neu-light dark:shadow-neu-dark border border-surface-200 dark:border-surface-700 overflow-hidden"
      >
        {/* Tab Navigation */}
        <div className="border-b border-surface-200 dark:border-surface-700">
          <div className="flex">
            {tabs.map((tab) => (
              <TabHeaderButton
                key={tab.id}
                id={tab.id}
                label={tab.label}
                icon={tab.icon}
                description={tab.description}
                isActive={activeTab === tab.id}
                onClick={setActiveTab}
              />
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'quick-add' && (
              <QuickAddForm
                key="quick-add"
                quickAdd={quickAdd}
                setQuickAdd={setQuickAdd}
                handleQuickAdd={handleQuickAdd}
                loading={loading}
              />
            )}
            {activeTab === 'search' && (
              <ContactSearchSection
                key="search"
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filteredContacts={filteredContacts}
              />
            )}
            {activeTab === 'overview' && (
              <OverviewDashboard
                key="overview"
                contacts={contacts}
                recentDeals={recentDeals}
                loading={loading}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default FeatureSection;