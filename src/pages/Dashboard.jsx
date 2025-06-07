import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';
import { contactService, dealService, activityService, taskService } from '../services';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalDeals: 0,
    pipelineValue: 0,
    tasksToday: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [contacts, deals, activities, tasks] = await Promise.all([
          contactService.getAll(),
          dealService.getAll(),
          activityService.getAll(),
          taskService.getAll()
        ]);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        setStats({
          totalContacts: contacts.length,
          totalDeals: deals.length,
          pipelineValue: deals.reduce((sum, deal) => sum + deal.value, 0),
tasksToday: tasks.filter(task => {
            if (!task.due_date) return false;
            const taskDate = new Date(task.due_date);
            taskDate.setHours(0, 0, 0, 0);
            return taskDate.getTime() === today.getTime() && !task.completed;
          }).length
        });

        setRecentActivities(activities.slice(0, 5));
        setUpcomingTasks(tasks.filter(task => !task.completed).slice(0, 5));
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-card border border-surface-200 dark:border-surface-700"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-surface-600 dark:text-surface-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <ApperIcon name={icon} className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const ActivityItem = ({ activity, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-start space-x-3 p-3 hover:bg-surface-50 dark:hover:bg-surface-700/50 rounded-lg transition-colors"
    >
      <div className={`p-2 rounded-lg ${
        activity.type === 'email' ? 'bg-accent/10 text-accent' :
        activity.type === 'call' ? 'bg-success/10 text-success' :
        activity.type === 'meeting' ? 'bg-warning/10 text-warning' :
        'bg-primary/10 text-primary'
      }`}>
        <ApperIcon 
          name={
            activity.type === 'email' ? 'Mail' :
            activity.type === 'call' ? 'Phone' :
            activity.type === 'meeting' ? 'Calendar' :
            'MessageSquare'
          } 
          className="w-4 h-4" 
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-surface-900 dark:text-white truncate">
          {activity.description}
        </p>
        <p className="text-xs text-surface-500 dark:text-surface-400">
          {new Date(activity.date).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );

  const TaskItem = ({ task, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center space-x-3 p-3 hover:bg-surface-50 dark:hover:bg-surface-700/50 rounded-lg transition-colors"
    >
      <div className={`w-3 h-3 rounded-full ${
        task.priority === 'high' ? 'bg-error' :
        task.priority === 'medium' ? 'bg-warning' :
        'bg-success'
      }`} />
      <div className="flex-1 min-w-0">
<p className="text-sm font-medium text-surface-900 dark:text-white truncate">
          {task.title || task.Name || 'Untitled Task'}
        </p>
<p className="text-xs text-surface-500 dark:text-surface-400">
          Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
        </p>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-card">
              <div className="animate-pulse">
                <div className="h-4 bg-surface-200 dark:bg-surface-600 rounded w-2/3 mb-3"></div>
                <div className="h-8 bg-surface-200 dark:bg-surface-600 rounded w-1/2"></div>
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
          <h3 className="text-lg font-semibold text-error mb-2">Error Loading Dashboard</h3>
          <p className="text-surface-600 dark:text-surface-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 overflow-auto">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts}
          icon="Users"
          color="bg-gradient-to-br from-primary to-primary/80"
        />
        <StatCard
          title="Active Deals"
          value={stats.totalDeals}
          icon="Target"
          color="bg-gradient-to-br from-secondary to-secondary/80"
        />
        <StatCard
          title="Pipeline Value"
          value={`$${stats.pipelineValue.toLocaleString()}`}
          icon="DollarSign"
          color="bg-gradient-to-br from-success to-success/80"
        />
        <StatCard
          title="Tasks Today"
          value={stats.tasksToday}
          icon="CheckSquare"
          color="bg-gradient-to-br from-accent to-accent/80"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700"
        >
          <div className="p-6 border-b border-surface-200 dark:border-surface-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-heading font-semibold text-surface-900 dark:text-white">
                Recent Activities
              </h3>
              <ApperIcon name="Activity" className="w-5 h-5 text-surface-400" />
            </div>
          </div>
          <div className="p-3">
            {recentActivities.length > 0 ? (
              <div className="space-y-1">
{recentActivities.map((activity, index) => (
                  <ActivityItem key={activity.Id} activity={activity} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="Activity" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                <p className="text-surface-500 dark:text-surface-400">No recent activities</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700"
        >
          <div className="p-6 border-b border-surface-200 dark:border-surface-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-heading font-semibold text-surface-900 dark:text-white">
                Upcoming Tasks
              </h3>
              <ApperIcon name="Calendar" className="w-5 h-5 text-surface-400" />
            </div>
          </div>
          <div className="p-3">
            {upcomingTasks.length > 0 ? (
              <div className="space-y-1">
{upcomingTasks.map((task, index) => (
                  <TaskItem key={task.Id} task={task} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="CheckSquare" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                <p className="text-surface-500 dark:text-surface-400">No upcoming tasks</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;