import React, { useState } from "react";
import { FiX, FiPrinter, FiPlus, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";

interface RoomPlan {
  id: string;
  roomNumber: string;
  capacity: number;
  allocated: number;
  classes: string;
  rollRange: string;
  invigilators: string[];
}

interface SeatingPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  examName: string;
}

const INITIAL_ROOMS: RoomPlan[] = [
  {
    id: "r1",
    roomNumber: "Room 101 (Ground Floor)",
    capacity: 40,
    allocated: 40,
    classes: "Class 6-A & Class 8-B (Alternating benches)",
    rollRange: "6-A: 01–20 · 8-B: 01–20",
    invigilators: ["Sunita Rathore (PGT Biology)", "Vikram Singh (TGT Maths)"],
  },
  {
    id: "r2",
    roomNumber: "Room 102 (Ground Floor)",
    capacity: 40,
    allocated: 38,
    classes: "Class 6-B & Class 7-A (Alternating benches)",
    rollRange: "6-B: 01–19 · 7-A: 01–19",
    invigilators: ["Deepak Joshi (TGT English)", "Anjali Sharma (PRT Hindi)"],
  },
  {
    id: "r3",
    roomNumber: "Room 201 (First Floor)",
    capacity: 40,
    allocated: 40,
    classes: "Class 7-B & Class 8-A (Alternating benches)",
    rollRange: "7-B: 01–20 · 8-A: 01–20",
    invigilators: ["Kavita Meena (TGT Science)"], // Missing 1
  },
  {
    id: "r4",
    roomNumber: "Room 202 (First Floor)",
    capacity: 40,
    allocated: 36,
    classes: "Class 7-C & Class 8-C (Alternating benches)",
    rollRange: "7-C: 01–18 · 8-C: 01–18",
    invigilators: ["Rajesh Kumawat (TGT Sanskrit)", "Pooja Verma (PRT Art)"],
  },
  {
    id: "r5",
    roomNumber: "Auditorium Annex",
    capacity: 60,
    allocated: 52,
    classes: "Class 6-C (All) & Overflow",
    rollRange: "6-C: 01–38 · Extra seats: 14",
    invigilators: ["Mohan Lal (Sports Teacher)", "Dr. S. K. Gupta (Senior PGT)"],
  },
];

export default function SeatingPlanModal({ isOpen, onClose, examName }: SeatingPlanModalProps) {
  const [rooms] = useState<RoomPlan[]>(INITIAL_ROOMS);

  if (!isOpen) return null;

  const totalSeats = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const totalAllocated = rooms.reduce((acc, r) => acc + r.allocated, 0);
  const missingInvigilators = rooms.filter((r) => r.invigilators.length < 2).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-line rounded-card shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-surface">
          <div>
            <h3 className="font-semibold text-lg text-ink">Examination Seating Plan</h3>
            <p className="text-xs text-ink-secondary">{examName} · 5 Examination Rooms · Alternating Bench Layout</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-hover flex items-center justify-center text-ink-secondary hover:text-ink transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 px-6 py-3 border-b border-line bg-slate-50/70 text-[13px]">
          <div className="flex items-center gap-2">
            <span className="text-ink-secondary">Total Examination Rooms:</span>
            <span className="font-mono font-bold text-ink">{rooms.length} Halls</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-ink-secondary">Seating Capacity:</span>
            <span className="font-mono font-bold text-ink">{totalAllocated} / {totalSeats} seats</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-ink-secondary">Invigilator Status:</span>
            {missingInvigilators > 0 ? (
              <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-xs border border-amber-200">
                <FiAlertTriangle size={12} /> {missingInvigilators} room needs 2nd invigilator
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-semibold text-success bg-success/10 px-2 py-0.5 rounded text-xs">
                <FiCheckCircle size={12} /> All assigned
              </span>
            )}
          </div>
        </div>

        {/* Room List Table */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {rooms.map((room) => {
            const isFull = room.allocated >= room.capacity;
            const needsInvig = room.invigilators.length < 2;

            return (
              <div
                key={room.id}
                className="bg-white border border-line rounded-lg p-4 shadow-xs space-y-3 hover:border-primary/40 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ink text-[15px]">{room.roomNumber}</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-mono ${isFull ? "bg-slate-100 text-slate-700" : "bg-emerald-50 text-emerald-800 font-semibold"}`}>
                      {room.allocated} / {room.capacity} desks occupied
                    </span>
                  </div>
                  <div className="text-xs text-ink-secondary font-medium">
                    Layout: 2 rows × 10 double-benches (Zig-Zag)
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
                  <div>
                    <span className="text-xs text-ink-secondary block mb-0.5 font-medium">Allocated Cohorts</span>
                    <p className="font-semibold text-ink">{room.classes}</p>
                    <p className="text-xs font-mono text-ink-secondary mt-0.5">{room.rollRange}</p>
                  </div>

                  <div>
                    <span className="text-xs text-ink-secondary block mb-0.5 font-medium">Assigned Invigilators</span>
                    <div className="space-y-1">
                      {room.invigilators.map((inv, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-ink font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>{inv}</span>
                        </div>
                      ))}
                      {needsInvig && (
                        <div className="text-xs text-amber-700 font-semibold flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded border border-amber-200 w-fit">
                          <FiAlertTriangle size={12} />
                          <span>1 Invigilator required</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-line bg-surface">
          <span className="text-xs text-ink-secondary">Notice board printout includes seating arrangement chart by roll number.</span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-line-input rounded-control text-ink text-small font-medium hover:bg-surface-hover"
            >
              Close
            </button>
            <button
              onClick={() => window.print()}
              className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-control text-small font-semibold flex items-center gap-2 shadow-sm transition-colors"
            >
              <FiPrinter size={16} />
              Print Seating Plan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
