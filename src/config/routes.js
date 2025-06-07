import HomePage from '@/components/pages/HomePage';
import Dashboard from '../pages/Dashboard';
import Contacts from '../pages/Contacts';
import Deals from '../pages/Deals';
import Tasks from '../pages/Tasks';
import Reports from '../pages/Reports';

const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'BarChart3',
    component: Dashboard,
    path: '/'
  },
  contacts: {
    id: 'contacts',
    label: 'Contacts',
    icon: 'Users',
    component: Contacts,
    path: '/contacts'
  },
  deals: {
    id: 'deals',
    label: 'Deals',
    icon: 'Target',
    component: Deals,
    path: '/deals'
  },
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    icon: 'CheckSquare',
    component: Tasks,
    path: '/tasks'
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    icon: 'TrendingUp',
    component: Reports,
    path: '/reports'
  }
};

export { routes };
export const routeArray = Object.values(routes);