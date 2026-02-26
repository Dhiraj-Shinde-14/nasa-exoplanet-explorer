import express from 'express';
import cors from 'cors';
import { loadData, searchExoplanets, getOptions, getTotalCount } from './dataLoader.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ── Route 1: Get dropdown options ─────────────────────────────────────────────
// Frontend calls this once on load to populate all 4 dropdowns
app.get('/api/exoplanets/options', (req, res) => {
  res.json({
    success: true,
    total: getTotalCount(),
    options: getOptions(),
  });
});

// ── Route 2: Search exoplanets ────────────────────────────────────────────────
// Accepts query params: disc_year, discoverymethod, hostname, disc_facility
app.get('/api/exoplanets/search', (req, res) => {
  const { disc_year, discoverymethod, hostname, disc_facility } = req.query;

  // Must have at least one filter
  if (!disc_year && !discoverymethod && !hostname && !disc_facility) {
    return res.status(400).json({
      success: false,
      error: 'Please select at least one search filter.',
    });
  }

  const results = searchExoplanets({ disc_year, discoverymethod, hostname, disc_facility });

  res.json({
    success: true,
    count: results.length,
    results,
  });
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok', total: getTotalCount() }));

// ── Start server after data is loaded ─────────────────────────────────────────
loadData()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🌍 Server running at http://localhost:${PORT}`);
      console.log(`   Try: http://localhost:${PORT}/api/health`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to load NASA data:', err.message);
    process.exit(1);
  });
