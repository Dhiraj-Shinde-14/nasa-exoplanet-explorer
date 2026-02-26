import React, { useState, useMemo } from 'react';
import './ResultsTable.css';

const COLUMNS = [
  { key: 'pl_name',         label: 'Planet Name' },
  { key: 'hostname',        label: 'Host Star' },
  { key: 'disc_year',       label: 'Discovery Year' },
  { key: 'discoverymethod', label: 'Method' },
  { key: 'disc_facility',   label: 'Facility' },
];

const DISPLAY_LIMIT = 500;

export default function ResultsTable({ results }) {
  const [sortKey, setSortKey] = useState('disc_year');
  const [sortDir, setSortDir] = useState('desc');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = useMemo(() => {
    return [...results.results].sort((a, b) => {
      const aVal = a[sortKey] ?? '';
      const bVal = b[sortKey] ?? '';
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [results.results, sortKey, sortDir]);

  const isLimited = sorted.length > DISPLAY_LIMIT;
  const displayed = isLimited ? sorted.slice(0, DISPLAY_LIMIT) : sorted;

  if (results.count === 0) {
    return (
      <div className="results-empty">
        <span className="results-empty__icon">🌌</span>
        <p>No exoplanets matched your search.</p>
        <p className="results-empty__sub">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="results" style={{ animation: 'fadeUp 0.4s ease' }}>
      <div className="results__header">
        <h2 className="results__title">
          Results
          <span className="results__count">{results.count.toLocaleString()} planets found</span>
        </h2>
      </div>

      {/* Results limit warning */}
      {isLimited && (
        <div className="results__limit-banner">
          ⚡ Showing <strong>{DISPLAY_LIMIT.toLocaleString()}</strong> of <strong>{results.count.toLocaleString()}</strong> results for performance.
          Add more filters to narrow down your search.
        </div>
      )}

      <div className="results__table-wrap">
        <table className="results__table">
          <thead>
            <tr>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  className={`results__th ${sortKey === col.key ? 'results__th--active' : ''}`}
                  onClick={() => handleSort(col.key)}
                >
                  <span className="results__th-inner">
                    {col.label}
                    <span className="results__sort-icons">
                      <span className={sortKey === col.key && sortDir === 'asc' ? 'sort-icon--active' : ''}>▲</span>
                      <span className={sortKey === col.key && sortDir === 'desc' ? 'sort-icon--active' : ''}>▼</span>
                    </span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.map((planet, i) => (
              <tr key={i} className="results__row">
                <td className="results__td">
                  <a
                    href={`https://exoplanetarchive.ipac.caltech.edu/overview/${encodeURIComponent(planet.pl_name)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="planet-link"
                  >
                    {planet.pl_name}
                    <span className="planet-link__icon">↗</span>
                  </a>
                </td>
                <td className="results__td">{planet.hostname}</td>
                <td className="results__td results__td--center">{planet.disc_year}</td>
                <td className="results__td">
                  <span className="method-badge">{planet.discoverymethod}</span>
                </td>
                <td className="results__td results__td--facility">{planet.disc_facility}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isLimited && (
        <div className="results__footer">
          Displaying {DISPLAY_LIMIT} of {results.count.toLocaleString()} results — refine your search to see more specific results
        </div>
      )}
    </div>
  );
}
