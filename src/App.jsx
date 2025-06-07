import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { routes, routeArray } from './config/routes';
import ApperIcon from './components/ApperIcon';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentRoute = routes[activeTab];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const Sidebar = ({ routes, activeTab, setActiveTab, collapsed, mobile = false }) => (
    <motion.div
      initial={mobile ? { x: -300 } : false}
      animate={mobile ? { x: mobileMenuOpen ? 0 : -300 } : false}
      className={`${
        mobile 
          ? 'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-surface-800 shadow-xl' 
          : `bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 ${
              collapsed ? 'w-16' : 'w-64'
            }`
      } flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className={`p-4 border-b border-surface-200 dark:border-surface-700 ${collapsed && !mobile ? 'px-2' : ''}`}>
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            animate={{ opacity: collapsed && !mobile ? 0 : 1 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-5 h-5 text-white" />
            </div>
            {(!collapsed || mobile) && (
              <h1 className="text-xl font-heading font-bold text-surface-900 dark:text-white">
                ClientFlow
              </h1>
            )}
          </motion.div>
          {mobile && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {routes.map((route) => (
          <motion.button
            key={route.id}
            onClick={() => {
              setActiveTab(route.id);
              if (mobile) setMobileMenuOpen(false);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left transition-all ${
              activeTab === route.id
                ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20'
                : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-white'
            } ${collapsed && !mobile ? 'justify-center px-2' : ''}`}
          >
            <ApperIcon 
              name={route.icon} 
              className={`w-5 h-5 ${activeTab === route.id ? 'text-primary' : ''}`} 
            />
            {(!collapsed || mobile) && (
              <span className="font-medium">{route.label}</span>
            )}
          </motion.button>
        ))}
      </nav>

      {/* Footer */}
      <div className={`p-4 border-t border-surface-200 dark:border-surface-700 space-y-2 ${collapsed && !mobile ? 'px-2' : ''}`}>
        <button
          onClick={toggleDarkMode}
          className={`w-full flex items-center space-x-3 px-3 py-2 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-all ${
            collapsed && !mobile ? 'justify-center px-2' : ''
          }`}
        >
          <ApperIcon name={darkMode ? "Sun" : "Moon"} className="w-5 h-5" />
          {(!collapsed || mobile) && <span className="text-sm">Toggle Theme</span>}
        </button>
      </div>
    </motion.div>
  );

  return (
    <BrowserRouter>
      <div className={`min-h-screen bg-background dark:bg-surface-900 ${darkMode ? 'dark' : ''}`}>
        <div className="flex h-screen overflow-hidden">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <Sidebar 
              routes={routeArray} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              collapsed={sidebarCollapsed}
            />
          </div>

          {/* Mobile Sidebar */}
          <Sidebar 
            routes={routeArray} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            collapsed={false}
            mobile={true}
          />

          {/* Mobile Overlay */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="lg:hidden p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg"
                  >
                    <ApperIcon name="Menu" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="hidden lg:block p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg"
                  >
                    <ApperIcon name="PanelLeftClose" className="w-5 h-5" />
                  </button>
                  <h2 className="text-lg font-heading font-semibold text-surface-900 dark:text-white">
                    {currentRoute?.label}
                  </h2>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input
                      type="text"
                      placeholder="Search contacts, deals..."
                      className="pl-10 pr-4 py-2 w-64 bg-surface-100 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                  <button className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg relative">
                    <ApperIcon name="Bell" className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></span>
                  </button>
</div>
              </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-full"
                >
                  <currentRoute.component />
                </motion.div>
              </AnimatePresence>
            </main>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? "dark" : "light"}
          className="!text-sm"
          toastClassName="!rounded-lg !shadow-lg"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;