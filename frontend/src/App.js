import React, { useState, useEffect } from 'react';
import QueryPanel from './components/QueryPanel';
import ResultsTable from './components/ResultsTable';
import StatsBar from './components/StatsBar';
import './App.css';

// In development: uses localhost:3001
// In production: uses the Render backend URL set in Vercel environment variables
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export default function App() {
  const [options, setOptions] = useState({
    disc_year: [],
    discoverymethod: [],
    hostname: [],
    disc_facility: [],
  });
  const [totalCount, setTotalCount] = useState(0);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [filters, setFilters] = useState({
    disc_year: '',
    discoverymethod: '',
    hostname: '',
    disc_facility: '',
  });

  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/exoplanets/options`)
      .then(res => res.json())
      .then(data => {
        setOptions(data.options);
        setTotalCount(data.total);
        setLoadingOptions(false);
      })
      .catch(() => {
        setError('Failed to connect to backend. Make sure the server is running on port 3001.');
        setLoadingOptions(false);
      });
  }, []);

  const handleSearch = async () => {
    const hasFilter = Object.values(filters).some(v => v !== '');
    if (!hasFilter) {
      setError('Please select at least one search filter before searching.');
      return;
    }

    setError('');
    setSearching(true);
    setResults(null);

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val) params.append(key, val);
    });

    try {
      const res = await fetch(`${API_BASE}/exoplanets/search?${params}`);
      const data = await res.json();
      if (!data.success) {
        setError(data.error);
      } else {
        setResults(data);
      }
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleClear = () => {
    setFilters({ disc_year: '', discoverymethod: '', hostname: '', disc_facility: '' });
    setResults(null);
    setError('');
  };

  return (
    <div className="app">
      <div className="stars" />
      <div className="stars stars--2" />
      <div className="stars stars--3" />

      <div className="app-content">
        <header className="app-header">
          <div className="header-icon">🪐</div>
          <h1 className="header-title">NASA Exoplanet Explorer</h1>
          <p className="header-sub">
            Query {loadingOptions ? '...' : totalCount.toLocaleString()} confirmed exoplanets
            from NASA's official archive
          </p>
        </header>

        <StatsBar options={options} loading={loadingOptions} />

        <QueryPanel
          options={options}
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
          onClear={handleClear}
          searching={searching}
          loading={loadingOptions}
          error={error}
        />

        {results && <ResultsTable results={results} />}
      </div>
    </div>
  );
}
