import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';
import { dealService, contactService, activityService } from '../services';
import ReactApexChart from 'react-apexcharts';

const Reports = () => {
  const [data, setData] = useState({
    deals: [],
    contacts: [],
    activities: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [deals, contacts, activities] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
        activityService.getAll()
      ]);
      setData({ deals, contacts, activities });
    } catch (err) {
      setError(err.message || 'Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
    const { deals, contacts, activities } = data;
    
    const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const wonDeals = deals.filter(deal => deal.stage === 'closed-won');
    const totalRevenue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
    const conversionRate = deals.length > 0 ? (wonDeals.length / deals.length) * 100 : 0;
    const avgDealSize = wonDeals.length > 0 ? totalRevenue / wonDeals.length : 0;

    return {
      totalPipelineValue,
      totalRevenue,
      conversionRate,
      avgDealSize,
      totalContacts: contacts.length,
      totalActivities: activities.length
    };
  };

  const getPipelineChartData = () => {
    const stages = [
      { id: 'lead', name: 'Lead' },
      { id: 'qualified', name: 'Qualified' },
      { id: 'proposal', name: 'Proposal' },
      { id: 'negotiation', name: 'Negotiation' },
      { id: 'closed-won', name: 'Won' },
      { id: 'closed-lost', name: 'Lost' }
    ];

    const chartData = stages.map(stage => {
      const stageDeals = data.deals.filter(deal => deal.stage === stage.id);
      return {
        x: stage.name,
        y: stageDeals.reduce((sum, deal) => sum + deal.value, 0)
      };
    });

    return {
      series: [{
        name: 'Pipeline Value',
        data: chartData
      }],
      options: {
        chart: {
          type: 'bar',
          height: 350,
          toolbar: { show: false }
        },
        colors: ['#FF6B6B'],
        plotOptions: {
          bar: {
            borderRadius: 8,
            horizontal: false,
            columnWidth: '60%'
          }
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: stages.map(stage => stage.name)
        },
        yaxis: {
          labels: {
            formatter: (value) => `$${(value / 1000).toFixed(0)}k`
          }
        },
        theme: { mode: 'light' }
      }
    };
  };

  const getActivityChartData = () => {
    const activityTypes = ['email', 'call', 'meeting', 'note'];
    const chartData = activityTypes.map(type => {
      return data.activities.filter(activity => activity.type === type).length;
    });

    return {
      series: chartData,
      options: {
        chart: {
          type: 'donut',
          height: 350
        },
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFB84D'],
        labels: ['Emails', 'Calls', 'Meetings', 'Notes'],
        legend: {
          position: 'bottom'
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => `${val.toFixed(0)}%`
        }
      }
    };
  };

  const metrics = calculateMetrics();
  const pipelineChart = getPipelineChartData();
  const activityChart = getActivityChartData();

  const MetricCard = ({ title, value, icon, color, change }) => (
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
          {change && (
            <p className={`text-xs mt-1 ${change > 0 ? 'text-success' : 'text-error'}`}>
              {change > 0 ? '+' : ''}{change}% from last period
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <ApperIcon name={icon} className="w-6 h-6 text-white" />
        </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-card">
              <div className="animate-pulse h-80 bg-surface-200 dark:bg-surface-600 rounded"></div>
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
          <h3 className="text-lg font-semibold text-error mb-2">Error Loading Reports</h3>
          <p className="text-surface-600 dark:text-surface-400 mb-4">{error}</p>
          <button
            onClick={loadReportsData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 overflow-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-surface-900 dark:text-white">
              Reports & Analytics
            </h1>
            <p className="text-surface-600 dark:text-surface-400">
              Track your sales performance and growth
            </p>
          </div>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Pipeline Value"
          value={`$${metrics.totalPipelineValue.toLocaleString()}`}
          icon="TrendingUp"
          color="bg-gradient-to-br from-primary to-primary/80"
          change={12}
        />
        <MetricCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          icon="DollarSign"
          color="bg-gradient-to-br from-success to-success/80"
          change={8}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${metrics.conversionRate.toFixed(1)}%`}
          icon="Target"
          color="bg-gradient-to-br from-secondary to-secondary/80"
          change={-2}
        />
        <MetricCard
          title="Avg Deal Size"
          value={`$${metrics.avgDealSize.toLocaleString()}`}
          icon="BarChart3"
          color="bg-gradient-to-br from-accent to-accent/80"
          change={15}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700"
        >
          <div className="p-6 border-b border-surface-200 dark:border-surface-700">
            <h3 className="text-lg font-heading font-semibold text-surface-900 dark:text-white">
              Pipeline by Stage
            </h3>
          </div>
          <div className="p-6">
            <ReactApexChart
              options={pipelineChart.options}
              series={pipelineChart.series}
              type="bar"
              height={350}
            />
          </div>
        </motion.div>

        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700"
        >
          <div className="p-6 border-b border-surface-200 dark:border-surface-700">
            <h3 className="text-lg font-heading font-semibold text-surface-900 dark:text-white">
              Activity Breakdown
            </h3>
          </div>
          <div className="p-6">
            <ReactApexChart
              options={activityChart.options}
              series={activityChart.series}
              type="donut"
              height={350}
            />
          </div>
        </motion.div>
      </div>

      {/* Additional Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700"
      >
        <div className="p-6 border-b border-surface-200 dark:border-surface-700">
          <h3 className="text-lg font-heading font-semibold text-surface-900 dark:text-white">
            Key Insights
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Users" className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-surface-900 dark:text-white mb-1">
                {metrics.totalContacts}
              </h4>
              <p className="text-sm text-surface-600 dark:text-surface-400">Total Contacts</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Activity" className="w-6 h-6 text-secondary" />
              </div>
              <h4 className="font-semibold text-surface-900 dark:text-white mb-1">
                {metrics.totalActivities}
              </h4>
              <p className="text-sm text-surface-600 dark:text-surface-400">Total Activities</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Target" className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-semibold text-surface-900 dark:text-white mb-1">
                {data.deals.filter(d => d.stage === 'closed-won').length}
              </h4>
              <p className="text-sm text-surface-600 dark:text-surface-400">Deals Won</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;