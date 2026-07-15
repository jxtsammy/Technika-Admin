import { useState, useMemo, useEffect } from 'react';
import './CustomerListing.css';
import api from '../../../api';

export default function CustomerSection() {
  const [viewType, setViewType] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', location: '', phone: '' });
  const [saving, setSaving] = useState(false);

  const loadCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data || []);
    } catch (err) {
      console.error('Failed to load customers:', err);
    }
  };

  useEffect(() => {
    (async () => { await loadCustomers(); })();
  }, []);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/customers', {
        name: newCustomer.name,
        location: newCustomer.location,
        phone: newCustomer.phone,
      });
      setShowModal(false);
      setNewCustomer({ name: '', location: '', phone: '' });
      await loadCustomers();
    } catch (err) {
      console.error('Failed to add customer:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await api.delete(`/customers/${id}`);
      setCustomers(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error('Failed to delete customer:', err);
    }
  };

  // Search & Filter Mapping
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const name = (customer.name || '').toLowerCase();
      const location = (customer.location || '').toLowerCase();
      const matchesSearch = name.includes(searchTerm.toLowerCase()) ||
                            location.includes(searchTerm.toLowerCase());
      if (filterBy === 'accra') return matchesSearch && (customer.location || '').includes('Accra');
      return matchesSearch;
    });
  }, [customers, searchTerm, filterBy]);

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
            Customers <span className="badge-count active-badge">{customers.length}</span>
          </div>
        </div>
        <div className="right-stats">
          Showing {totalItems === 0 ? 0 : startIndex + 1} - {endIndex} of {customers.length} results
          <button className="filter-trigger-btn" onClick={() => setShowModal(true)} style={{ marginLeft: '12px' }}>
            <i className="fa-solid fa-plus"></i> Add Customer
          </button>
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
                <th style={{ width: '15%' }}>Date Added</th>
                <th style={{ width: '10%' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((customer) => (
                <tr key={customer._id} className="table-data-row">
                  <td className="identity-cell-profile">
                    <span className="circular-bank-avatar">
                      <i className="fa-solid fa-building-columns"></i>
                    </span>
                    <span className="primary-identity-text">{customer.name}</span>
                  </td>
                  <td className="muted-table-cell">{customer.location}</td>
                  <td className="muted-table-cell">{customer.phone}</td>
                  <td className="muted-table-cell">{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : ''}</td>
                  <td className="muted-table-cell">
                    <button className="filter-trigger-btn" onClick={() => handleDeleteCustomer(customer._id)}>
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (

        /* --- CATCHY TILES VIEW STRUCTURE --- */
        <div className="dashboard-tiles-layout">
          {currentData.map((customer) => (
            <div key={customer._id} className="grid-card-item">
              <div className="grid-card-header">
                <span className="circular-bank-avatar">
                  <i className="fa-solid fa-building-columns"></i>
                </span>
                <button className="card-request-tag" onClick={() => handleDeleteCustomer(customer._id)}>
                  <i className="fa-solid fa-trash"></i> Delete
                </button>
              </div>
              <h3 className="card-title-heading">{customer.name}</h3>
              <div className="card-metadata-lines">
                <p><i className="fa-solid fa-location-dot"></i> {customer.location}</p>
                <p><i className="fa-solid fa-phone"></i> {customer.phone}</p>
                <p><i className="fa-solid fa-clock"></i> {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : ''}</p>
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

      {/* Add Customer Modal */}
      {showModal && (
        <div
          className="customer-modal-overlay"
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="customer-modal-box"
            style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '360px', maxWidth: '90%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0 }}>Add Customer</h3>
            <form onSubmit={handleAddCustomer}>
              <div className="form-input-wrapper" style={{ marginBottom: '12px' }}>
                <label>Name</label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                  required
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              <div className="form-input-wrapper" style={{ marginBottom: '12px' }}>
                <label>Location</label>
                <input
                  type="text"
                  value={newCustomer.location}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, location: e.target.value }))}
                  required
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              <div className="form-input-wrapper" style={{ marginBottom: '16px' }}>
                <label>Phone</label>
                <input
                  type="text"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  required
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="filter-trigger-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="filter-trigger-btn" disabled={saving}>
                  {saving ? 'Saving...' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}