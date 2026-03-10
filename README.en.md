# Fukui Prefecture Tourism DX AI Camera Open Data Visualization Web Application

This repository provides a monorepo for visualizing people flow and related data collected via AI cameras as part of the Fukui Prefecture Tourism DX initiative. The project consists of multiple Vite+React applications, each focused on a specific visualization or feature, and a shared component library for code reuse.

[Open the Application](https://code4fukui.github.io/fukui-kanko-people-flow-visualization/) (updated daily at 1:00 AM JST)

---

## Project Structure

```
fukui-kanko-people-flow-visualization/
├── packages/
│   ├── whole/           # Comprehensive data visualization app
│   ├── landing-page/    # Landing page for the project
│   ├── fukui-terminal/  # Fukui Station area visualization
│   ├── tojinbo/         # Tojinbo area visualization
│   ├── rainbow-line/    # Rainbow Line parking lot visualization
│   └── shared/          # Shared components, utilities, hooks, and types
├── data/                # Data submodule (people flow data)
└── tools/               # Utility scripts
```

## Monorepo Applications

### 1. `whole`

- **Purpose:** Main, comprehensive visualization of people flow and related data across all monitored areas.
- **Features:**
  - Interactive graphs and charts
  - Date range selection
  - Starred/favorite series
  - Data export and sharing
- **Tech:** React, Vite, Tailwind CSS, Radix UI, Recharts

### 2. `landing-page`

- **Purpose:** Entry point and navigation for the visualization suite.
- **Features:**
  - Links to each sub-application
  - Responsive design
- **Tech:** React, Vite, Tailwind CSS

### 3. `fukui-terminal`

- **Purpose:** Visualization focused on the Fukui Station East Entrance area.
- **Features:**
  - Period-based graphs
  - Data comparison mode
- **Tech:** React, Vite, Tailwind CSS, Recharts

### 4. `tojinbo`

- **Purpose:** Visualization for the Tojinbo area.
- **Features:**
  - Similar to `fukui-terminal`, with area-specific data
- **Tech:** React, Vite, Tailwind CSS, Recharts

### 5. `rainbow-line`

- **Purpose:** Visualization for Rainbow Line parking lots.
- **Features:**
  - Parking lot-specific filters
  - Aggregated and daily data views
- **Tech:** React, Vite, Tailwind CSS, Recharts

### 6. `shared`

- **Purpose:** Shared library of UI components, hooks, utilities, types, and constants for all apps.
- **Exports:**
  - Components (UI, parts)
  - Hooks
  - Utilities
  - Types
  - Constants
  - Reducers

## Data

- Data is managed as a git submodule in the `data/people-flow-data` directory.
- For the `whole` app, data is copied into its `public` directory during development and build.
- Other apps load data from the data server (run via `serve:data` on port 4000) instead of copying it into `public`.

## Development

### Prerequisites

- [pnpm](https://pnpm.io/) (recommended)
- Node.js 18+

### Install dependencies

```bash
pnpm install
```

### Start development servers

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

### Build

```bash
pnpm build
```

### Lint

```bash
pnpm lint
```

### Data Submodule

To update the data submodule and copy the latest data:

```bash
pnpm submodule
```

## Deployment

- The GitHub Pages site is deployed automatically by the workflow defined in `.github/workflows/pages.yml` on the `main` branch of the upstream repository.
- The `tools/upload.sh` script deploys the built application to an S3/CloudFront environment.
- A dry-run of the data upload can be executed with `pnpm upload:data` (no actual upload is performed by default).

## License

See [LICENSE](LICENSE).

---

## Acknowledgements

- Fukui Prefecture Tourism DX Project
- Code for Fukui

---

## Contact

For questions or contributions, please open an issue or pull request on GitHub.
