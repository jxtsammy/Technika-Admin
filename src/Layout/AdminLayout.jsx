import { useState } from 'react';
import './AdminLayout.css';
import SidebarNavigation from '../components/Navigations/Sidebar/Sidebar';
import TaskMonitoring from '../components/TaskMonitoring/TaskMonitoring';
import Technicians from '../components/Technicians/Technicians';
import Analytics from '../components/Analytics/AnalyticsView';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import CustomerListing from '../components/Customers/CustomerListing/CustomerListing';
import Chat from '../components/ChatSystem/Chat/Chat';

export default function AdminLayout() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard'); // Defaults to Task view

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
        {activeTab === 'Customers' && <CustomerListing />}
        {activeTab === 'Technician' && <Technicians />}
        {activeTab === 'Maps' && <div className="placeholder-view">Maps View Content</div>}
        {activeTab === 'Analytics' && <Analytics />}
        {activeTab === 'Settings' && <div className="placeholder-view">Settings View Content</div>}
      </main>

      {/* Floating Chat Widget - Placed globally to float above all screens */}
      <div className="global-floating-chat-container">
        <Chat />
      </div>
    </div>
  );
}