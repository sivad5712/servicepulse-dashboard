// Mock microservice telemetry — simulates a distributed backend
export const services = [
  { id: 'auth-svc', name: 'Auth Service', status: 'healthy', uptime: 99.99, latencyP50: 42, latencyP95: 118, latencyP99: 210, reqPerSec: 1240, errorRate: 0.02, region: 'us-east-1' },
  { id: 'orders-api', name: 'Orders API', status: 'healthy', uptime: 99.97, latencyP50: 68, latencyP95: 190, latencyP99: 340, reqPerSec: 860, errorRate: 0.05, region: 'us-east-1' },
  { id: 'payments-svc', name: 'Payments Service', status: 'degraded', uptime: 99.91, latencyP50: 145, latencyP95: 480, latencyP99: 920, reqPerSec: 320, errorRate: 1.24, region: 'us-west-2' },
  { id: 'notify-svc', name: 'Notification Service', status: 'healthy', uptime: 99.98, latencyP50: 55, latencyP95: 150, latencyP99: 280, reqPerSec: 2100, errorRate: 0.03, region: 'eu-west-1' },
  { id: 'search-svc', name: 'Search Service', status: 'healthy', uptime: 99.95, latencyP50: 89, latencyP95: 240, latencyP99: 410, reqPerSec: 1540, errorRate: 0.08, region: 'us-east-1' },
  { id: 'billing-worker', name: 'Billing Worker', status: 'down', uptime: 97.20, latencyP50: 0, latencyP95: 0, latencyP99: 0, reqPerSec: 0, errorRate: 100, region: 'us-west-2' },
];

export const latencyHistory = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  p50: 40 + Math.round(Math.random() * 30),
  p95: 120 + Math.round(Math.random() * 90),
  p99: 220 + Math.round(Math.random() * 160),
}));

export const trafficHistory = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  requests: 800 + Math.round(Math.random() * 1600),
  errors: Math.round(Math.random() * 40),
}));

export const incidents = [
  { id: 1, service: 'Billing Worker', severity: 'critical', message: 'No heartbeat for 4m 12s — pod CrashLoopBackOff', time: '12 min ago' },
  { id: 2, service: 'Payments Service', severity: 'warning', message: 'p99 latency breached 800ms SLO (920ms)', time: '38 min ago' },
  { id: 3, service: 'Payments Service', severity: 'warning', message: 'Error rate above 1% for 10m window', time: '1 hr ago' },
  { id: 4, service: 'Orders API', severity: 'info', message: 'Autoscaled from 4 to 6 replicas', time: '2 hrs ago' },
  { id: 5, service: 'Search Service', severity: 'info', message: 'Deployment v2.14.3 completed', time: '5 hrs ago' },
];

export const statusColor = {
  healthy: '#22c55e',
  degraded: '#f59e0b',
  down: '#ef4444',
};
