import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { contactService, dealService, activityService } from '../services';

const MainFeature = () => {
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

  const QuickAddContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Type Selector */}
      <div className="flex flex-wrap gap-3">
        {[
          { key: 'contact', label: 'Contact', icon: 'User' },
          { key: 'deal', label: 'Deal', icon: 'Target' },
          { key: 'activity', label: 'Activity', icon: 'Activity' }
        ].map(({ key, label, icon }) => (
          <motion.button
            key={key}
            onClick={() => setQuickAdd({ ...quickAdd, type: key })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
              quickAdd.type === key
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-soft'
                : 'bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700'
            }`}
          >
            <ApperIcon name={icon} className="w-4 h-4" />
            <span>{label}</span>
          </motion.button>
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
              <div className="relative">
                <input
                  type="text"
                  required
                  value={quickAdd.name}
                  onChange={(e) => setQuickAdd({ ...quickAdd, name: e.target.value })}
                  className="w-full px-4 py-3 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none peer placeholder-transparent"
                  placeholder="Full Name"
                />
                <label className="absolute left-4 -top-2.5 bg-white dark:bg-surface-800 px-2 text-sm text-surface-600 dark:text-surface-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-surface-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary">
                  Full Name *
                </label>
              </div>

              <div className="relative">
                <input
                  type="email"
                  required
                  value={quickAdd.email}
                  onChange={(e) => setQuickAdd({ ...quickAdd, email: e.target.value })}
                  className="w-full px-4 py-3 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none peer placeholder-transparent"
                  placeholder="Email Address"
                />
                <label className="absolute left-4 -top-2.5 bg-white dark:bg-surface-800 px-2 text-sm text-surface-600 dark:text-surface-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-surface-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary">
                  Email Address *
                </label>
              </div>

              <div className="relative">
                <input
                  type="tel"
                  value={quickAdd.phone}
                  onChange={(e) => setQuickAdd({ ...quickAdd, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none peer placeholder-transparent"
                  placeholder="Phone Number"
                />
                <label className="absolute left-4 -top-2.5 bg-white dark:bg-surface-800 px-2 text-sm text-surface-600 dark:text-surface-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-surface-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary">
                  Phone Number
                </label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={quickAdd.company}
                  onChange={(e) => setQuickAdd({ ...quickAdd, company: e.target.value })}
                  className="w-full px-4 py-3 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none peer placeholder-transparent"
                  placeholder="Company"
                />
                <label className="absolute left-4 -top-2.5 bg-white dark:bg-surface-800 px-2 text-sm text-surface-600 dark:text-surface-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-surface-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary">
                  Company
                </label>
              </div>
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
              <div className="relative md:col-span-2">
                <input
                  type="text"
                  required
                  value={quickAdd.dealTitle}
                  onChange={(e) => setQuickAdd({ ...quickAdd, dealTitle: e.target.value })}
                  className="w-full px-4 py-3 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none peer placeholder-transparent"
                  placeholder="Deal Title"
                />
                <label className="absolute left-4 -top-2.5 bg-white dark:bg-surface-800 px-2 text-sm text-surface-600 dark:text-surface-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-surface-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary">
                  Deal Title *
                </label>
              </div>

              <div className="relative">
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={quickAdd.dealValue}
                  onChange={(e) => setQuickAdd({ ...quickAdd, dealValue: e.target.value })}
                  className="w-full px-4 py-3 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none peer placeholder-transparent"
                  placeholder="Deal Value"
                />
                <label className="absolute left-4 -top-2.5 bg-white dark:bg-surface-800 px-2 text-sm text-surface-600 dark:text-surface-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-surface-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary">
                  Deal Value ($) *
                </label>
              </div>
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
                {[
                  { key: 'call', label: 'Call', icon: 'Phone' },
                  { key: 'email', label: 'Email', icon: 'Mail' },
                  { key: 'meeting', label: 'Meeting', icon: 'Calendar' },
                  { key: 'note', label: 'Note', icon: 'FileText' }
                ].map(({ key, label, icon }) => (
                  <motion.button
                    key={key}
                    type="button"
                    onClick={() => setQuickAdd({ ...quickAdd, activityType: key })}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      quickAdd.activityType === key
                        ? 'bg-secondary text-white'
                        : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                    }`}
                  >
                    <ApperIcon name={icon} className="w-3 h-3" />
                    <span>{label}</span>
                  </motion.button>
                ))}
              </div>

              <div className="relative">
                <textarea
                  required
                  rows={3}
                  value={quickAdd.activityDescription}
                  onChange={(e) => setQuickAdd({ ...quickAdd, activityDescription: e.target.value })}
                  className="w-full px-4 py-3 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none peer placeholder-transparent resize-none"
                  placeholder="Activity Description"
                />
                <label className="absolute left-4 -top-2.5 bg-white dark:bg-surface-800 px-2 text-sm text-surface-600 dark:text-surface-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-surface-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary">
                  Activity Description *
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-6 rounded-xl font-medium shadow-soft hover:shadow-card transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
        </motion.button>
      </form>
    </motion.div>
  );

  const SearchContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Search Input */}
      <div className="relative">
        <ApperIcon name="Search" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search contacts by name, email, or company..."
          className="w-full pl-12 pr-4 py-3 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
        />
      </div>

      {/* Search Results */}
      <div className="space-y-3">
        {searchTerm ? (
          filteredContacts.length > 0 ? (
            filteredContacts.slice(0, 5).map((contact, index) => (
              <motion.div
                key={contact.id}
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
                <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors">
                  <ApperIcon name="ExternalLink" className="w-4 h-4 text-surface-400" />
                </button>
              </motion.div>
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

  const OverviewContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-surface-800 rounded-xl p-4 border border-surface-200 dark:border-surface-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">
                {contacts.length}
              </p>
              <p className="text-sm text-surface-600 dark:text-surface-400">Total Contacts</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-800 rounded-xl p-4 border border-surface-200 dark:border-surface-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Target" className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">
                {recentDeals.length}
              </p>
              <p className="text-sm text-surface-600 dark:text-surface-400">Recent Deals</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-800 rounded-xl p-4 border border-surface-200 dark:border-surface-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">
                ${recentDeals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}
              </p>
              <p className="text-sm text-surface-600 dark:text-surface-400">Pipeline Value</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Deals */}
      <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700">
        <div className="p-4 border-b border-surface-200 dark:border-surface-700">
          <h3 className="font-semibold text-surface-900 dark:text-white">Recent Deals</h3>
        </div>
        <div className="p-4 space-y-3">
          {recentDeals.length > 0 ? (
            recentDeals.map((deal, index) => (
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
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 px-6 py-4 text-left transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary/5 to-secondary/5 border-b-2 border-primary'
                    : 'hover:bg-surface-50 dark:hover:bg-surface-700/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary to-secondary text-white'
                      : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400'
                  }`}>
                    <ApperIcon name={tab.icon} className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className={`font-medium ${
                      activeTab === tab.id
                        ? 'text-primary'
                        : 'text-surface-900 dark:text-white'
                    }`}>
                      {tab.label}
                    </h3>
                    <p className="text-sm text-surface-600 dark:text-surface-400">
                      {tab.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'quick-add' && <QuickAddContent key="quick-add" />}
            {activeTab === 'search' && <SearchContent key="search" />}
            {activeTab === 'overview' && <OverviewContent key="overview" />}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default MainFeature;