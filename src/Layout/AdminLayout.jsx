import { useState } from 'react';
import SidebarNavigation from '../components/Sidebar/Sidebar';
import TaskMonitoring from '../components/TaskMonitoring/TaskMonitoring';
import AdminDashboard from '../components/Dashboard/AdminDashboard'; // Uncomment when ready

export default function AdminLayout() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('Task'); // Set 'Task' as default to match your screen

  return (
    <div className="dashboard-app-wrapper">
      {/* Sidebar with state props passed down */}
      <SidebarNavigation
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Pane hosting the right-hand panel views */}
      <main className={`dashboard-main-content ${isExpanded ? 'sidebar-expanded' : 'sidebar-contracted'}`}>
        {activeTab === 'Dashboard' && <AdminDashboard />}
        {activeTab === 'Task' && <TaskMonitoring />}
        {activeTab === 'Customers' && <div className="placeholder-view">Customers View Content</div>}
        {activeTab === 'Technician' && <div className="placeholder-view">Technicians View Content</div>}
        {activeTab === 'Maps' && <div className="placeholder-view">Maps View Content</div>}
        {activeTab === 'Chats' && <div className="placeholder-view">Chats View Content</div>}
        {activeTab === 'Analytics' && <div className="placeholder-view">Analytics View Content</div>}
        {activeTab === 'Settings' && <div className="placeholder-view">Settings View Content</div>}
      </main>
    </div>
  );
}