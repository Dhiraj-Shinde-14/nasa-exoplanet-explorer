# 🪐 NASA Exoplanet Explorer

A full-stack web application that lets you query **6,000+ confirmed exoplanets** from NASA's official Exoplanet Archive — built with React and Node.js.

> 🟢 **Live Demo:** [nasa-exoplanet-explorer-steel.vercel.app](https://nasa-exoplanet-explorer-steel.vercel.app)

---

## ✨ Features

- 🔭 **4 search filters** — Discovery Year, Method, Host Star, Facility
- ⚡ **Instant search** — data cached in memory on startup, no DB needed
- 🔄 **Smart data loading** — tries NASA API first, falls back to local CSV automatically
- 📊 **Sortable results table** — click any column header to sort ▲▼
- 🔗 **NASA planet links** — click any planet name to open its official NASA page
- 🛡️ **Result limiting** — caps at 500 rows to prevent browser freeze
- 📈 **Stats bar** — shows live counts of years, methods, stars and facilities
- 🌌 **Dark space theme** — animated starfield background

---

## 🏗 Architecture

```
NASA API (live)
      │
      ├── ✅ Available → load fresh data
      └── ❌ Down → fallback to local CSV
                │
                ▼
         Node.js Backend
         (data cached in memory)
                │
         ┌──────┴──────┐
         │             │
    /options       /search
    (dropdowns)   (filtered results)
         │             │
         └──────┬──────┘
                ▼
         React Frontend
    (query panel + results table)
```

**Why in-memory caching?**
Data is loaded once on server startup and stored as a JavaScript array. Every search is a `.filter()` on that array — no database, no repeated API calls. Results return in milliseconds.

**Why the CSV fallback?**
NASA's API occasionally goes down for maintenance or blocks requests. The local CSV ensures the app always works regardless of NASA's uptime.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 |
| Backend | Node.js + Express |
| HTTP Client | Axios |
| CSV Parsing | csv-parse |
| Data Source | NASA Exoplanet Archive |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📁 Folder Structure

```
nasa-exoplanet-explorer/
├── backend/
│   ├── server.js          ← Express server + API routes
│   ├── dataLoader.js      ← NASA fetch + CSV parse + in-memory cache
│   ├── exoplanets.csv     ← Local backup data from NASA
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js                     ← Main component + state management
        ├── App.css                    ← Layout + starfield + header
        ├── index.js
        ├── index.css                  ← Global reset + scrollbar
        └── components/
            ├── StatsBar.js            ← Live stat cards with shimmer loading
            ├── StatsBar.css
            ├── QueryPanel.js          ← Filters + search/clear buttons
            ├── QueryPanel.css
            ├── ResultsTable.js        ← Sortable table + result limit
            └── ResultsTable.css
```

---

## 🚀 Run Locally

### Prerequisites
- Node.js 18+
- Git

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/nasa-exoplanet-explorer.git
cd nasa-exoplanet-explorer
```

### 2. Start the backend

```bash
cd backend
npm install
npm run dev
```

You should see:
```
🚀 Starting exoplanet data load...
🌐 Trying NASA API...
✅ Loaded 6127 exoplanets from NASA API (live)
🌍 Server running at http://localhost:3001
```

### 3. Start the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

App opens at **http://localhost:3000** 🎉

---

## 🌐 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | Server status + total planet count |
| `/api/exoplanets/options` | GET | Dropdown values for all 4 filters |
| `/api/exoplanets/search` | GET | Search with query params |

### Search Example

```
GET /api/exoplanets/search?disc_year=2020&discoverymethod=Transit
```

```json
{
  "success": true,
  "count": 312,
  "results": [
    {
      "pl_name": "Kepler-1649c",
      "hostname": "Kepler-1649",
      "disc_year": "2020",
      "discoverymethod": "Transit",
      "disc_facility": "Kepler"
    }
  ]
}
```

---

## 🌍 Deployment

### Backend → Render.com
1. Push to GitHub
2. Create new **Web Service** on [render.com](https://render.com)
3. Connect your GitHub repo, set root directory to `backend/`
4. Build command: `npm install`
5. Start command: `node server.js`

### Frontend → Vercel
1. Create new project on [vercel.com](https://vercel.com)
2. Connect your GitHub repo, set root directory to `frontend/`
3. Add environment variable: `REACT_APP_API_URL=https://your-backend.onrender.com/api`
4. Deploy!

---

## 📄 Data Source

Data provided by the [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/), operated by the California Institute of Technology, under contract with NASA.