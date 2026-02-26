import axios from 'axios';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CSV_PATH = join(__dirname, 'exoplanets.csv');

// NASA TAP API URL
const NASA_URL = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?' +
  'QUERY=SELECT+pl_name,hostname,disc_year,discoverymethod,disc_facility+FROM+pscomppars+WHERE+disc_year+IS+NOT+NULL&' +
  'FORMAT=csv&lang=ADQL';

// In-memory cache
let exoplanets = [];
let options = {
  disc_year: [],
  discoverymethod: [],
  hostname: [],
  disc_facility: [],
};

// ── Parse raw CSV text into structured data ───────────────────────────────────
function parseCSV(rawText) {
  const lines = rawText.split('\n').filter(line => !line.startsWith('#'));
  const cleaned = lines.join('\n');

  const records = parse(cleaned, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  });

  return records.filter(r => r.pl_name && r.hostname && r.disc_year);
}

// ── Build dropdown options from records ───────────────────────────────────────
function buildOptions(records) {
  options.disc_year = [...new Set(records.map(r => r.disc_year))]
    .filter(Boolean).sort((a, b) => b - a);

  options.discoverymethod = [...new Set(records.map(r => r.discoverymethod))]
    .filter(Boolean).sort();

  options.hostname = [...new Set(records.map(r => r.hostname))]
    .filter(Boolean).sort();

  options.disc_facility = [...new Set(records.map(r => r.disc_facility))]
    .filter(Boolean).sort();
}

// ── Try NASA API ──────────────────────────────────────────────────────────────
async function loadFromNASA() {
  console.log('🌐 Trying NASA API...');

  const response = await axios.get(NASA_URL, {
    timeout: 15000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; ExoplanetExplorer/1.0)',
      'Accept': 'text/plain, text/csv, */*',
    }
  });

  // If NASA returned XML error instead of CSV, throw so we fallback
  if (typeof response.data === 'string' && response.data.includes('<')) {
    throw new Error('NASA returned an error response');
  }

  return response.data;
}

// ── Load from local CSV ───────────────────────────────────────────────────────
function loadFromLocal() {
  console.log('📁 Loading from local CSV backup...');
  return readFileSync(CSV_PATH, 'utf-8');
}

// ── Main load function ────────────────────────────────────────────────────────
export async function loadData() {
  console.log('🚀 Starting exoplanet data load...');

  let rawData;
  let source;

  try {
    rawData = await loadFromNASA();
    source = 'NASA API (live)';
  } catch (err) {
    console.warn(`⚠️  NASA API unavailable: ${err.message}`);
    console.log('🔄 Falling back to local CSV...');
    rawData = loadFromLocal();
    source = 'local CSV backup';
  }

  exoplanets = parseCSV(rawData);
  buildOptions(exoplanets);

  console.log(`✅ Loaded ${exoplanets.length} exoplanets from ${source}`);
  console.log(`   Years: ${options.disc_year.length} | Methods: ${options.discoverymethod.length} | Facilities: ${options.disc_facility.length}`);
}

// ── Search ────────────────────────────────────────────────────────────────────
export function searchExoplanets({ disc_year, discoverymethod, hostname, disc_facility }) {
  return exoplanets.filter(planet => {
    if (disc_year && planet.disc_year !== disc_year) return false;
    if (discoverymethod && planet.discoverymethod !== discoverymethod) return false;
    if (hostname && planet.hostname !== hostname) return false;
    if (disc_facility && planet.disc_facility !== disc_facility) return false;
    return true;
  });
}

export function getOptions() { return options; }
export function getTotalCount() { return exoplanets.length; }
