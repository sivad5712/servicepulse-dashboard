import React from 'react';
import { services, latencyHistory, trafficHistory, incidents } from './data.js';
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

// Lightweight SVG line chart
function LineChart({ data, lines, height = 260 }) {
  const W = 600, H = height, P = 36;
  const maxV = Math.max(...data.flatMap(d => lines.map(l => d[l.key]))) * 1.1;
  const x = i => P + (i / (data.length - 1)) * (W - P * 2);
  const y = v => H - P - (v / maxV) * (H - P * 2);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={height}>
      {[0.25, 0.5, 0.75, 1].map(f => (
        <line key={f} x1={P} x2={W - P} y1={y(maxV * f)} y2={y(maxV * f)} stroke="#1f2937" strokeDasharray="3 3" />
      ))}
      {lines.map(l => (
        <polyline key={l.key} fill="none" stroke={l.color} strokeWidth="2"
          points={data.map((d, i) => `${x(i)},${y(d[l.key])}`).join(' ')} />
      ))}
      {data.filter((_, i) => i % 4 === 0).map((d, i) => (
        <text key={i} x={x(i * 4)} y={H - 10} fill="#64748b" fontSize="10" textAnchor="middle">{d.time}</text>
      ))}
      <g>
        {lines.map((l, i) => (
          <g key={l.key} transform={`translate(${W - 140}, ${12 + i * 18})`}>
            <rect width="24" height="4" fill={l.color} y="-3" />
            <text x="30" fill="#94a3b8" fontSize="11">{l.name}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

// Lightweight SVG area/bar combo
function TrafficChart({ data, height = 260 }) {
  const W = 600, H = height, P = 36;
  const maxR = Math.max(...data.map(d => d.requests)) * 1.1;
  const maxE = Math.max(...data.map(d => d.errors), 1) * 1.1;
  const x = i => P + (i / (data.length - 1)) * (W - P * 2);
  const yR = v => H - P - (v / maxR) * (H - P * 2);
  const yE = v => H - P - (v / maxE) * (H - P * 2);
  const pts = data.map((d, i) => `${x(i)},${yR(d.requests)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={height}>
      <polygon points={`${P},${H - P} ${pts} ${W - P},${H - P}`} fill="#38bdf822" />
      <polyline fill="none" stroke="#38bdf8" strokeWidth="2" points={pts} />
      {data.map((d, i) => (
        <rect key={i} x={x(i) - 2} y={yE(d.errors)} width="4" height={H - P - yE(d.errors)} fill="#ef444488" />
      ))}
      {data.filter((_, i) => i % 4 === 0).map((d, i) => (
        <text key={i} x={x(i * 4)} y={H - 10} fill="#64748b" fontSize="10" textAnchor="middle">{d.time}</text>
      ))}
      <g transform={`translate(${W - 160}, 12)`}>
        <rect width="24" height="4" fill="#38bdf8" y="-3" /><text x="30" fill="#94a3b8" fontSize="11">requests</text>
      </g>
      <g transform={`translate(${W - 160}, 30)`}>
        <rect width="24" height="8" fill="#ef444488" /><text x="30" fill="#94a3b8" fontSize="11">errors</text>
      </g>
    </svg>
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
          <LineChart data={latencyHistory} lines={[
            { key: 'p50', name: 'p50', color: '#38bdf8' },
            { key: 'p95', name: 'p95', color: '#f59e0b' },
            { key: 'p99', name: 'p99', color: '#ef4444' },
          ]} />
        </div>
        <div className="panel">
          <h2>Request Volume vs Errors (24h)</h2>
          <TrafficChart data={trafficHistory} />
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

      <div className="footer">ServicePulse · demo dashboard with simulated telemetry · built with React + custom SVG charts</div>
    </div>
  );
}
