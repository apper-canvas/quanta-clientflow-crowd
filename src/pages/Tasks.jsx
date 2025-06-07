import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { taskService, contactService } from '../services';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, completed, overdue
  const [showAddForm, setShowAddForm] = useState(false);

  const [newTask, setNewTask] = useState({
    title: '',
    contactId: '',
    dueDate: '',
    priority: 'medium'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, contactsData] = await Promise.all([
        taskService.getAll(),
        contactService.getAll()
      ]);
      setTasks(tasksData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const task = await taskService.create({
        ...newTask,
        completed: false
      });
      setTasks([task, ...tasks]);
      setNewTask({
        title: '',
        contactId: '',
        dueDate: '',
        priority: 'medium'
      });
      setShowAddForm(false);
      toast.success('Task added successfully');
    } catch (err) {
      toast.error('Failed to add task');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = await taskService.update(task.id, {
        ...task,
        completed: !task.completed
      });
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
      toast.success(updatedTask.completed ? 'Task completed!' : 'Task reopened');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const isOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'pending':
        return !task.completed;
      case 'completed':
        return task.completed;
      case 'overdue':
        return !task.completed && isOverdue(task.dueDate);
      default:
        return true;
    }
  }).sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed - b.completed;
    }
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact?.name || 'No contact';
  };

  const TaskItem = ({ task, index }) => {
    const contact = contacts.find(c => c.id === task.contactId);
    const overdue = !task.completed && isOverdue(task.dueDate);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`bg-white dark:bg-surface-800 rounded-xl p-4 shadow-card border border-surface-200 dark:border-surface-700 hover:shadow-soft transition-all ${
          task.completed ? 'opacity-60' : ''
        } ${overdue ? 'border-l-4 border-l-error' : ''}`}
      >
        <div className="flex items-start space-x-4">
          <motion.button
            onClick={() => handleToggleComplete(task)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              task.completed
                ? 'bg-success border-success text-white'
                : 'border-surface-300 hover:border-success'
            }`}
          >
            {task.completed && <ApperIcon name="Check" className="w-3 h-3" />}
          </motion.button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className={`font-medium text-surface-900 dark:text-white ${
                task.completed ? 'line-through' : ''
              }`}>
                {task.title}
              </h3>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  task.priority === 'high' ? 'bg-error' :
                  task.priority === 'medium' ? 'bg-warning' :
                  'bg-success'
                }`} />
                <button className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded">
                  <ApperIcon name="MoreVertical" className="w-3 h-3 text-surface-400" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center space-x-4 text-sm text-surface-600 dark:text-surface-400">
                {contact && (
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="User" className="w-3 h-3" />
                    <span>{contact.name}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Calendar" className="w-3 h-3" />
                  <span className={overdue ? 'text-error font-medium' : ''}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {overdue && (
                <span className="text-xs text-error bg-error/10 px-2 py-1 rounded-full font-medium">
                  Overdue
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-surface-800 rounded-xl p-4 shadow-card">
            <div className="animate-pulse flex items-start space-x-4">
              <div className="w-5 h-5 bg-surface-200 dark:bg-surface-600 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-surface-200 dark:bg-surface-600 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-surface-200 dark:bg-surface-600 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-error/10 border border-error/20 rounded-xl p-6 text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-error mb-2">Error Loading Tasks</h3>
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

  return (
    <div className="p-6 overflow-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-surface-900 dark:text-white">
              Tasks
            </h1>
            <p className="text-surface-600 dark:text-surface-400">
              Manage your to-do list and follow-ups
            </p>
          </div>
          <motion.button
            onClick={() => setShowAddForm(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium shadow-soft hover:shadow-card transition-all flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>Add Task</span>
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Tasks' },
            { key: 'pending', label: 'Pending' },
            { key: 'completed', label: 'Completed' },
            { key: 'overdue', label: 'Overdue' }
          ].map(({ key, label }) => (
            <motion.button
              key={key}
              onClick={() => setFilter(key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === key
                  ? 'bg-primary text-white shadow-soft'
                  : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700'
              }`}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-4">
          {filteredTasks.map((task, index) => (
            <TaskItem key={task.id} task={task} index={index} />
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
            <ApperIcon name="CheckSquare" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900 dark:text-white">
            {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
          </h3>
          <p className="mt-2 text-surface-500 dark:text-surface-400">
            {filter === 'all' 
              ? 'Get started by adding your first task'
              : 'Try changing your filter or add a new task'
            }
          </p>
          {filter === 'all' && (
            <motion.button
              onClick={() => setShowAddForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
            >
              Add Task
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Add Task Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-surface-800 rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-semibold text-surface-900 dark:text-white">
                Add New Task
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg"
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Related Contact
                </label>
                <select
                  value={newTask.contactId}
                  onChange={(e) => setNewTask({ ...newTask, contactId: e.target.value })}
                  className="w-full px-3 py-2 border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  <option value="">No contact</option>
                  {contacts.map(contact => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name} - {contact.company}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
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
                  Add Task
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Tasks;