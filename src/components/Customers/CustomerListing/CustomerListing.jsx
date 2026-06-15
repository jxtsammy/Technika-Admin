import { useState, useMemo } from 'react';
import './CustomerListing.css';

const GHANA_BANKS_DATA = [
  { id: 1, name: 'GCB Bank', location: 'Accra Central', phone: '+233 30 266 4914', requests: 1500, dateAdded: '5 mins ago' },
  { id: 2, name: 'Ecobank Ghana', location: 'Ridge, Accra', phone: '+233 30 221 3999', requests: 1200, dateAdded: '5 mins ago' },
  { id: 3, name: 'Absa Bank Ghana', location: 'High Street, Accra', phone: '+233 30 266 6991', requests: 950, dateAdded: '5 mins ago' },
  { id: 4, name: 'Stanbic Bank', location: 'Airport City, Accra', phone: '+233 30 281 5789', requests: 820, dateAdded: '5 mins ago' },
  { id: 5, name: 'Fidelity Bank Ghana', location: 'Ridge Towers, Accra', phone: '+233 30 221 4490', requests: 610, dateAdded: '5 mins ago' },
  { id: 6, name: 'Zenith Bank Ghana', location: 'Asylum Down, Accra', phone: '+233 30 223 0817', requests: 430, dateAdded: '5 mins ago' },
  { id: 7, name: 'CalBank', location: 'Independence Ave, Accra', phone: '+233 30 268 0079', requests: 310, dateAdded: '5 mins ago' },
  { id: 8, name: 'Societe Generale Ghana', location: 'Kokomlemle, Accra', phone: '+233 30 222 1573', requests: 215, dateAdded: '5 mins ago' },
  { id: 9, name: 'Consolidated Bank Ghana (CBG)', location: 'Manet Towers, Accra', phone: '+233 30 221 6000', requests: 150, dateAdded: '5 mins ago' },
  { id: 10, name: 'Agricultural Development Bank (ADB)', location: 'Ridge, Accra', phone: '+233 30 221 0210', requests: 95, dateAdded: '5 mins ago' },
  { id: 11, name: 'National Investment Bank (NIB)', location: 'Accra Central', phone: '+233 30 266 1601', requests: 45, dateAdded: '5 mins ago' }
];

export default function CustomerSection() {
  const [viewType, setViewType] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  // Search & Filter Mapping
  const filteredCustomers = useMemo(() => {
    return GHANA_BANKS_DATA.filter(bank => {
      const matchesSearch = bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            bank.location.toLowerCase().includes(searchTerm.toLowerCase());
      if (filterBy === 'accra') return matchesSearch && bank.location.includes('Accra');
      return matchesSearch;
    });
  }, [searchTerm, filterBy]);

  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentData = filteredCustomers.slice(startIndex, endIndex);

  return (
    <div className="dashboard-container">

      {/* Exact Tab Row Layout from Image */}
      <div className="tabs-row">
        <div className="left-tabs">
          <div className="tab-item active">
            Customers <span className="badge-count active-badge">1500</span>
          </div>
        </div>
        <div className="right-stats">
          Showing {totalItems === 0 ? 0 : startIndex + 1} - {endIndex} of 1500 results
        </div>
      </div>

      {/* Pure White Control Bar */}
      <div className="search-filter-row">
        <div className="search-bar-box">
          <i className="fa-solid fa-magnifying-glass search-bar-icon"></i>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <div className="actions-right-box">
          {/* View Toggles exactly matching image layout */}
          <div className="toggle-view-container">
            <button
              className={`toggle-action-btn left-radius ${viewType === 'list' ? 'selected' : ''}`}
              onClick={() => setViewType('list')}
            >
              <i className="fa-solid fa-list-ul"></i>
            </button>
            <button
              className={`toggle-action-btn right-radius ${viewType === 'tiles' ? 'selected' : ''}`}
              onClick={() => setViewType('tiles')}
            >
              <i className="fa-solid fa-table-cells-large"></i>
            </button>
          </div>

          {/* Filter Dropdown Box */}
          <div className="custom-select-box">
            <button className="filter-trigger-btn">
              <i className="fa-solid fa-arrow-down-short-wide"></i> Filter
            </button>
            <select
              value={filterBy}
              onChange={(e) => { setFilterBy(e.target.value); setCurrentPage(1); }}
              className="hidden-select-overlay"
            >
              <option value="all">All Records</option>
              <option value="accra">Accra Locations</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Container Presentation */}
      {currentData.length === 0 ? (
        <div className="empty-state-card">No records matches your query.</div>
      ) : viewType === 'list' ? (

        /* --- EXACT LIST VIEW STRUCTURE --- */
        <div className="table-outer-frame">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Name</th>
                <th style={{ width: '25%' }}>Location</th>
                <th style={{ width: '20%' }}>Phone Number</th>
                <th style={{ width: '15%' }}>Request</th>
                <th style={{ width: '10%' }}>Date Added</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((bank) => (
                <tr key={bank.id} className="table-data-row">
                  <td className="identity-cell-profile">
                    <span className="circular-bank-avatar">
                      <i className="fa-solid fa-building-columns"></i>
                    </span>
                    <span className="primary-identity-text">{bank.name}</span>
                  </td>
                  <td className="muted-table-cell">{bank.location}</td>
                  <td className="muted-table-cell">{bank.phone}</td>
                  <td className="muted-table-cell">Request {bank.id}</td>
                  <td className="muted-table-cell">{bank.dateAdded}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (

        /* --- CATCHY TILES VIEW STRUCTURE --- */
        <div className="dashboard-tiles-layout">
          {currentData.map((bank) => (
            <div key={bank.id} className="grid-card-item">
              <div className="grid-card-header">
                <span className="circular-bank-avatar">
                  <i className="fa-solid fa-building-columns"></i>
                </span>
                <span className="card-request-tag">Request {bank.id}</span>
              </div>
              <h3 className="card-title-heading">{bank.name}</h3>
              <div className="card-metadata-lines">
                <p><i className="fa-solid fa-location-dot"></i> {bank.location}</p>
                <p><i className="fa-solid fa-phone"></i> {bank.phone}</p>
                <p><i className="fa-solid fa-clock"></i> {bank.dateAdded}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Styled Circle Pagination */}
      {totalPages > 1 && (
        <div className="pagination-numbers-row">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx + 1}
              className={`page-num-circle ${currentPage === idx + 1 ? 'current-active' : ''}`}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}