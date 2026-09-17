# SANKET-AI — Frontend Prototype
> **Predict. Explain. Prioritise. Act. Track.**  
> Explainable AI-powered Infrastructure Project Monitoring & Risk Prediction Platform  
> **Smart India Hackathon 2026** | Problem Statement: **SIH26103** | Ministry: **MoSPI / PAIMANA**

---

## 📋 Prerequisites

Before running the project, ensure you have the following installed on your system:
- **Node.js**: v18.0.0 or higher (Recommended: v20.x or latest LTS) — [Download Node.js](https://nodejs.org/)
- **npm**: v9.0.0 or higher (comes bundled with Node.js)
- A modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Brave, etc.)

---

## 🚀 Quick Start / How to Run Locally

Follow these simple steps to run the frontend on your local machine:

### 1. Open Terminal & Navigate to `frontend/` Folder
Agar aap repository ke root folder me hain, toh pehle `frontend` folder me enter karein:
```bash
cd frontend
```

### 2. Install Dependencies
Project ki saari zaroori packages install karne ke liye:
```bash
npm install
```

### 3. Start the Development Server
Development server start karein:
```bash
npm run dev
```

Terminal me running link dikhega:
```
  VITE v8.3.0  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 4. Open in Your Browser
Apne browser me yeh URL open karein:
👉 **[http://localhost:5173/](http://localhost:5173/)**

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local Vite development server with Hot Module Replacement (HMR) at `http://localhost:5173` |
| `npm run build` | Compiles TypeScript and builds production-ready bundle inside `dist/` |
| `npm run preview` | Locally previews the production build created by `npm run build` |
| `npm run lint` | Runs fast Oxlint code quality checks |

---

## 🧭 Navigating the Prototype & SIH Demo Features

### 1. Dedicated Role Workflows (Top Bar 1-Click Switcher)
Header ke top-right me aap role switch kar sakte hain:
- **Policymaker (`/policymaker`)**: National risk posture, interactive India SVG state risk map, sector exposures, and cabinet priority projects.
- **Administrator (`/administrator`)**: Project portfolio register, 7-criteria filter toolbar, three-pillar cost/progress/schedule overruns, and statutory interventions.
- **Monitoring Officer (`/monitoring` or `/monitoring/watchlist`)**: **Hero Feature** — Priority Watchlist answering *"Which project should I review first?"*, real-time warning signals, alert center, and field action logging.

### 2. Flagship Showcase: Project Intelligence Dossier
Visit any project directly, e.g. **[http://localhost:5173/project/615186](http://localhost:5173/project/615186)** to inspect the 10-section end-to-end intelligence workflow:
$$\text{PROJECT} \longrightarrow \text{HEALTH} \longrightarrow \text{RISK} \longrightarrow \text{WHY? (SHAP)} \longrightarrow \text{EVIDENCE} \longrightarrow \text{REVIEW} \longrightarrow \text{ACTION} \longrightarrow \text{TRACK}$$

### 3. Global Project Search (`Ctrl + K`)
- Press **`Ctrl + K`** (ya header me Search button click karein).
- Search instantly by **Project ID** (e.g. `615186`), **Project Name**, **Ministry**, **Sector**, or **State**.
- Click any search result to jump straight into its complete Project Intelligence dossier.

### 4. Interactive State & Action Persistence
- Koi bhi naya action create karein ya status change karein (`Mark Completed ✓`), data turant update hota hai aur browser ke `localStorage` me persist rehta hai.

---

## 🏗️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 8
- **Routing**: React Router DOM v7 (Multi-page SPA architecture)
- **Styling**: Tailwind CSS + Custom Institutional Design System Tokens
- **Icons**: Lucide React
- **Linter**: Oxlint
