import { useState } from "react";
import { Activity, Server, Database, HardDrive, ShieldCheck, AlertTriangle, RefreshCw, Clock } from "lucide-react";

export default function SuperAdminMonitoring() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const metrics = [
    { label: "API p95 Latency", value: "214 ms", status: "Within 300 ms SLA", isGood: true },
    { label: "Error Rate (5xx)", value: "0.03%", status: "Nominal", isGood: true },
    { label: "BullMQ Job Wait", value: "12 sec", status: "Nominal", isGood: true },
    { label: "Failed Webhooks", value: "2", status: "Retrying auto-queue", isGood: false },
    { label: "Last Encrypted Backup", value: "03:00 IST", status: "Integrity verified", isGood: true },
    { label: "S3 Storage Consumed", value: "1.8 TB", status: "62% quota allocated", isGood: true }
  ];

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto pb-12 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink m-0">
            Infrastructure Monitoring & Telemetry
          </h1>
          <p className="text-sm text-ink-secondary mt-1 mb-0">
            Real-time multi-tenant health, background queues, and database latency (ap-south-1).
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-white border border-line hover:bg-surface text-ink text-xs sm:text-sm font-bold rounded-xl shadow-xs flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 text-primary ${refreshing ? "animate-spin" : ""}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* 6-Grid Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-line shadow-2xs flex flex-col justify-between">
            <span className="text-xs font-bold text-ink-secondary uppercase tracking-wider">{m.label}</span>
            <div className="my-2 text-2xl font-extrabold text-ink font-mono">{m.value}</div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md self-start ${
              m.isGood ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" : "bg-amber-50 text-amber-700 border border-amber-200/50"
            }`}>
              {m.status}
            </span>
          </div>
        ))}
      </div>

      {/* Hourly Requests Bar Chart Visualization */}
      <div className="bg-white rounded-2xl border border-line p-6 shadow-2xs space-y-4">
        <div className="flex justify-between items-baseline">
          <div>
            <h2 className="text-base font-bold text-ink m-0">Requests Per Hour (API Traffic Peak)</h2>
            <span className="text-xs text-ink-secondary">Attendance spike between 08:00 AM – 10:00 AM IST</span>
          </div>
          <span className="text-xs font-mono font-bold text-primary">Peak: 46k req/hr</span>
        </div>

        <div className="h-36 flex items-end gap-1.5 pt-6 border-b border-line">
          {[
            { hour: "00", h: 6, req: "2k" },
            { hour: "02", h: 4, req: "1k" },
            { hour: "04", h: 4, req: "1k" },
            { hour: "06", h: 25, req: "9k" },
            { hour: "07", h: 78, req: "28k" },
            { hour: "08", h: 128, req: "46k", peak: true },
            { hour: "09", h: 114, req: "41k", peak: true },
            { hour: "10", h: 83, req: "30k" },
            { hour: "11", h: 72, req: "26k" },
            { hour: "12", h: 67, req: "24k" },
            { hour: "13", h: 61, req: "22k" },
            { hour: "14", h: 70, req: "25k" },
            { hour: "15", h: 58, req: "21k" },
            { hour: "16", h: 50, req: "18k" },
            { hour: "17", h: 33, req: "12k" },
            { hour: "18", h: 25, req: "9k" },
            { hour: "20", h: 17, req: "6k" },
            { hour: "22", h: 8, req: "3k" }
          ].map((bar, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
              <div 
                style={{ height: `${bar.h}px` }}
                className={`w-full rounded-t-md transition-all ${
                  bar.peak ? "bg-primary group-hover:bg-primary-dark" : "bg-primary-tint hover:bg-primary-tint/80"
                }`}
              />
              <span className="text-[10px] text-ink-secondary font-mono">{bar.hour}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Services Health Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-line shadow-2xs flex items-center gap-3">
          <Server className="w-5 h-5 text-emerald-600" />
          <div>
            <div className="text-sm font-bold text-ink">Node.js Express Cluster</div>
            <div className="text-xs text-emerald-700 font-semibold">4 Workers Healthy · 0% restarts</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-line shadow-2xs flex items-center gap-3">
          <Database className="w-5 h-5 text-emerald-600" />
          <div>
            <div className="text-sm font-bold text-ink">MongoDB Atlas Primary</div>
            <div className="text-xs text-emerald-700 font-semibold">CPU 14% · 18ms Query Latency</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-line shadow-2xs flex items-center gap-3">
          <Activity className="w-5 h-5 text-emerald-600" />
          <div>
            <div className="text-sm font-bold text-ink">WhatsApp & SMS Gateways</div>
            <div className="text-xs text-emerald-700 font-semibold">DLT AirTel & Meta Cloud 100% Up</div>
          </div>
        </div>
      </div>

    </div>
  );
}
