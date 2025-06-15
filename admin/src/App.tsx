import { AdminProvider } from './contexts/AdminContext';
import { NotificationProvider } from './contexts/NotificationContext';
import AdminDashboard from './components/admin/AdminDashboard';
import NotificationContainer from './components/ui/NotificationContainer';

function App() {
  return (
    <NotificationProvider>
      <AdminProvider>
        <div className="min-h-screen bg-gray-100">
          <AdminDashboard />
          <NotificationContainer />
        </div>
      </AdminProvider>
    </NotificationProvider>
  );
}

export default App;