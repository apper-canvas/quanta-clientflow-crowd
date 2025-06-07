import { createContext, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { setUser, clearUser } from './store/userSlice';
import ApperIcon from './components/ApperIcon';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Callback from './pages/Callback';
import ErrorPage from './pages/ErrorPage';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Deals from './pages/Deals';
import Tasks from './pages/Tasks';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;

  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes('/callback') || currentPath.includes('/error');
        
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/dashboard');
            }
          } else {
            navigate('/dashboard');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(currentPath.includes('/signup') ? `/signup?redirect=${currentPath}` : currentPath.includes('/login') ? `/login?redirect=${currentPath}` : '/login');
          } else if (redirectPath) {
            if (!['error', 'signup', 'login', 'callback'].some((path) => currentPath.includes(path)))
              navigate(`/login?redirect=${redirectPath}`);
            else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
  }, [navigate, dispatch]);

  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  // Protected route wrapper for authenticated pages
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return null; // Will be redirected by onSuccess handler
    }
    return children;
  };

  // Dashboard layout for authenticated users
  const DashboardLayout = ({ children }) => (
    <div className={`min-h-screen transition-colors ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="Zap" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">ClientFlow</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">CRM Dashboard</p>
              </div>
            </div>
          </div>
          
          <nav className="mt-6">
            <div className="px-4 space-y-2">
              {[
                { path: '/dashboard', name: 'Dashboard', icon: 'BarChart3' },
                { path: '/contacts', name: 'Contacts', icon: 'Users' },
                { path: '/deals', name: 'Deals', icon: 'Target' },
                { path: '/tasks', name: 'Tasks', icon: 'CheckSquare' },
                { path: '/reports', name: 'Reports', icon: 'TrendingUp' }
              ].map((item) => (
                <motion.button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                    window.location.pathname === item.path
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </motion.button>
              ))}
            </div>
          </nav>

          <div className="absolute bottom-6 left-4 right-4">
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all mb-2"
            >
              <ApperIcon name={darkMode ? 'Sun' : 'Moon'} className="w-5 h-5" />
              <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </motion.button>
            <motion.button
              onClick={authMethods.logout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              <ApperIcon name="LogOut" className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </motion.button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <main className="h-full">{children}</main>
        </div>
      </div>
    </div>
  );

  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="loading flex items-center justify-center min-h-screen">Initializing application...</div>;
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/contacts" element={<ProtectedRoute><DashboardLayout><Contacts /></DashboardLayout></ProtectedRoute>} />
        <Route path="/deals" element={<ProtectedRoute><DashboardLayout><Deals /></DashboardLayout></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><DashboardLayout><Tasks /></DashboardLayout></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><DashboardLayout><Reports /></DashboardLayout></ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;