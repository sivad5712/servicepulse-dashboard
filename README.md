# ServicePulse — Microservice Health Dashboard

A real-time monitoring dashboard for distributed microservice architectures. Visualizes service health, latency percentiles, throughput, and incidents in a clean dark-themed UI.

**Live demo:** https://sivad5712.github.io/servicepulse-dashboard/

## Features

- **Service health overview** — per-service status (healthy / degraded / down) with uptime, latency p50/p95/p99, throughput, and error rates
- **Latency charts** — 24-hour p50/p95/p99 percentile trends
- **Traffic vs errors** — request volume overlaid with error counts
- **Incident feed** — recent alerts with severity levels and timestamps
- **Live indicator** — pulsing status dot for at-a-glance system state

## Tech Stack

- React 18 + Vite 5
- Recharts for data visualization
- Pure CSS (no UI framework) dark theme

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

Live on GitHub Pages: https://sivad5712.github.io/servicepulse-dashboard/ — pushes to the `gh-pages` branch auto-deploy.

## What I Learned

- Designing SLO-driven dashboards (p50/p95/p99 latency, error budgets)
- Visualizing time-series telemetry with Recharts
- Building responsive dark-theme UIs with pure CSS

## License

MIT
