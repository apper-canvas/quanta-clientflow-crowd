import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { dealService, contactService } from '../services';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [draggedDeal, setDraggedDeal] = useState(null);

  const stages = [
    { id: 'lead', name: 'Lead', color: 'bg-surface-400' },
    { id: 'qualified', name: 'Qualified', color: 'bg-accent' },
    { id: 'proposal', name: 'Proposal', color: 'bg-warning' },
    { id: 'negotiation', name: 'Negotiation', color: 'bg-secondary' },
    { id: 'closed-won', name: 'Closed Won', color: 'bg-success' },
    { id: 'closed-lost', name: 'Closed Lost', color: 'bg-error' }
  ];

  const [newDeal, setNewDeal] = useState({
    title: '',
    value: '',
    contactId: '',
    stage: 'lead',
    probability: 10,
    expectedClose: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message || 'Failed to load deals');
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeal = async (e) => {
    e.preventDefault();
    try {
      const deal = await dealService.create({
        ...newDeal,
        value: parseFloat(newDeal.value) || 0,
        createdAt: new Date().toISOString()
      });
      setDeals([deal, ...deals]);
      setNewDeal({
        title: '',
        value: '',
        contactId: '',
        stage: 'lead',
        probability: 10,
        expectedClose: ''
      });
      setShowAddForm(false);
      toast.success('Deal added successfully');
    } catch (err) {
      toast.error('Failed to add deal');
    }
  };

  const handleDragStart = (deal) => {
    setDraggedDeal(deal);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    if (!draggedDeal || draggedDeal.stage === newStage) return;

    try {
      const updatedDeal = await dealService.update(draggedDeal.id, {
        ...draggedDeal,
        stage: newStage
      });
      
      setDeals(deals.map(deal => 
        deal.id === draggedDeal.id ? updatedDeal : deal
      ));
      
      toast.success(`Deal moved to ${stages.find(s => s.id === newStage)?.name}`);
    } catch (err) {
      toast.error('Failed to update deal');
    }
    
    setDraggedDeal(null);
  };

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact?.name || 'Unknown Contact';
  };

  const DealCard = ({ deal, isDragging }) => {
    const contact = contacts.find(c => c.id === deal.contactId);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
        whileHover={{ scale: 1.02, y: -2 }}
        draggable
        onDragStart={() => handleDragStart(deal)}
        className={`bg-white dark:bg-surface-800 rounded-lg p-4 shadow-card border border-surface-200 dark:border-surface-700 cursor-move hover:shadow-soft transition-all ${
          isDragging ? 'opacity-50 scale-95' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-medium text-surface-900 dark:text-white text-sm leading-tight">
            {deal.title}
          </h4>
          <button className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded">
            <ApperIcon name="MoreVertical" className="w-3 h-3 text-surface-400" />
          </button>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-success">
              ${deal.value.toLocaleString()}
            </span>
            <span className="text-xs text-surface-500 dark:text-surface-400">
              {deal.probability}%
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-surface-600 dark:text-surface-400">
            <ApperIcon name="User" className="w-3 h-3" />
            <span className="truncate">{contact?.name || 'Unknown'}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-surface-600 dark:text-surface-400">
            <ApperIcon name="Calendar" className="w-3 h-3" />
            <span>
              {deal.expectedClose 
                ? new Date(deal.expectedClose).toLocaleDateString()
                : 'No date set'
              }
            </span>
          </div>
        </div>

        <div className="w-full bg-surface-200 dark:bg-surface-600 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full transition-all"
            style={{ width: `${deal.probability}%` }}
          />
        </div>
      </motion.div>
    );
  };

  const StageColumn = ({ stage, deals }) => (
    <div className="flex-1 min-w-80">
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${stage.color}`} />
          <h3 className="font-heading font-semibold text-surface-900 dark:text-white">
            {stage.name}
          </h3>
          <span className="px-2 py-1 bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 text-xs rounded-full">
            {deals.length}
          </span>
        </div>
        <div className="text-sm text-surface-500 dark:text-surface-400">
          ${deals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}
        </div>
      </div>

      <div
        className="space-y-3 min-h-96 p-3 bg-surface-50 dark:bg-surface-700/30 rounded-xl border-2 border-dashed border-surface-200 dark:border-surface-600 transition-colors"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, stage.id)}
      >
        {deals.map((deal) => (
          <DealCard 
            key={deal.id} 
            deal={deal} 
            isDragging={draggedDeal?.id === deal.id}
          />
        ))}
        {deals.length === 0 && (
          <div className="text-center py-8 text-surface-400 dark:text-surface-500">
            <ApperIcon name="Target" className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Drop deals here</p>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex space-x-6 overflow-x-auto">
          {stages.map((stage) => (
            <div key={stage.id} className="flex-1 min-w-80">
              <div className="animate-pulse">
                <div className="h-6 bg-surface-200 dark:bg-surface-600 rounded w-32 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-surface-800 rounded-lg p-4 shadow-card">
                      <div className="h-4 bg-surface-200 dark:bg-surface-600 rounded w-3/4 mb-3"></div>
                      <div className="h-6 bg-surface-200 dark:bg-surface-600 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-surface-200 dark:bg-surface-600 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-error/10 border border-error/20 rounded-xl p-6 text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-error mb-2">Error Loading Deals</h3>
          <p className="text-surface-600 dark:text-surface-400 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = deals.filter(deal => deal.stage === stage.id);
    return acc;
  }, {});

  return (
    <div className="p-6 overflow-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-surface-900 dark:text-white">
              Sales Pipeline
            </h1>
            <p className="text-surface-600 dark:text-surface-400">
              Track deals through your sales process
            </p>
          </div>
          <motion.button
            onClick={() => setShowAddForm(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium shadow-soft hover:shadow-card transition-all flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>Add Deal</span>
          </motion.button>
        </div>
      </div>

      {/* Pipeline Board */}
      {deals.length > 0 ? (
        <div className="flex space-x-6 overflow-x-auto pb-6">
          {stages.map((stage) => (
            <StageColumn
              key={stage.id}
              stage={stage}
              deals={dealsByStage[stage.id] || []}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Target" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900 dark:text-white">
            No deals yet
          </h3>
          <p className="mt-2 text-surface-500 dark:text-surface-400">
            Get started by adding your first deal
          </p>
          <motion.button
            onClick={() => setShowAddForm(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Add Deal
          </motion.button>
        </motion.div>
      )}

      {/* Add Deal Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-surface-800 rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-semibold text-surface-900 dark:text-white">
                Add New Deal
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg"
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDeal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Deal Title *
                </label>
                <input
                  type="text"
                  required
                  value={newDeal.title}
                  onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                  className="w-full px-3 py-2 border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Value *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={newDeal.value}
                  onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                  className="w-full px-3 py-2 border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Contact *
                </label>
                <select
                  required
                  value={newDeal.contactId}
                  onChange={(e) => setNewDeal({ ...newDeal, contactId: e.target.value })}
                  className="w-full px-3 py-2 border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  <option value="">Select a contact</option>
                  {contacts.map(contact => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name} - {contact.company}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Expected Close Date
                </label>
                <input
                  type="date"
                  value={newDeal.expectedClose}
                  onChange={(e) => setNewDeal({ ...newDeal, expectedClose: e.target.value })}
                  className="w-full px-3 py-2 border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Add Deal
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Deals;