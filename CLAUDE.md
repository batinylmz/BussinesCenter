# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BussinesCenter is a KOBİ (SME) financial management platform built with React + Vite (frontend) and Express.js + MongoDB/Mongoose (backend). The UI is entirely in Turkish.

## Commands

### Backend
```bash
cd backend
node server.js          # start server (port 5001)
node seed.js            # seed MongoDB with sample data (DELETES existing data first)
```

### Frontend
```bash
cd frontend
npm run dev             # start Vite dev server
npm run build           # production build
```

## Architecture

### Data Flow
All state lives in `frontend/src/context/DataContext.jsx`. On mount, it fetches all data from 4 MongoDB endpoints in parallel (`Promise.all`) and stores it in a single `data` object. Pages read from and write to this shared context — every CRUD operation hits the backend API and then updates `data` via `setData`.

**`data` shape:**
```js
{ gelirler, giderler, departmanlar, projeler, yatirimlar, butce, kategoriler }
```

`yatirimlar`, `butce`, and `kategoriler` are **frontend-only** (no backend models). They reset on page refresh.

### ID Convention
MongoDB returns `_id`; the frontend uses `id`. All fetched documents are mapped with `{ ...x, id: x._id }` before entering context. Always use `item.id` in frontend code and `req.params.id` maps to `_id` in MongoDB queries.

### Page Navigation
No React Router — navigation is a `useState("dashboard")` in `App.jsx`. The `page` state and `setPage` setter are passed to `Sidebar`, which renders nav buttons. URLs do not change on navigation.

### Shared UI Components (`frontend/src/components/SharedComponents.jsx`)
All reusable UI is here: `Field`, `Modal`, `Btn`, `BtnOutline`, `PageHeader`, `StatCard`, `Badge`, `ProgressBar`, `ActionBtns`, `BarChart`. Do not create new one-off components for things these already cover.

### Design Tokens (`frontend/src/utils/constants.js`)
- `C` — color palette (primary, success, danger, warning, purple, etc.)
- `fmt(n)` — formats number as Turkish Lira (₺)
- `fmtD(n)` — same but with 1 decimal
- `inputSt` — shared input style object; spread into `style` props

Always use `C.*` for colors and `fmt()` for currency. Never hardcode hex values or `new Intl.NumberFormat` inline.

### Backend Structure
```
server.js           — Express app, MongoDB connect, route mounting
models/             — Mongoose schemas (Gelir, Gider, Proje, Departman, User)
routes/             — CRUD routes matching model names
seed.js             — Test data loader
```

All routes follow the pattern: `GET /`, `POST /`, `PUT /:id`, `DELETE /:id`.

### Environment
`backend/.env` must contain:
```
MONGO_URI=mongodb://localhost:27017/BussinesCenter
```

### AI Page
`AIPage.jsx` calls the Anthropic API directly from the browser (`https://api.anthropic.com/v1/messages`) using `claude-sonnet-4-20250514`. The system prompt includes live financial data from context. An API key must be provided — currently it is not stored anywhere in the repo.

## Known Missing Pieces
- **Auth is fake**: `LoginPage` calls `setLoggedIn(true)` without any validation. `User` model exists but no login/register routes are implemented.
- **No React Router**: browser back/forward and direct URL access do not work.
- **API URL is hardcoded**: `http://localhost:5001` appears in `DataContext.jsx` and every page that calls the API. Must be replaced with an env variable (`VITE_API_URL`) before deployment.
- **Yatırımlar/Bütçe not persisted**: these modules have no backend models or routes.
