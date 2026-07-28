import { useState, useEffect } from 'react';
import './CustomerListing.css';
import noClients from '../../../assets/noPosts.png';
import AddClientModal from '../AddClient/AddClientModal';
import ClientDetailsModal from '../ClientProfile/ClientProfileModal';
import { customersApi, tasksApi } from '../../../api/services';

const DEFAULT_AVATAR =
  'https://ui-avatars.com/api/?background=dbeafe&color=1d4ed8&name=';

// Customers onboarded in the last 30 days count as "new"
const NEW_CLIENT_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

function formatOnboardingDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Map a backend customer doc (+ this client's tasks) into the card shape
function toClientCard(customer, tasks) {
  const clientTasks = tasks.filter(
    (t) => (t.companyName || '').toLowerCase() === customer.name.toLowerCase()
  );
  const completed = clientTasks.filter((t) => t.status === 'completed').length;
  const ongoing = clientTasks.filter((t) => t.status === 'pending').length;
  const pending = clientTasks.filter((t) => t.status === 'available').length;

  return {
    id: customer._id,
    name: customer.name,
    email: customer.email || '—',
    phone: customer.phone,
    type:
      Date.now() - new Date(customer.createdAt).getTime() < NEW_CLIENT_WINDOW_MS
        ? 'new'
        : 'all',
    avatar:
      customer.avatar || `${DEFAULT_AVATAR}${encodeURIComponent(customer.name)}`,
    clientType: 'Bank',
    onboardingDate: formatOnboardingDate(customer.createdAt),
    location: customer.location,
    city: customer.city || '—',
    state: customer.state || '—',
    country: customer.country || '—',
    totalProjects: clientTasks.length,
    completedServices: completed,
    ongoingRequests: ongoing,
    pendingRequests: pending,
  };
}

export default function ClientsDashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewType, setViewType] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Client Details Modal State
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedClientIndex, setSelectedClientIndex] = useState(0);

  const [bankClients, setBankClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [customers, tasks] = await Promise.all([
          customersApi.list(),
          tasksApi.list().catch(() => []),
        ]);
        if (!cancelled) {
          setBankClients(customers.map((c) => toClientCard(c, tasks)));
        }
      } catch (err) {
        console.error('Failed to load clients:', err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreateClient = (createdCustomer) => {
    // createdCustomer is the real backend doc returned from POST /customers
    setBankClients((prevClients) => [
      toClientCard(createdCustomer, []),
      ...prevClients,
    ]);
  };

  const filteredBanks = bankClients.filter(bank => {
    const matchesSearch = bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          bank.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    return bank.type === activeTab && matchesSearch;
  });

  const totalAllCount = bankClients.length;
  const totalNewCount = bankClients.filter(b => b.type === 'new').length;

  const handleOpenDetailsModal = (bank) => {
    const index = filteredBanks.findIndex((b) => b.id === bank.id);
    setSelectedClientIndex(index !== -1 ? index : 0);
    setIsDetailsModalOpen(true);
  };

  const handlePrevClient = () => {
    if (selectedClientIndex > 0) {
      setSelectedClientIndex((prev) => prev - 1);
    }
  };

  const handleNextClient = () => {
    if (selectedClientIndex < filteredBanks.length - 1) {
      setSelectedClientIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="clients-dashboard-container">
      <header className="clients-main-header">
        <div className="title-dropdown-trigger">
          <h1>Client Dashboard</h1>
        </div>
        <button className="btn-add-new-client" onClick={() => setIsModalOpen(true)}>
          <i className="fa-solid fa-plus"></i> New Client
        </button>
      </header>

      <div className="clients-sub-navigation-bar">
        <div className="tabs-navigation-cluster">
          <button
            className={`nav-tab-link ${activeTab === 'all' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Clients <span className="tab-numeric-badge">{totalAllCount}</span>
          </button>
          <button
            className={`nav-tab-link ${activeTab === 'new' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('new')}
          >
            New <span className="tab-numeric-badge">{totalNewCount}</span>
          </button>
        </div>

        <div className="controls-action-cluster">
          <div className="search-box-field-wrapper">
            <i className="fa-solid fa-magnifying-glass inline-search-icon"></i>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-element"
            />
          </div>

          <div className="layout-view-toggle-buttons">
            <button
              className={`view-toggle-btn ${viewType === 'list' ? 'active-view' : ''}`}
              onClick={() => setViewType('list')}
            >
              <i className="fa-solid fa-list"></i>
            </button>
            <button
              className={`view-toggle-btn ${viewType === 'grid' ? 'active-view' : ''}`}
              onClick={() => setViewType('grid')}
            >
              <i className="fa-solid fa-table-cells-large"></i>
            </button>
          </div>
        </div>
      </div>

      {filteredBanks.length > 0 ? (
        <main className={`clients-cards-display-canvas ${viewType === 'list' ? 'list-layout-active' : ''}`}>
          {filteredBanks.map((bank) => (
            <div key={bank.id} className="client-identity-card-box">
              <div className="card-top-identity-row">
                <img src={bank.avatar} alt={bank.name} className="client-round-avatar-img" />

                <div className="client-core-metadata-block">
                  <div className="client-title-row-with-menu">
                    <h3>{bank.name}</h3>
                    <button className="client-card-ellipsis-trigger">
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                  </div>
                  <div className="client-email-line-row">
                    <i className="fa-regular fa-envelope card-icon-inline"></i>
                    <span>{bank.email}</span>
                  </div>
                </div>
              </div>

              <div className="card-bottom-actions-row">
                <div className="client-phone-line-row">
                  <i className="fa-solid fa-phone card-icon-inline"></i>
                  <span>{bank.phone}</span>
                </div>
                <button
                  className="client-details-navigation-link"
                  onClick={() => handleOpenDetailsModal(bank)}
                >
                  See details <i className="fa-solid fa-chevron-right details-arrow-icon"></i>
                </button>
              </div>
            </div>
          ))}
        </main>
      ) : (
        <div className="clients-empty-state-canvas">
          <img
            src={noClients}
            alt="No clients found illustration"
            className="empty-state-fallback-img"
          />
          <h3>{loading ? 'Loading clients…' : 'No clients found'}</h3>
          <p>{loading ? 'Fetching your client records from the server.' : "We couldn't find any clients matching your current selection parameters or active search filters."}</p>
        </div>
      )}

      <AddClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateClient={handleCreateClient}
      />

      {/* Details Modal */}
      <ClientDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        client={filteredBanks[selectedClientIndex]}
        allClients={filteredBanks}
        currentIndex={selectedClientIndex}
        onPrev={handlePrevClient}
        onNext={handleNextClient}
      />
    </div>
  );
}