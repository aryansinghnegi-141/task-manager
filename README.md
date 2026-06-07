# 📋 Taskr — Personal Task Manager

> This submission is for **Exercise 1: Personal Task Manager**.

A clean, modern, full-stack to-do application built with React, Express, and SQLite. Supports creating, editing, deleting, filtering, searching, and drag-and-drop reordering of tasks — all persisted to a SQLite database.

---

## Live Demo

| Service  | URL |
|----------|-----|
| Frontend | https://your-taskr.vercel.app *(update after deploy)* |
| Backend  | https://your-taskr-api.onrender.com *(update after deploy)* |

---

## Tech Stack

| Layer      | Technology           | Why chosen |
|------------|----------------------|------------|
| Frontend   | React 18 + Vite      | Fast HMR, modern JSX transform, excellent DX |
| Styling    | Tailwind CSS         | Utility-first, no CSS file bloat, consistent design tokens |
| HTTP Client| Axios                | Interceptors, auto-JSON, cleaner error handling than fetch |
| DnD        | @hello-pangea/dnd    | Actively maintained fork of react-beautiful-dnd; accessible |
| Backend    | Node.js + Express    | Lightweight, unopinionated, easy to structure |
| Database   | SQLite (better-sqlite3) | Zero-config, file-based, survives server restarts |
| Testing    | Vitest + Supertest   | Vitest is Vite-native; Supertest for real HTTP assertions |

---

## How to Run Locally

### Prerequisites
- Node.js 18+ 
- npm 9+

### 1. Clone the repository
```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```

### 2. Start the backend
```bash
cd server
npm install
npm run dev
# Server runs at http://localhost:3001
```

### 3. Start the frontend (new terminal)
```bash
cd client
npm install
npm run dev
# App opens at http://localhost:5173
```

---

## API Documentation

All endpoints are prefixed with `/api`. Successful responses use `{ success: true, data: ... }`. Errors use `{ success: false, message: "..." }`.

### `GET /api/tasks`
Returns all tasks ordered by drag-and-drop position.

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Write proposal",
      "description": "Q3 roadmap",
      "dueDate": "2024-12-31",
      "completed": false,
      "createdAt": "2024-06-05T10:00:00.000Z",
      "order": 0
    }
  ]
}
```

### `POST /api/tasks`
Creates a new task.

**Body** `{ title*, description?, dueDate? }`

**Response** `201` with the created task object.

### `PUT /api/tasks/:id`
Updates title, description, and/or dueDate.

**Body** `{ title?, description?, dueDate? }`

**Response** `200` with the updated task.

### `PATCH /api/tasks/:id/toggle`
Flips the `completed` status.

**Response** `200` with the updated task.

### `DELETE /api/tasks/:id`
Permanently deletes a task.

**Response** `200 { success: true, message: "Task deleted successfully." }`

### `PATCH /api/tasks/reorder`
Saves a new drag-and-drop order.

**Body** `{ tasks: [{ id, order }, ...] }`

**Response** `200` with the full reordered task list.

---

## Project Structure

```
task-manager/
│
├── client/                         # React frontend
│   ├── index.html                  # HTML entry point with Google Fonts
│   ├── vite.config.js              # Vite + Vitest config
│   ├── tailwind.config.js          # Custom design tokens
│   └── src/
│       ├── main.jsx                # React DOM root
│       ├── App.jsx                 # Root layout component
│       ├── components/
│       │   ├── TaskForm.jsx        # Create task form
│       │   ├── TaskCard.jsx        # Individual task card
│       │   ├── TaskList.jsx        # DnD-enabled list
│       │   ├── FilterBar.jsx       # Filter tabs + search
│       │   ├── StatsBar.jsx        # Stats tiles
│       │   ├── EditModal.jsx       # Edit task modal
│       │   ├── DeleteConfirmDialog.jsx
│       │   ├── Notification.jsx    # Success toast
│       │   ├── EmptyState.jsx
│       │   └── LoadingSkeleton.jsx
│       ├── hooks/
│       │   └── useTasks.js         # Central state & API logic
│       ├── services/
│       │   └── taskApi.js          # Axios API wrapper
│       ├── utils/
│       │   └── dateUtils.js        # Date formatting helpers
│       ├── styles/
│       │   └── index.css           # Tailwind directives + global styles
│       └── test/
│           ├── setup.js            # jest-dom setup
│           └── components.test.jsx # Component tests
│
├── server/                         # Express backend
│   ├── src/
│   │   ├── index.js                # Server entry point
│   │   ├── routes/
│   │   │   └── taskRoutes.js       # Route definitions
│   │   ├── controllers/
│   │   │   └── taskController.js   # Request/response handlers
│   │   ├── services/
│   │   │   └── taskService.js      # Business logic + DB queries
│   │   ├── middleware/
│   │   │   └── errorHandler.js     # Global error handler
│   │   └── storage/
│   │       └── database.js         # SQLite setup
│   └── tests/
│       └── tasks.test.js           # API integration tests
│
├── .gitignore
└── README.md
```

---

## Features Implemented

### ✅ Must Have
- [x] Create tasks (title required, description + dueDate optional)
- [x] View all tasks (newest first, all fields displayed)
- [x] Complete / Incomplete toggle (with visual change + strikethrough)
- [x] Edit tasks (modal with pre-filled fields, validation)
- [x] Delete tasks (with confirmation dialog)
- [x] Filter tasks (All / Active / Completed)

### ✅ Should Have
- [x] Task statistics (Total / Active / Completed tiles)
- [x] Overdue task highlighting (red border + ⚠ OVERDUE badge)
- [x] Empty state illustration (📋 with call-to-action copy)

### ✅ Bonus
- [x] Search tasks (by title, case-insensitive, works alongside filters)
- [x] Persistence (SQLite — survives server restart)
- [x] Drag-and-drop reordering (persisted to DB, restored after refresh)
- [x] Backend + Frontend tests

---

## Deployment

### Frontend → Vercel
1. Push the repo to GitHub
2. Import the project in Vercel, set **Root Directory** to `client`
3. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
4. Deploy

### Backend → Render
1. Create a new **Web Service** in Render, point to `server/`
2. Build command: `npm install`
3. Start command: `npm start`
4. Add environment variable: `CLIENT_URL=https://your-frontend.vercel.app`
5. Deploy

---

## Next Steps (Realistic Improvements)

- **Authentication** — user accounts so multiple people can use the app
- **Categories / Labels** — colour-coded tags for grouping tasks
- **Reminders** — browser notifications via the Web Notifications API
- **Recurring Tasks** — daily/weekly task templates
- **Pagination** — for users with hundreds of tasks
- **Docker** — containerise both services for easier self-hosting
- **Rate limiting** — protect the API from abuse in production

---

## Known Limitations

- **Single user only** — no authentication; everyone who accesses the app shares the same task list
- **SQLite is not horizontally scalable** — fine for a single-node deployment, but would need migrating to PostgreSQL for multi-instance production use
- **No offline support** — the app requires a live backend connection; a PWA approach with service workers could add offline capability
- **File size** — the SQLite DB grows unbounded; a cleanup job for old completed tasks would be wise in production
