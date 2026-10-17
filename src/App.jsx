import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar,
} from 'recharts';
import { services, latencyHistory, trafficHistory, incidents, statusColor } from './data.js';
import './index.css';

function StatCard({ label, value, sub, color }) {
  return (
    <div className="stat-card">
      <div className="label">{label}</div>
      <div className="value" style={color ? { color } : {}}>{value}</div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  );
}

function ServiceCard({ svc }) {
  return (
    <div className={`svc-card ${svc.status}`}>
      <div className="svc-head">
        <h3>{svc.name}</h3>
        <span className={`badge ${svc.status}`}>{svc.status}</span>
      </div>
      <div className="svc-meta">
        <span className="k">Uptime (30d)</span><span className="v">{svc.uptime}%</span>
        <span className="k">p50 / p95 / p99</span><span className="v">{svc.latencyP50} / {svc.latencyP95} / {svc.latencyP99} ms</span>
        <span className="k">Throughput</span><span className="v">{svc.reqPerSec.toLocaleString()} rps</span>
        <span className="k">Error rate</span><span className="v">{svc.errorRate}%</span>
        <span className="k">Region</span><span className="v">{svc.region}</span>
      </div>
    </div>
  );
}

export default function App() {
  const healthy = services.filter(s => s.status === 'healthy').length;
  const degraded = services.filter(s => s.status === 'degraded').length;
  const down = services.filter(s => s.status === 'down').length;
  const avgUptime = (services.reduce((a, s) => a + s.uptime, 0) / services.length).toFixed(2);
  const totalRps = services.reduce((a, s) => a + s.reqPerSec, 0).toLocaleString();

  return (
    <div className="app">
      <div className="header">
        <h1>Service<span>Pulse</span> — Microservice Health</h1>
        <div className="live"><span className="live-dot" />Live · us-east-1</div>
      </div>

      <div className="stats-row">
        <StatCard label="Services Healthy" value={`${healthy}/${services.length}`} color="#22c55e" sub={`${degraded} degraded · ${down} down`} />
        <StatCard label="Avg Uptime (30d)" value={`${avgUptime}%`} />
        <StatCard label="Total Throughput" value={totalRps} sub="requests / sec" />
        <StatCard label="Open Incidents" value={incidents.filter(i => i.severity !== 'info').length} color="#f59e0b" sub="2 warnings · 1 critical" />
      </div>

      <h2 className="section-title">Services</h2>
      <div className="services">
        {services.map(s => <ServiceCard key={s.id} svc={s} />)}
      </div>

      <div className="grid-2">
        <div className="panel">
          <h2>Latency Percentiles (24h)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={latencyHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} interval={3} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1f2937' }} />
              <Legend />
              <Line type="monotone" dataKey="p50" stroke="#38bdf8" name="p50" dot={false} />
              <Line type="monotone" dataKey="p95" stroke="#f59e0b" name="p95" dot={false} />
              <Line type="monotone" dataKey="p99" stroke="#ef4444" name="p99" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="panel">
          <h2>Request Volume vs Errors (24h)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trafficHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} interval={3} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1f2937' }} />
              <Legend />
              <Area type="monotone" dataKey="requests" stroke="#38bdf8" fill="#38bdf822" name="requests" />
              <Area type="monotone" dataKey="errors" stroke="#ef4444" fill="#ef444422" name="errors" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <h2>Recent Incidents</h2>
        <ul className="incidents">
          {incidents.map(i => (
            <li key={i.id}>
              <span className={`sev ${i.severity}`}>{i.severity}</span>
              <div><strong>{i.service}</strong> — {i.message}</div>
              <span className="inc-time">{i.time}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="footer">ServicePulse · demo dashboard with simulated telemetry · built with React + Recharts</div>
    </div>
  );
}
