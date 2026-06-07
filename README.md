# 📋 Taskr — Personal Task Manager

> This submission is for **Exercise 1: Personal Task Manager**.

A full-stack to-do application built with React + Vite (frontend) and Node.js + Express (backend), with JSON file persistence.

---

## 🔗 Live URLs

| Service | URL |
|---------|-----|
| **Frontend** | https://task-manager-141.vercel.app |
| **Backend** | https://task-manager-1-5tcs.onrender.com |
| **Health check** | https://task-manager-1-5tcs.onrender.com/health |

---

## ⚙️ Environment Variables

### Vercel (Frontend)

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

| Variable | Value | Required |
|----------|-------|----------|
| `VITE_API_URL` | `https://task-manager-1-5tcs.onrender.com/api` | ✅ Yes |

> Without this, the frontend won't know where the backend is and all API calls will fail.

---

### Render (Backend)

Go to: **Render Dashboard → Your Service → Environment**

| Variable | Value | Required |
|----------|-------|----------|
| `NODE_ENV` | `production` | ✅ Yes |
| `CLIENT_URL` | `https://task-manager-141.vercel.app` | ✅ Yes |

> **Do NOT set `PORT`** — Render injects it automatically.
> `CLIENT_URL` is used as an additional CORS allowed origin. The Vercel URL is already hardcoded in the backend as a fallback, so the app will work even if this is missing — but it's best practice to set it.

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Clone the repo
```bash
git clone https://github.com/aryansinghnegi-141/task-manager.git
cd task-manager
```

### 2. Start the backend
```bash
cd server
npm install
npm run dev
# → http://localhost:3001
```

### 3. Start the frontend (new terminal)
```bash
cd client
npm install
npm run dev
# → http://localhost:5173
```

The Vite dev server automatically proxies `/api/*` requests to `localhost:3001`, so no extra config is needed locally.

---

## 🛠 Tech Stack

| Layer | Tech | Why |
|-------|------|-----|
| Frontend | React 18 + Vite | Fast HMR, modern JSX |
| Styling | Tailwind CSS | Utility-first, consistent tokens |
| HTTP Client | Axios | Interceptors, clean error handling |
| Drag & Drop | @hello-pangea/dnd | Maintained fork of react-beautiful-dnd |
| Backend | Node.js + Express | Lightweight, easy to structure |
| Storage | JSON file | Zero-config, no DB setup needed |
| Testing | Vitest + Supertest | Vite-native test runner |

---

## 📁 Project Structure

```
task-manager/
├── client/                         # React frontend (deployed to Vercel)
│   ├── vercel.json                 # SPA rewrite rules
│   ├── vite.config.js              # Vite + proxy + Vitest config
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx                 # App shell (header only)
│       ├── pages/
│       │   └── TasksPage.jsx       # Main page layout
│       ├── components/
│       │   ├── TaskForm.jsx        # Create task form
│       │   ├── TaskCard.jsx        # Individual task card
│       │   ├── TaskList.jsx        # DnD list container
│       │   ├── FilterBar.jsx       # Filter tabs + search
│       │   ├── StatsBar.jsx        # Total/Active/Completed tiles
│       │   ├── ProgressBar.jsx     # Completion progress bar
│       │   ├── EditModal.jsx       # Edit task modal
│       │   ├── DeleteConfirmDialog.jsx
│       │   ├── Notification.jsx    # Success toast
│       │   ├── EmptyState.jsx
│       │   └── LoadingSkeleton.jsx
│       ├── hooks/
│       │   └── useTasks.js         # Central state + API logic
│       ├── services/
│       │   └── taskApi.js          # Axios API wrapper
│       └── utils/
│           └── dateUtils.js        # Date formatting helpers
│
├── server/                         # Express backend (deployed to Render)
│   ├── render.yaml                 # Render deployment config
│   ├── src/
│   │   ├── index.js                # Server entry + CORS + middleware
│   │   ├── routes/taskRoutes.js
│   │   ├── controllers/taskController.js
│   │   ├── services/taskService.js
│   │   ├── middleware/errorHandler.js
│   │   ├── utils/validate.js       # Shared validation helpers
│   │   └── storage/
│   │       ├── database.js         # JSON file read/write
│   │       └── tasks.json          # Persisted task data
│   └── tests/
│       └── tasks.test.js
│
├── vercel.json                     # Root-level Vercel config
├── package.json                    # Monorepo root
└── README.md
```

---

## 📡 API Reference

Base URL: `https://task-manager-1-5tcs.onrender.com`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Get all tasks |
| `POST` | `/api/tasks` | Create a task |
| `PUT` | `/api/tasks/:id` | Update a task |
| `PATCH` | `/api/tasks/:id/toggle` | Toggle complete/incomplete |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `PATCH` | `/api/tasks/reorder` | Save drag-and-drop order |
| `GET` | `/health` | Health check |

**Success response:**
```json
{ "success": true, "data": { ... } }
```

**Error response:**
```json
{ "success": false, "message": "Error description" }
```

---

## ✅ Features

### Must Have
- [x] Create tasks (title required, description + due date optional)
- [x] View all tasks (sorted by order)
- [x] Toggle complete / incomplete (with strikethrough)
- [x] Edit tasks (modal, pre-filled, validated)
- [x] Delete tasks (confirmation dialog)
- [x] Filter: All / Active / Completed

### Should Have
- [x] Task statistics (Total / Active / Completed)
- [x] Overdue highlighting (red border + ⚠ badge)
- [x] Empty state illustration

### Bonus
- [x] Search by title (case-insensitive, works with filters)
- [x] Persistence (JSON file — survives restarts)
- [x] Drag-and-drop reorder (persisted to backend)
- [x] Completion progress bar
- [x] Keyboard accessibility (Escape closes modals)
- [x] 50 automated tests (21 frontend + 29 backend)

---

## 🚢 Deployment

### Frontend → Vercel

**Dashboard settings:**
- Framework Preset: `Vite`
- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Environment variable to add:**
```
VITE_API_URL = https://task-manager-1-5tcs.onrender.com/api
```

### Backend → Render

**Dashboard settings:**
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `node src/index.js`

**Environment variables to add:**
```
NODE_ENV  = production
CLIENT_URL = https://task-manager-141.vercel.app
```

---

## ⚠️ Known Limitations

- **Single user** — no authentication; all visitors share the same task list
- **Free tier resets** — Render free tier doesn't have a persistent disk, so tasks are lost on redeploy (but survive normal restarts)
- **Cold starts** — Render free tier sleeps after 15 min; first request may take ~30s to wake up

## 🔮 Next Steps

- User authentication + accounts
- PostgreSQL for proper persistence
- Categories / labels
- Due date reminders
- Recurring tasks
- Docker support
