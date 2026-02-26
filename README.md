# 🪐 NASA Exoplanet Explorer

A full-stack web application that lets you query **6,000+ confirmed exoplanets** from NASA's official Exoplanet Archive — built using AI-assisted development with React and Node.js.

> 🔴 **Live Demo:** _Coming soon_

---

## 🤖 About This Project

This project was built as a demonstration of **AI-assisted software development** — a workflow where a developer uses AI tools (like Claude) to plan, architect, debug, and build a real-world application, while maintaining full understanding and ownership of every decision.

This is not just "AI generated code" — it's a structured collaboration where:

- **I defined the requirements** — what to build, what data to use, what UX problems to solve
- **I made architectural decisions** — in-memory caching vs database, fallback strategy, component structure
- **I directed the AI** — with specific prompts for each piece, reviewed every output, and caught issues
- **I debugged real problems** — NASA's API went down mid-build, I identified the issue, chose the fallback strategy, and implemented it
- **I understood the tradeoffs** — why text input for hostname but dropdown for year, why 500 result limit, why local CSV backup

> *"The AI writes faster than I can type — but I decide what gets written and why."*

This workflow reflects exactly how modern software teams are integrating AI tools — not replacing developers, but making them significantly more productive.

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

## 🧠 AI-Assisted Development — What This Means

### What I prompted the AI to do:
- Generate boilerplate Express server structure
- Write the CSV parsing logic
- Suggest component breakdown for the React frontend
- Write initial CSS for the dark space theme

### What I decided and directed:
- Chose in-memory caching over a database (faster, simpler for this use case)
- Identified the hostname dropdown UX problem (5000+ options unusable) and chose text input with autocomplete as the solution
- Caught the NASA API failure mid-build, diagnosed it as a server-side Oracle DB error, and designed the fallback strategy
- Chose `pscomppars` table over `ps` table after understanding the difference (unique planets vs multiple measurements)
- Decided 500 row display limit after reasoning about browser performance
- Structured the README to reflect honest AI collaboration

### Key insight:
Working effectively with AI tools requires strong **prompt engineering**, **critical thinking**, and **domain understanding**. You can't just say "build me an app" — you need to break problems down, review outputs carefully, catch errors, and make informed decisions at every step.

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
NASA's API occasionally goes down for maintenance or blocks requests. The local CSV ensures the app always works regardless of NASA's uptime. This was a real problem encountered during development and solved deliberately.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 |
| Backend | Node.js + Express |
| HTTP Client | Axios |
| CSV Parsing | csv-parse |
| Data Source | NASA Exoplanet Archive |
| Development | AI-assisted (Claude by Anthropic) |
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
