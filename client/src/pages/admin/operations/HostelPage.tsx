import React, { useState } from "react";
import {
  FiHome,
  FiUser,
  FiPlus,
  FiFilter,
  FiCheckCircle,
  FiAlertCircle,
  FiCoffee,
  FiShield
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface HostelRoom {
  roomNo: string;
  block: string;
  floor: string;
  capacity: number;
  allotted: number;
  type: "AC" | "Non-AC";
  gender: "Boys" | "Girls";
  warden: string;
}

const ROOMS_DATA: HostelRoom[] = [
  { roomNo: "B-101", block: "Tagore Block", floor: "1st Floor", capacity: 4, allotted: 4, type: "Non-AC", gender: "Boys", warden: "Suraj Prakash" },
  { roomNo: "B-102", block: "Tagore Block", floor: "1st Floor", capacity: 4, allotted: 3, type: "Non-AC", gender: "Boys", warden: "Suraj Prakash" },
  { roomNo: "B-201", block: "Tagore Block", floor: "2nd Floor", capacity: 3, allotted: 2, type: "AC", gender: "Boys", warden: "Suraj Prakash" },
  { roomNo: "G-101", block: "Gargi Block", floor: "1st Floor", capacity: 4, allotted: 4, type: "AC", gender: "Girls", warden: "Meenakshi Vyas" },
  { roomNo: "G-102", block: "Gargi Block", floor: "1st Floor", capacity: 4, allotted: 3, type: "Non-AC", gender: "Girls", warden: "Meenakshi Vyas" },
  { roomNo: "G-201", block: "Gargi Block", floor: "2nd Floor", capacity: 3, allotted: 1, type: "AC", gender: "Girls", warden: "Meenakshi Vyas" }
];

export default function HostelPage() {
  const { showToast } = useToast();
  const [selectedBlock, setSelectedBlock] = useState("All");

  const totalBeds = ROOMS_DATA.reduce((sum, r) => sum + r.capacity, 0);
  const occupiedBeds = ROOMS_DATA.reduce((sum, r) => sum + r.allotted, 0);
  const vacantBeds = totalBeds - occupiedBeds;

  const filtered = ROOMS_DATA.filter(
    r => selectedBlock === "All" || r.block === selectedBlock
  );

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-navy">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-navy-muted tracking-wide uppercase">
            Operations › Residential Life
          </div>
          <h1 className="text-2xl font-bold text-navy mt-1">Hostel & Boarding Management</h1>
          <p className="text-xs text-navy-muted mt-0.5">
            Room inventory, student bed allotment, mess meal plans, and warden night roll call logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast("Allotment wizard opened.", "info")}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal hover:bg-teal-hover text-white rounded-control text-xs font-bold shadow-xs transition"
          >
            <FiPlus size={15} /> Allot Room / Bed
          </button>
        </div>
      </div>

      {/* Capacity KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-navy-muted font-medium">Total Hostel Beds</div>
          <div className="font-mono text-2xl font-bold text-navy">{totalBeds}</div>
        </div>
        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-emerald-700 font-medium">Occupied Beds</div>
          <div className="font-mono text-2xl font-bold text-emerald-700">{occupiedBeds}</div>
        </div>
        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-teal font-medium">Vacant Ready Beds</div>
          <div className="font-mono text-2xl font-bold text-teal">{vacantBeds}</div>
        </div>
        <div className="bg-surface border border-line rounded-panel p-4 shadow-sm space-y-1">
          <div className="text-xs text-navy-muted font-medium">Occupancy Rate</div>
          <div className="font-mono text-2xl font-bold text-navy">
            {Math.round((occupiedBeds / totalBeds) * 100)}%
          </div>
        </div>
      </div>

      {/* Filter and Room Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm text-navy uppercase tracking-wider">Rooms Directory</h2>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-navy-muted font-medium">Block:</span>
            <select
              value={selectedBlock}
              onChange={e => setSelectedBlock(e.target.value)}
              className="bg-surface border border-line rounded-control px-2.5 py-1 text-xs text-navy font-semibold focus:outline-none"
            >
              <option value="All">All Blocks</option>
              <option value="Tagore Block">Tagore Block (Boys)</option>
              <option value="Gargi Block">Gargi Block (Girls)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(r => {
            const isFull = r.allotted === r.capacity;
            return (
              <div
                key={r.roomNo}
                className="bg-surface border border-line rounded-panel p-4 shadow-sm hover:shadow-md transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-base text-navy">Room {r.roomNo}</div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isFull
                        ? "bg-slate-100 text-slate-700 border border-slate-300"
                        : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    }`}
                  >
                    {isFull ? "Fully Occupied" : `${r.capacity - r.allotted} Beds Available`}
                  </span>
                </div>

                <div className="text-xs text-navy-muted space-y-1">
                  <div>{r.block} · {r.floor}</div>
                  <div className="flex items-center gap-2 font-medium text-navy">
                    <span className="px-1.5 py-0.5 rounded bg-page border text-[10px]">{r.type}</span>
                    <span className="px-1.5 py-0.5 rounded bg-page border text-[10px]">{r.gender}</span>
                  </div>
                  <div className="text-[11px] pt-1">Resident Warden: <b>{r.warden}</b></div>
                </div>

                {/* Bed visual occupancy circles */}
                <div className="pt-2 border-t border-line flex items-center justify-between text-xs">
                  <span className="text-navy-muted font-medium text-[11px]">Bed Status:</span>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: r.capacity }).map((_, i) => (
                      <span
                        key={i}
                        className={`w-3.5 h-3.5 rounded-full border ${
                          i < r.allotted
                            ? "bg-teal border-teal"
                            : "bg-page border-dashed border-line"
                        }`}
                        title={i < r.allotted ? "Bed Occupied" : "Bed Available"}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
