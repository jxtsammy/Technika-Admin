import { useState } from 'react';
import './CustomerListing.css';
import noClients from '../../../assets/noPosts.png';

export default function ClientsDashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewType, setViewType] = useState('grid');

  const bankClients = [
    { id: 1, name: 'GCB Bank PLC', email: 'info@gcbbank.com.gh', phone: '(030) 266-4911', type: 'all', avatar: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=150&h=150&fit=crop' },
    { id: 2, name: 'Ecobank Ghana', email: 'contact@ecobank.com', phone: '(030) 221-3999', type: 'all', avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&h=150&fit=crop' },
    { id: 3, name: 'Absa Bank Ghana', email: 'absa.ghana@absa.africa', phone: '(030) 242-9100', type: 'all', avatar: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=150&h=150&fit=crop' },
    { id: 4, name: 'Stanbic Bank Ghana', email: 'customercare@stanbic.com.gh', phone: '(030) 281-5700', type: 'all', avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&h=150&fit=crop' },
    { id: 5, name: 'Fidelity Bank Ghana', email: 'info@fidelitybank.com.gh', phone: '(030) 221-4490', type: 'new', avatar: 'https://images.unsplash.com/photo-1512403754473-278556139b0e?w=150&h=150&fit=crop' },
    { id: 6, name: 'Standard Chartered', email: 'talk.to-us@sc.com', phone: '(030) 261-0750', type: 'all', avatar: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=150&h=150&fit=crop' },
    { id: 7, name: 'Zenith Bank Ghana', email: 'info@zenithbank.com.gh', phone: '(030) 261-1500', type: 'all', avatar: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=150&h=150&fit=crop' },
    { id: 8, name: 'CalBank PLC', email: 'customercare@calbank.net', phone: '(030) 268-0068', type: 'new', avatar: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=150&h=150&fit=crop' },
    { id: 9, name: 'Consolidated Bank Ghana', email: 'info@cbg.com.gh', phone: '(030) 221-6000', type: 'all', avatar: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=150&h=150&fit=crop' }
  ];

  const filteredBanks = bankClients.filter(bank => {
    const matchesSearch = bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          bank.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    return bank.type === activeTab && matchesSearch;
  });

  const totalAllCount = bankClients.length;
  const totalNewCount = bankClients.filter(b => b.type === 'new').length;

  return (
    <div className="clients-dashboard-container">

      {/* Top Main Title Bar Row */}
      <header className="clients-main-header">
        <div className="title-dropdown-trigger">
          <h1>Client Dashboard</h1>
        </div>
        <button className="btn-add-new-client">
          <i className="fa-solid fa-plus"></i> New Client
        </button>
      </header>

      {/* Navigation Subheader Filter Bar */}
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

      {/* Dynamic Grid Layout View */}
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
                <a href="#details" className="client-details-navigation-link">
                  See details <i className="fa-solid fa-chevron-right details-arrow-icon"></i>
                </a>
              </div>
            </div>
          ))}
        </main>
      ) : (
        /* Empty Fallback State Component Matrix */
        <div className="clients-empty-state-canvas">
          <img
            src={noClients}
            alt="No clients found illustration"
            className="empty-state-fallback-img"
          />
          <h3>No clients found</h3>
          <p>We couldn't find any clients matching your current selection parameters or active search filters.</p>
        </div>
      )}

    </div>
  );
}