# 🚀 Build With Sonu: Professional MERN Monorepo Template (2026)

A high-performance, production-ready starting point for Full-Stack applications using **npm Workspaces**, **ESLint 9+**, and **Prettier**.

This template provides a unified development environment for **React (Frontend)** and **Express (Backend)** with modern tooling and strict coding standards.

---

## 🛠 Features

- **Monorepo Management:** Powered by native **npm Workspaces** (one `package.json` at the root manages all sub-projects).
- **Automation:** Pre-configured VS Code settings for **Format on Save** and **Linting Auto-Fix**.
- **Backend Architecture:** Professional separation of concerns: `app.js` (logic/middleware) vs. `server.js` (entry point).
- **Unified Scripts:** Run, build, test, and clean the entire stack from the root directory.
- **Modern Standards:** Uses **ESLint Flat Config (`eslint.config.mjs`)**, ES Modules (ESM), and cross-platform environment handling.

---

## 📂 Project Structure

```text
.
├── .vscode/            # Shared editor settings & extensions
├── backend/            # Express API (Node.js)
│   ├── src/
│   │   ├── config/     # DB & Config logic
│   │   ├── controllers/# Route handlers
│   │   ├── models/     # Database schemas
│   │   ├── routes/     # API Endpoints
│   │   ├── utils/      # Utility functions
│   │   ├── app.js      # App middleware/setup
│   │   └── server.js   # Server entry point
│   └── .env.example    # Backend env template
├── frontend/           # React/Vite Client
│   ├── .env.example    # Frontend env template
│   └── (Your frontend framework structure here)
├── eslint.config.mjs   # Root linting rules
├── .prettierrc         # Root code formatting rules
├── .prettierignore     # Files to ignore for Prettier
├── .env.example        # Root environment variables template
└── package.json        # Root workspace orchestration

```

---

## 🚀 Quick Start

### 1. Initialize the Frontend

Since this is a flexible template, the frontend directory is a shell. Initialize your preferred framework (e.g., Vite + React) before installing dependencies:

```bash
# From the root directory
npm create vite@latest frontend -- --template react
```

### 2. Installation

Install all dependencies for the entire project (Root, Backend, and Frontend) with a single command from the root folder:

```bash
npm install
```

### 3. Environment Setup

Before starting, ensure you set up your environment variables. Copy the example files to create your own `.env` files:

**Windows (Command Prompt):**

```cmd
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
copy .env.example .env
```

**Windows (PowerShell) or Mac/Linux:**

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp .env.example .env
```

### 4. Development

Starts both Frontend (once initialized) and Backend in development mode concurrently:

```bash
npm run dev
```

---

## 📜 Build & Maintain

Run these commands from the **root** directory:

| Command             | Action                                                                   |
| :------------------ | :----------------------------------------------------------------------- |
| `npm run dev`       | Starts both Frontend and Backend in development mode with hot-reloading. |
| `npm run build`     | Builds all workspaces (Frontend & Backend) for production.               |
| `npm run lint`      | Checks code for errors across the whole project.                         |
| `npm run lint:fix`  | Auto-fixes linting issues project-wide.                                  |
| `npm run format`    | Auto-formats code using Prettier standards.                              |
| `npm run clean`     | **Nukes** `node_modules` and build artifacts for a fresh start.          |
| `npm run reinstall` | Fully resets the environment and reinstalls dependencies.                |

Check individual `package.json` files in `backend/` and `frontend/` for workspace-specific scripts.

---

## 🛡 Code Standards

This project enforces strict coding standards to ensure consistency across the team:

### Formatting

- **Tab Width:** 4
- **Quotes:** Double (`"`)
- **Commas:** Trailing commas enabled

### Linting

- **Warnings:** For unused variables.
- **Errors:** For critical styling/syntax violations.

### VS Code

- Essential extensions (ESLint/Prettier) are recommended automatically upon opening.

Feel free to customize the `eslint.config.mjs`, `.prettierrc` and `settings.json` files to suit your team's preferences.

---

## 📦 Dev Dependencies

### Root

- eslint (for linting)
- prettier (for code formatting)
- concurrently (for running multiple scripts)
- rimraf (for cross-platform cleaning)

### Backend

- cross-env (for cross-platform env variables)
- nodemon (for development auto-restarts)

Feel free to explore and modify the dependencies as per your project requirements!

---

## 📝 Usage Notes

### Adding Packages

Since this is a monorepo, you must specify the workspace when installing new packages to maintain a single `package-lock.json` at the root.

**To add a package to the Backend:**

```bash
npm install <package-name> -w backend
```

**To add a package to the Frontend:**

```bash
npm install <package-name> -w frontend
```

### Managing Empty Folders

The project uses `.gitkeep` files to ensure that the professional directory structure (`controllers`, `models`, etc.) is tracked by Git even before code is added.
Once you add a real file to a folder, you can safely delete the .gitkeep file.

---

## 💡 Pro Tips for 2026

- **Node Watch Mode:** Use `node --watch` for automatic restarts in development instead of nodemon if you prefer native solutions (Node.js 18+).
- **Cross-Env:** Environment variables are set using `cross-env` to ensure the scripts work flawlessly on Windows, Mac, and Linux.

## 👤 Author

Built by Siva Peddinti (Build With Sonu)

- **GitHub**: [@SivaPeddinti](https://github.com/peddintisonu)
- **LinkedIn**: [Siva Peddinti](https://www.linkedin.com/in/siva-vardhan-peddinti/)
- **Status**: Building the future of MERN development.

⭐ **If you find this template helpful, please give it a star!**
