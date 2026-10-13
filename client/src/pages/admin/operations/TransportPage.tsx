import React, { useState } from "react";
import {
  FiTruck,
  FiMapPin,
  FiUser,
  FiPhone,
  FiShield,
  FiPlus,
  FiUsers,
  FiClock,
  FiNavigation,
  FiCheckCircle
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface RouteStop {
  stopName: string;
  time: string;
  students: number;
}

interface BusRoute {
  id: string;
  name: string;
  vehicleNo: string;
  routeName: string;
  occupied: number;
  capacity: number;
  driver: string;
  driverPhone: string;
  cleaner: string;
  gpsStatus: "Active" | "Offline";
  speedLimit: string;
  fitnessExpiry: string;
  insuranceExpiry: string;
  stops: RouteStop[];
}

const ROUTES: BusRoute[] = [
  {
    id: "bus-1",
    name: "Bus 1",
    vehicleNo: "RJ 14 PA 2190",
    routeName: "Vaishali Nagar – Ajmer Road",
    occupied: 38,
    capacity: 40,
    driver: "Rameshwar Yadav",
    driverPhone: "98290 81290",
    cleaner: "Sonu Lal",
    gpsStatus: "Active",
    speedLimit: "40 km/h Governed",
    fitnessExpiry: "18-11-2027",
    insuranceExpiry: "12-05-2027",
    stops: [
      { stopName: "Nursery Circle, Vaishali", time: "06:45 AM", students: 8 },
      { stopName: "Amrapali Plaza", time: "06:55 AM", students: 11 },
      { stopName: "Chitrakoot Stadium", time: "07:05 AM", students: 12 },
      { stopName: "Ajmer Road 200ft Bypass", time: "07:18 AM", students: 7 }
    ]
  },
  {
    id: "bus-2",
    name: "Bus 2",
    vehicleNo: "RJ 14 PA 3381",
    routeName: "Malviya Nagar – JLN Marg",
    occupied: 35,
    capacity: 40,
    driver: "Devendra Singh",
    driverPhone: "94140 22194",
    cleaner: "Kalu Ram",
    gpsStatus: "Active",
    speedLimit: "40 km/h Governed",
    fitnessExpiry: "04-02-2028",
    insuranceExpiry: "20-08-2027",
    stops: [
      { stopName: "Apex Circle, Malviya Nagar", time: "06:50 AM", students: 10 },
      { stopName: "World Trade Park (WTP)", time: "07:02 AM", students: 14 },
      { stopName: "Gandhi Nagar Station Turn", time: "07:15 AM", students: 11 }
    ]
  },
  {
    id: "bus-4",
    name: "Bus 4",
    vehicleNo: "RJ 14 PA 8820",
    routeName: "Gopalpura – Tonk Road",
    occupied: 41,
    capacity: 42,
    driver: "Mohan Lal",
    driverPhone: "99280 44102",
    cleaner: "Babulal",
    gpsStatus: "Active",
    speedLimit: "40 km/h Governed",
    fitnessExpiry: "10-12-2027",
    insuranceExpiry: "14-04-2027",
    stops: [
      { stopName: "Gopalpura Bypass Cross", time: "06:55 AM", students: 7 },
      { stopName: "Kisan Dharam Kanta", time: "07:08 AM", students: 12 },
      { stopName: "Triveni Nagar Flyover", time: "07:18 AM", students: 14 },
      { stopName: "Mahaveer Nagar Stop", time: "07:26 AM", students: 8 }
    ]
  },
  {
    id: "van-1",
    name: "Van 1",
    vehicleNo: "RJ 14 TA 1109",
    routeName: "Mansarovar Sector 5–9",
    occupied: 12,
    capacity: 14,
    driver: "Satish Kumar",
    driverPhone: "97720 19920",
    cleaner: "Staff Assist",
    gpsStatus: "Active",
    speedLimit: "40 km/h Governed",
    fitnessExpiry: "22-09-2028",
    insuranceExpiry: "30-10-2027",
    stops: [
      { stopName: "Sector 5 Shopping Centre", time: "07:10 AM", students: 5 },
      { stopName: "Varun Path", time: "07:20 AM", students: 7 }
    ]
  }
];

export default function TransportPage() {
  const { showToast } = useToast();
  const [selectedRoute, setSelectedRoute] = useState<BusRoute>(ROUTES[2]); // Bus 4 selected

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-navy">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-navy-muted tracking-wide uppercase">
            Operations › Fleet & Safety
          </div>
          <h1 className="text-2xl font-bold text-navy mt-1">Transport Routes & Vehicles</h1>
          <p className="text-xs text-navy-muted mt-0.5">
            Real-time route occupancy, live GPS tracking status, and mandatory RTO fitness compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast("Opening student transport re-assignment tool...", "info")}
            className="px-3.5 py-2 border border-line rounded-control bg-surface hover:bg-page text-xs font-semibold text-navy transition"
          >
            Assign Students
          </button>
          <button
            onClick={() => showToast("New route modal opened", "info")}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal hover:bg-teal-hover text-white rounded-control text-xs font-bold shadow-xs transition"
          >
            <FiPlus size={15} /> Add Route
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Vehicle Fleet Cards from Screen 31 */}
        <div className="lg:col-span-4 bg-surface border border-line rounded-panel p-3.5 shadow-sm space-y-2.5">
          <div className="px-2 py-1 text-xs font-bold text-navy uppercase tracking-wider">
            Vehicle Fleet ({ROUTES.length})
          </div>

          <div className="space-y-2">
            {ROUTES.map(route => {
              const isSelected = selectedRoute.id === route.id;
              const percent = Math.round((route.occupied / route.capacity) * 100);
              return (
                <button
                  key={route.id}
                  onClick={() => setSelectedRoute(route)}
                  className={`w-full text-left p-3.5 rounded-control border transition space-y-2 ${
                    isSelected
                      ? "bg-teal/10 border-teal shadow-xs"
                      : "bg-surface border-line hover:bg-page/60"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-navy">{route.name}</span>
                    <span className="font-mono text-navy-muted">
                      {route.occupied} / {route.capacity} seats
                    </span>
                  </div>
                  <div className="text-[11px] text-navy-muted truncate">{route.routeName}</div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        percent >= 95 ? "bg-amber-600" : "bg-teal"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Route Detail & Stop Timeline */}
        <div className="lg:col-span-8 space-y-5">
          {/* Vehicle Metadata Header Card */}
          <div className="bg-surface border border-line rounded-panel p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
              <div>
                <h2 className="text-base font-bold text-navy">
                  {selectedRoute.name} · {selectedRoute.routeName}
                </h2>
                <div className="text-xs font-mono text-navy-muted mt-0.5">
                  Vehicle Reg: {selectedRoute.vehicleNo} · {selectedRoute.speedLimit}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <FiNavigation size={12} /> GPS {selectedRoute.gpsStatus}
                </span>
              </div>
            </div>

            {/* Crew & Compliance Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-page rounded-control space-y-0.5">
                <div className="text-navy-muted text-[11px]">Assigned Driver</div>
                <div className="font-bold text-navy">{selectedRoute.driver}</div>
                <div className="font-mono text-[10px] text-teal">{selectedRoute.driverPhone}</div>
              </div>

              <div className="p-3 bg-page rounded-control space-y-0.5">
                <div className="text-navy-muted text-[11px]">Bus Attendant</div>
                <div className="font-bold text-navy">{selectedRoute.cleaner}</div>
                <div className="text-[10px] text-navy-muted">Verification valid</div>
              </div>

              <div className="p-3 bg-page rounded-control space-y-0.5">
                <div className="text-navy-muted text-[11px]">RTO Fitness Validity</div>
                <div className="font-mono font-bold text-navy">{selectedRoute.fitnessExpiry}</div>
                <div className="text-[10px] text-emerald-700">Compliant</div>
              </div>

              <div className="p-3 bg-page rounded-control space-y-0.5">
                <div className="text-navy-muted text-[11px]">Comprehensive Insurance</div>
                <div className="font-mono font-bold text-navy">{selectedRoute.insuranceExpiry}</div>
                <div className="text-[10px] text-emerald-700">Valid</div>
              </div>
            </div>
          </div>

          {/* Stop Timeline matching Screen 31 */}
          <div className="bg-surface border border-line rounded-panel p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-xs uppercase text-navy tracking-wider">
              Morning Pickup Route & Timetable
            </h3>

            <div className="space-y-0 text-xs">
              {selectedRoute.stops.map((stop, idx) => (
                <div key={stop.stopName} className="flex gap-4">
                  {/* Timeline connector */}
                  <div className="flex flex-col items-center">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-teal bg-white mt-1 shrink-0" />
                    {idx < selectedRoute.stops.length - 1 && (
                      <div className="w-0.5 bg-teal/30 flex-1 min-h-[36px]" />
                    )}
                  </div>

                  {/* Stop detail */}
                  <div className="flex-1 pb-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-navy text-sm">{stop.stopName}</div>
                      <div className="text-navy-muted text-[11px]">
                        {stop.students} students boarding
                      </div>
                    </div>
                    <div className="font-mono font-semibold text-xs text-navy bg-page px-2 py-1 rounded border border-line">
                      {stop.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
