import React from 'react';
import './QueryPanel.css';

export default function QueryPanel({
  options, filters, setFilters,
  onSearch, onClear, searching, loading, error
}) {
  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const hasAnyFilter = Object.values(filters).some(v => v !== '');

  return (
    <div className="query-panel">
      <div className="query-panel__header">
        <h2 className="query-panel__title">
          <span className="query-panel__title-icon">🔭</span>
          Search Exoplanets
        </h2>
        <p className="query-panel__sub">
          Select one or more filters to query the NASA archive
        </p>
      </div>

      <div className="query-panel__grid">

        {/* Discovery Year - dropdown */}
        <div className="query-panel__field">
          <label className="query-panel__label">Discovery Year</label>
          <select
            className="query-panel__select"
            value={filters.disc_year}
            onChange={e => handleChange('disc_year', e.target.value)}
            disabled={loading}
          >
            <option value="">{loading ? 'Loading...' : 'All Years'}</option>
            {options.disc_year?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Discovery Method - dropdown */}
        <div className="query-panel__field">
          <label className="query-panel__label">Discovery Method</label>
          <select
            className="query-panel__select"
            value={filters.discoverymethod}
            onChange={e => handleChange('discoverymethod', e.target.value)}
            disabled={loading}
          >
            <option value="">{loading ? 'Loading...' : 'All Methods'}</option>
            {options.discoverymethod?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Host Star - text input instead of dropdown */}
        <div className="query-panel__field">
          <label className="query-panel__label">
            Host Star Name
            <span className="query-panel__label-hint">type to search</span>
          </label>
          <input
            type="text"
            className="query-panel__input"
            placeholder={loading ? 'Loading...' : 'e.g. Kepler-22, 51 Peg...'}
            value={filters.hostname}
            onChange={e => handleChange('hostname', e.target.value)}
            disabled={loading}
            list="hostname-list"
          />
          {/* Datalist gives browser autocomplete from real values */}
          <datalist id="hostname-list">
            {options.hostname?.slice(0, 300).map(opt => (
              <option key={opt} value={opt} />
            ))}
          </datalist>
        </div>

        {/* Discovery Facility - dropdown */}
        <div className="query-panel__field">
          <label className="query-panel__label">Discovery Facility</label>
          <select
            className="query-panel__select"
            value={filters.disc_facility}
            onChange={e => handleChange('disc_facility', e.target.value)}
            disabled={loading}
          >
            <option value="">{loading ? 'Loading...' : 'All Facilities'}</option>
            {options.disc_facility?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

      </div>

      {error && (
        <div className="query-panel__error">
          <span>⚠</span> {error}
        </div>
      )}

      <div className="query-panel__actions">
        <button
          className="btn btn--clear"
          onClick={onClear}
          disabled={searching}
        >
          Clear
        </button>
        <button
          className="btn btn--search"
          onClick={onSearch}
          disabled={searching || loading}
        >
          {searching ? (
            <>
              <span className="btn__spinner" />
              Searching...
            </>
          ) : (
            <>
              <span>🔍</span>
              Search
            </>
          )}
        </button>
      </div>

      {hasAnyFilter && !error && (
        <div className="query-panel__active-filters">
          {[
            { key: 'disc_year', label: 'Year' },
            { key: 'discoverymethod', label: 'Method' },
            { key: 'hostname', label: 'Host Star' },
            { key: 'disc_facility', label: 'Facility' },
          ].map(({ key, label }) =>
            filters[key] ? (
              <span key={key} className="active-filter">
                <span className="active-filter__label">{label}:</span>
                <span className="active-filter__value">{filters[key]}</span>
                <button
                  className="active-filter__remove"
                  onClick={() => handleChange(key, '')}
                >×</button>
              </span>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
