# Fukui Prefecture Tourism DX AI Camera Open Data Visualization

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

**福井県観光DX AIカメラオープンデータ可視化ウェブアプリケーション**

This repository contains a web application for visualizing people flow and related data collected by AI cameras as part of the Fukui Prefecture Tourism DX initiative. The project is structured as a pnpm monorepo, comprising multiple Vite+React applications and a shared component library.

[
![Deploy to GitHub Pages](https://github.com/code4fukui/fukui-kanko-people-flow-visualization/actions/workflows/pages.yml/badge.svg)
](https://github.com/code4fukui/fukui-kanko-people-flow-visualization/actions/workflows/pages.yml)
[
![Update Submodule](https://github.com/code4fukui/fukui-kanko-people-flow-visualization/actions/workflows/submodule.yml/badge.svg)
](https://github.com/code4fukui/fukui-kanko-people-flow-visualization/actions/workflows/submodule.yml)

---

## ✨ Live Application

[**Open the Application**](https://code4fukui.github.io/fukui-kanko-people-flow-visualization/)

*The data is updated daily at approximately 1:00 AM JST.*

## 🚀 Features

- **Comprehensive Visualization**: An interactive dashboard (`whole`) to explore aggregated data across all locations with features like date range selection, favorite series, and data export.
- **Area-Specific Dashboards**: Dedicated applications for visualizing data from specific tourist spots, including Fukui Station, Tojinbo, and the Rainbow Line scenic road.
- **Monorepo Architecture**: A scalable pnpm workspace that organizes multiple applications and a shared library for maximum code reuse and maintainability.
- **Shared Component Library**: A centralized `@fukui-kanko/shared` package provides UI components, hooks, and utilities to ensure a consistent user experience across all apps.
- **Automated Data Pipeline**: People flow data is managed as a Git submodule and updated daily via a scheduled GitHub Action.
- **CI/CD**: Automated deployment to GitHub Pages for the main branch and S3/CloudFront for development branches.

## 🛠️ Technology Stack

- **Framework**: React 18, Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Charting**: Recharts
- **Package Manager**: pnpm (workspaces)
- **Linting/Formatting**: ESLint, Prettier
- **CI/CD**: GitHub Actions

## 📂 Project Structure

The repository is a monorepo containing several packages:

```
fukui-kanko-people-flow-visualization/
├── packages/
│   ├── whole/           # Main comprehensive visualization app
│   ├── landing-page/    # Project landing page
│   ├── fukui-terminal/  # Fukui Station area visualization
│   ├── tojinbo/         # Tojinbo area visualization
│   ├── rainbow-line/    # Rainbow Line parking lot visualization
│   └── shared/          # Shared components, hooks, and utilities
├── data/                # Git submodule for people flow data
└── tools/               # Utility and deployment scripts
```

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/) (v9 or later)

### Installation

Clone the repository and install dependencies. The `--recursive` flag is needed to initialize the `data` submodule.

```bash
git clone --recursive https://github.com/code4fukui/fukui-kanko-people-flow-visualization.git
cd fukui-kanko-people-flow-visualization
pnpm install
```

### Running the Development Servers

You can run all applications simultaneously or start a specific one. A local data server will also be started on port `4000`.

```bash
# Start all apps and the data server
pnpm dev

# Start only the main 'whole' application
pnpm dev:whole

# Start only the Fukui Station application
pnpm dev:fukui-terminal
```

Once running, the applications will be available at the following local URLs:

- **Landing Page**: [http://localhost:3004](http://localhost:3004)
- **Whole (Main App)**: [http://localhost:3000](http://localhost:3000)
- **Fukui Terminal**: [http://localhost:3001](http://localhost:3001)
- **Tojinbo**: [http://localhost:3002](http://localhost:3002)
- **Rainbow Line**: [http://localhost:3003](http://localhost:3003)

### Available Scripts

| Command          | Description                                                              |
| ---------------- | ------------------------------------------------------------------------ |
| `pnpm dev`       | Starts all applications and the local data server in development mode.   |
| `pnpm build`     | Builds all applications for production.                                  |
| `pnpm lint`      | Lints and checks for code quality issues across the entire monorepo.     |
| `pnpm submodule` | Manually updates the data submodule to fetch the latest people flow data. |

## 📊 Data Handling

- The people flow data is managed as a Git submodule located in the `data/people-flow-data` directory.
- For local development, data is served from `http://localhost:4000`.
- The `whole` application copies the data into its `public` directory during development and build steps for direct access.
- The data submodule is automatically updated daily on the `main` branch by the [`.github/workflows/submodule.yml`](.github/workflows/submodule.yml) workflow.

## 🚀 Deployment

- The main application is automatically deployed to GitHub Pages from the `main` branch via the [`.github/workflows/pages.yml`](.github/workflows/pages.yml) workflow.
- The `tools/upload.sh` script is available for manual deployments to an S3/CloudFront environment, typically used for staging or development previews from forked repositories.

## 🙏 Acknowledgements

- Fukui Prefecture Tourism DX Project
- Code for Fukui

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.