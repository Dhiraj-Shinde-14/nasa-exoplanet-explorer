import React from 'react';
import './StatsBar.css';

export default function StatsBar({ options, loading }) {
  const stats = [
    { icon: '📅', value: options.disc_year.length, label: 'Years of Discovery', suffix: 'yrs' },
    { icon: '🔬', value: options.discoverymethod.length, label: 'Detection Methods', suffix: 'methods' },
    { icon: '⭐', value: options.hostname.length, label: 'Host Stars', suffix: 'stars' },
    { icon: '🏛️', value: options.disc_facility.length, label: 'Research Facilities', suffix: 'facilities' },
  ];

  return (
    <div className="stats-bar">
      {stats.map((stat, i) => (
        <div className="stats-bar__item" key={i}>
          {loading ? (
            <div className="stats-bar__skeleton" />
          ) : (
            <>
              <span className="stats-bar__icon">{stat.icon}</span>
              <span className="stats-bar__value">{stat.value.toLocaleString()}</span>
              <span className="stats-bar__label">{stat.label}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
