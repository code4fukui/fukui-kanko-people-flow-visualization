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

- [Node.js](https://nodejs.org/) (18+)
- [pnpm](https://pnpm.io/) (workspace-aware package manager)

### Install Dependencies

```bash
pnpm install
```

### Start Development

- Start all apps and data server:
  ```bash
  pnpm dev
  ```
- Start only the main app (`whole`):
  ```bash
  pnpm dev:whole
  ```
- Start a specific app (e.g., `fukui-terminal`):
  ```bash
  pnpm dev:fukui-terminal
  ```
- Start landing page only:
  ```bash
  pnpm dev:landing
  ```

### Accessing Apps

- Landing Page: [http://localhost:3004](http://localhost:3004)
- Whole (main): [http://localhost:3000](http://localhost:3000)
- Fukui Terminal: [http://localhost:3001](http://localhost:3001)
- Tojinbo: [http://localhost:3002](http://localhost:3002)
- Rainbow Line: [http://localhost:3003](http://localhost:3003)

### Data Server

To serve raw data locally (required for non-`whole` apps):

```bash
pnpm serve:data
```

### Update Data Submodule

To fetch the latest people flow data:

```bash
pnpm submodule
```

### Build

```bash
pnpm build
```

### Lint

```bash
pnpm lint
```

## 📦 Monorepo Applications

### 1. `whole`

- **Purpose**: Main dashboard for aggregated data across all locations.
- **Features**: Interactive graphs, date range selection, data export, starred series.
- **Tech**: React, Vite, Tailwind CSS, Recharts, Radix UI.

### 2. `landing-page`

- **Purpose**: Entry point with navigation to all sub-applications.
- **Features**: Responsive design, QR code linking.
- **Tech**: React, Vite, Tailwind CSS.

### 3. `fukui-terminal`

- **Purpose**: Visualization for Fukui Station East Entrance.
- **Features**: Period-based graphs, data comparison.
- **Tech**: React, Vite, Tailwind CSS, Recharts.

### 4. `tojinbo`

- **Purpose**: Visualization for Tojinbo coastal area.
- **Features**: Area-specific data analysis.
- **Tech**: React, Vite, Tailwind CSS, Recharts.

### 5. `rainbow-line`

- **Purpose**: Parking lot usage analysis along the Rainbow Line scenic road.
- **Features**: Parking lot filters, aggregated/daily views.
- **Tech**: React, Vite, Tailwind CSS, Recharts.

### 6. `shared`

- **Purpose**: Reusable components, hooks, and utilities.
- **Exports**: UI components, data utilities, types, constants.

## 🚀 Deployment

- GitHub Pages is automatically deployed for the `main` branch via `.github/workflows/pages.yml`.
- Development branches are deployed to S3/CloudFront using `tools/upload.sh`.

## 📜 License

This project is licensed under the terms of the [MIT License](LICENSE).
