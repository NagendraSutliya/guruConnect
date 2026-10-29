import React, { useState } from "react";
import {
  FiPlus,
  FiUserCheck,
  FiPhone,
  FiMapPin,
  FiNavigation,
  FiAlertTriangle,
  FiCheckCircle,
  FiX,
  FiSearch,
  FiDownload
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface RouteStop {
  stopName: string;
  time: string;
  students: number;
}

interface VehicleRoute {
  id: string;
  name: string;
  type: "Bus" | "Van";
  regNo: string;
  routeName: string;
  occupied: number;
  capacity: number;
  driver: string;
  driverPhone: string;
  driverLicence: string;
  attendant: string;
  attendantVerification: string;
  speedGovernor: string;
  firstAidChecked: string;
  fitnessExpiry: string;
  insuranceStatus: { status: "valid" | "warning"; text: string };
  permitExpiry: string;
  pucExpiry: string;
  currentSpeed: number;
  ignition: "ON" | "OFF";
  gpsCoords: string;
  nextStop: string;
  stops: RouteStop[];
}

const INITIAL_ROUTES: VehicleRoute[] = [
  {
    id: "bus-1",
    name: "Bus 1",
    type: "Bus",
    regNo: "RJ 14 PA 2190",
    routeName: "Vaishali Nagar – Ajmer Road",
    occupied: 38,
    capacity: 40,
    driver: "Rameshwar Yadav",
    driverPhone: "98290 81290",
    driverLicence: "Valid to Oct 2028",
    attendant: "Sonu Lal",
    attendantVerification: "Police verification on file",
    speedGovernor: "Checked 15 Sep",
    firstAidChecked: "Checked 01 Oct",
    fitnessExpiry: "Valid to 12 Jan 2027",
    insuranceStatus: { status: "valid", text: "Valid to 30 Jun 2027" },
    permitExpiry: "Valid to 31 Aug 2027",
    pucExpiry: "Valid to 15 Jan 2027",
    currentSpeed: 36,
    ignition: "ON",
    gpsCoords: "26.8912° N, 75.7410° E",
    nextStop: "Amrapali Plaza (in 4 mins)",
    stops: [
      { stopName: "Nursery Circle, Vaishali", time: "06:45", students: 8 },
      { stopName: "Amrapali Plaza", time: "06:55", students: 11 },
      { stopName: "Chitrakoot Stadium", time: "07:05", students: 12 },
      { stopName: "Ajmer Road 200ft Bypass", time: "07:18", students: 7 },
      { stopName: "School Gate", time: "07:45", students: 0 }
    ]
  },
  {
    id: "bus-2",
    name: "Bus 2",
    type: "Bus",
    regNo: "RJ 14 PA 3381",
    routeName: "Malviya Nagar – JLN Marg",
    occupied: 35,
    capacity: 40,
    driver: "Devendra Singh",
    driverPhone: "94140 22194",
    driverLicence: "Valid to Dec 2027",
    attendant: "Kalu Ram",
    attendantVerification: "Police verification on file",
    speedGovernor: "Checked 05 Sep",
    firstAidChecked: "Checked 01 Oct",
    fitnessExpiry: "Valid to 22 Mar 2027",
    insuranceStatus: { status: "valid", text: "Valid to 15 Sep 2027" },
    permitExpiry: "Valid to 20 Jul 2027",
    pucExpiry: "Valid to 10 Feb 2027",
    currentSpeed: 32,
    ignition: "ON",
    gpsCoords: "26.8520° N, 75.8050° E",
    nextStop: "World Trade Park (in 6 mins)",
    stops: [
      { stopName: "Apex Circle, Malviya Nagar", time: "06:50", students: 10 },
      { stopName: "World Trade Park (WTP)", time: "07:02", students: 14 },
      { stopName: "Gandhi Nagar Station Turn", time: "07:15", students: 11 },
      { stopName: "School Gate", time: "07:45", students: 0 }
    ]
  },
  {
    id: "bus-3",
    name: "Bus 3",
    type: "Bus",
    regNo: "RJ 14 PA 4519",
    routeName: "Jagatpura – Sitapura",
    occupied: 29,
    capacity: 40,
    driver: "Ramphal Meena",
    driverPhone: "98290 33819",
    driverLicence: "Valid to Jan 2028",
    attendant: "Om Prakash",
    attendantVerification: "Police verification on file",
    speedGovernor: "Checked 28 Aug",
    firstAidChecked: "Checked 01 Oct",
    fitnessExpiry: "Valid to 18 Apr 2027",
    insuranceStatus: { status: "valid", text: "Valid to 12 Aug 2027" },
    permitExpiry: "Valid to 15 May 2027",
    pucExpiry: "Valid to 05 Dec 2026",
    currentSpeed: 28,
    ignition: "ON",
    gpsCoords: "26.8120° N, 75.8230° E",
    nextStop: "Mahal Road (in 2 mins)",
    stops: [
      { stopName: "Jagatpura Flyover", time: "06:52", students: 9 },
      { stopName: "Mahal Road Circle", time: "07:04", students: 8 },
      { stopName: "Sitapura Industrial Cross", time: "07:16", students: 12 },
      { stopName: "School Gate", time: "07:45", students: 0 }
    ]
  },
  {
    id: "bus-4",
    name: "Bus 4",
    type: "Bus",
    regNo: "RJ 14 PA 8820",
    routeName: "Gopalpura – Tonk Road",
    occupied: 41,
    capacity: 42,
    driver: "Mohan Lal",
    driverPhone: "99280 44102",
    driverLicence: "Valid to Mar 2029",
    attendant: "Geeta Bai",
    attendantVerification: "Police verification on file",
    speedGovernor: "Checked 02 Sep",
    firstAidChecked: "Checked 01 Oct",
    fitnessExpiry: "Valid to 14 Feb 2027",
    insuranceStatus: { status: "warning", text: "Expires in 18 days" },
    permitExpiry: "Valid to 30 Jun 2027",
    pucExpiry: "Valid to 20 Dec 2026",
    currentSpeed: 38,
    ignition: "ON",
    gpsCoords: "26.8624° N, 75.7891° E",
    nextStop: "Durgapura Flyover (in 3 mins)",
    stops: [
      { stopName: "Gopalpura bypass", time: "06:55", students: 7 },
      { stopName: "Triveni Nagar", time: "07:03", students: 9 },
      { stopName: "Durgapura", time: "07:12", students: 8 },
      { stopName: "Tonk Phatak", time: "07:20", students: 11 },
      { stopName: "Sanganer stop", time: "07:28", students: 6 },
      { stopName: "School gate", time: "07:45", students: 0 }
    ]
  },
  {
    id: "van-1",
    name: "Van 1",
    type: "Van",
    regNo: "RJ 14 TA 1109",
    routeName: "Mansarovar sector 5–9",
    occupied: 12,
    capacity: 14,
    driver: "Satish Kumar",
    driverPhone: "97720 19920",
    driverLicence: "Valid to Jul 2028",
    attendant: "Sunita (Staff Attendant)",
    attendantVerification: "Police verification on file",
    speedGovernor: "Checked 12 Sep",
    firstAidChecked: "Checked 01 Oct",
    fitnessExpiry: "Valid to 05 May 2027",
    insuranceStatus: { status: "valid", text: "Valid to 18 Nov 2027" },
    permitExpiry: "Valid to 10 Sep 2027",
    pucExpiry: "Valid to 25 Jan 2027",
    currentSpeed: 25,
    ignition: "ON",
    gpsCoords: "26.8480° N, 75.7610° E",
    nextStop: "Varun Path (in 5 mins)",
    stops: [
      { stopName: "Sector 5 Shopping Centre", time: "07:10", students: 5 },
      { stopName: "Varun Path Circle", time: "07:20", students: 7 },
      { stopName: "School Gate", time: "07:45", students: 0 }
    ]
  },
  {
    id: "van-2",
    name: "Van 2",
    type: "Van",
    regNo: "RJ 14 TA 2291",
    routeName: "Pratap Nagar",
    occupied: 9,
    capacity: 14,
    driver: "Gopal Sharma",
    driverPhone: "98870 12891",
    driverLicence: "Valid to Sep 2028",
    attendant: "Manoj (Staff)",
    attendantVerification: "Police verification on file",
    speedGovernor: "Checked 18 Sep",
    firstAidChecked: "Checked 01 Oct",
    fitnessExpiry: "Valid to 14 Jun 2027",
    insuranceStatus: { status: "valid", text: "Valid to 04 Dec 2027" },
    permitExpiry: "Valid to 22 Oct 2027",
    pucExpiry: "Valid to 18 Feb 2027",
    currentSpeed: 30,
    ignition: "ON",
    gpsCoords: "26.8040° N, 75.8110° E",
    nextStop: "Sector 11 Gate (in 2 mins)",
    stops: [
      { stopName: "Kumbha Marg Turn", time: "07:12", students: 4 },
      { stopName: "Sector 11 Gate", time: "07:22", students: 5 },
      { stopName: "School Gate", time: "07:45", students: 0 }
    ]
  }
];

export default function TransportPage() {
  const { showToast } = useToast();
  const [routes, setRoutes] = useState<VehicleRoute[]>(INITIAL_ROUTES);
  const [selectedRouteId, setSelectedRouteId] = useState("bus-4");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAddRouteModalOpen, setIsAddRouteModalOpen] = useState(false);

  // Assign Student State
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStop, setSelectedStop] = useState("");

  // New Route Form State
  const [newRouteForm, setNewRouteForm] = useState({
    name: "",
    type: "Bus" as "Bus" | "Van",
    regNo: "",
    routeName: "",
    capacity: 40,
    driver: "",
    driverPhone: "",
    attendant: "",
    stops: "Stop 1 (07:00), Stop 2 (07:15), School (07:45)"
  });

  const selectedRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  const handleAssignStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentSearch.trim() || !selectedStop) return;

    setRoutes(prev =>
      prev.map(r => {
        if (r.id === selectedRoute.id) {
          return {
            ...r,
            occupied: Math.min(r.capacity, r.occupied + 1),
            stops: r.stops.map(s =>
              s.stopName === selectedStop
                ? { ...s, students: s.students + 1 }
                : s
            )
          };
        }
        return r;
      })
    );

    setIsAssignModalOpen(false);
    showToast(`Student ${studentSearch} assigned to ${selectedRoute.name} at stop '${selectedStop}'!`, "success");
    setStudentSearch("");
    setSelectedStop("");
  };

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRouteForm.name.trim() || !newRouteForm.routeName.trim()) return;

    const stopList: RouteStop[] = newRouteForm.stops.split(",").map((s, idx) => ({
      stopName: s.trim().replace(/\(.*?\)/g, "").trim(),
      time: `07:${15 + idx * 10}`,
      students: 4 + idx
    }));

    const created: VehicleRoute = {
      id: `route-${Date.now()}`,
      name: newRouteForm.name,
      type: newRouteForm.type,
      regNo: newRouteForm.regNo || "RJ 14 PA 9999",
      routeName: newRouteForm.routeName,
      occupied: 0,
      capacity: Number(newRouteForm.capacity) || 40,
      driver: newRouteForm.driver || "Assigned Driver",
      driverPhone: newRouteForm.driverPhone || "98290 00000",
      driverLicence: "Valid to 2028",
      attendant: newRouteForm.attendant || "Assigned Attendant",
      attendantVerification: "Police verification on file",
      speedGovernor: "Checked this month",
      firstAidChecked: "Checked this month",
      fitnessExpiry: "Valid to Dec 2027",
      insuranceStatus: { status: "valid", text: "Valid to Sep 2027" },
      permitExpiry: "Valid to Oct 2027",
      pucExpiry: "Valid to Mar 2027",
      currentSpeed: 0,
      ignition: "OFF",
      gpsCoords: "26.8500° N, 75.8000° E",
      nextStop: "Route Initialized",
      stops: stopList.length > 0 ? stopList : [
        { stopName: "First Pickup", time: "07:00", students: 5 },
        { stopName: "School Gate", time: "07:45", students: 0 }
      ]
    };

    setRoutes(prev => [...prev, created]);
    setSelectedRouteId(created.id);
    setIsAddRouteModalOpen(false);
    showToast(`Route ${created.name} (${created.routeName}) successfully added!`, "success");
  };

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12 font-sans">
      {/* Header Row (Matching 31-Transport.html) */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-ink-secondary">
            Transport › Routes
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            Routes and vehicles
          </h1>
        </div>

        <div className="flex gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsAssignModalOpen(true)}
            className="min-h-[42px] px-4 rounded-control border border-line-input bg-white hover:bg-slate-50 text-ink text-[13px] font-semibold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <span>Assign students</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddRouteModalOpen(true)}
            className="min-h-[42px] px-4 rounded-control bg-primary hover:bg-primary-dark text-white text-[13px] font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 active:scale-[0.98]"
          >
            <FiPlus size={15} />
            <span>Add route</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout (Matching 31-Transport.html) */}
      <div className="flex flex-wrap gap-5 items-start">
        {/* Left Column: Vehicle List (Screen 31) */}
        <section className="flex-1 basis-[280px] max-w-full lg:max-w-[340px] bg-white border border-line rounded-card p-2 flex flex-col gap-1 shadow-xs">
          {routes.map(r => {
            const isSelected = r.id === selectedRoute.id;
            const percentage = Math.min(100, Math.round((r.occupied / r.capacity) * 100));
            const isWarning = percentage >= 95;

            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRouteId(r.id)}
                className={`text-left border-0 rounded-control p-3 transition-colors cursor-pointer flex flex-col gap-2 ${
                  isSelected ? "bg-primary-tint" : "bg-transparent hover:bg-slate-50"
                }`}
              >
                <div className="flex justify-between items-center w-full gap-2">
                  <span className="font-semibold text-sm text-ink">{r.name}</span>
                  <span className="font-mono text-xs text-ink-secondary">
                    {r.occupied} / {r.capacity}
                  </span>
                </div>
                <div className="text-xs text-ink-secondary truncate">
                  {r.routeName}
                </div>
                <div className="h-1.5 w-full bg-line-track rounded-full overflow-hidden block">
                  <div
                    className={`block h-full transition-all duration-300 ${
                      isWarning ? "bg-warning-accent" : "bg-primary"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </button>
            );
          })}
        </section>

        {/* Right Column: Route Details, Stops, Live GPS, and Compliance */}
        <div className="flex-1 basis-[480px] min-w-0 flex flex-col gap-4">
          {/* Stops Timeline and Live GPS Card */}
          <section className="bg-white border border-line rounded-card p-5 flex flex-wrap gap-6 shadow-xs">
            {/* Morning Pickup Stops Timeline */}
            <div className="flex-1 basis-[260px] flex flex-col gap-1">
              <h2 className="m-0 mb-3 text-base font-semibold text-ink">
                {selectedRoute.name} · {selectedRoute.routeName} · morning
              </h2>

              <div className="space-y-0 text-xs">
                {selectedRoute.stops.map((stop, idx) => {
                  const isLast = idx === selectedRoute.stops.length - 1;
                  return (
                    <div key={stop.stopName} className="flex gap-3.5">
                      <div className="flex flex-col items-center w-3.5 shrink-0">
                        <span
                          className={`w-3 h-3 rounded-full border-2 border-primary box-border mt-0.5 shrink-0 ${
                            isLast ? "bg-primary" : "bg-white"
                          }`}
                        />
                        {!isLast && (
                          <span className="flex-1 w-[2px] bg-primary-soft min-h-[30px]" />
                        )}
                      </div>
                      <div className="flex justify-between gap-3 flex-1 pb-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-ink">
                            {stop.stopName}
                          </span>
                          <span className="text-xs text-ink-secondary">
                            {isLast ? "Arrival" : `${stop.students} students`}
                          </span>
                        </div>
                        <span className="font-mono text-xs text-ink-secondary">
                          {stop.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live GPS Map Simulation Canvas (Screen 31) */}
            <div className="flex-1 basis-[260px] min-h-[260px] rounded-control bg-surface-placeholder border border-dashed border-ink-muted flex flex-col items-center justify-center text-center p-4 text-xs text-ink-secondary relative overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2 animate-pulse">
                <FiNavigation size={22} />
              </div>
              <div className="font-semibold text-ink text-sm">
                Live GPS Active · {selectedRoute.currentSpeed} km/h
              </div>
              <div className="font-mono text-[11px] text-ink-secondary mt-1">
                {selectedRoute.gpsCoords}
              </div>
              <div className="text-[11px] text-primary font-medium mt-1">
                Next: {selectedRoute.nextStop}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => showToast(`Pinging onboard GPS device for ${selectedRoute.name}... Signal 100%`, "info")}
                  className="px-2.5 py-1 bg-white border border-line-input rounded text-[11px] font-medium text-ink hover:bg-slate-50"
                >
                  Ping Device
                </button>
                <a
                  href={`tel:${selectedRoute.driverPhone}`}
                  className="px-2.5 py-1 bg-primary text-white rounded text-[11px] font-medium hover:bg-primary-dark flex items-center gap-1"
                >
                  <FiPhone size={10} /> Call Driver
                </a>
              </div>
            </div>
          </section>

          {/* Vehicle and Staff Compliance Section (Matching 31-Transport.html) */}
          <section className="bg-white border border-line rounded-card p-5 flex flex-col gap-3 shadow-xs">
            <h2 className="m-0 text-base font-semibold text-ink">
              Vehicle and staff compliance
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Fitness Certificate */}
              <div className="border border-line bg-white rounded-control p-3 flex flex-col gap-1">
                <span className="text-xs text-ink-secondary">Fitness certificate</span>
                <span className="text-xs font-semibold text-ink">
                  {selectedRoute.fitnessExpiry}
                </span>
              </div>

              {/* Insurance */}
              <div
                className={`rounded-control p-3 flex flex-col gap-1 border ${
                  selectedRoute.insuranceStatus.status === "warning"
                    ? "border-warning-border bg-warning-bg"
                    : "border-line bg-white"
                }`}
              >
                <span className="text-xs text-ink-secondary">Insurance</span>
                <span
                  className={`text-xs font-semibold ${
                    selectedRoute.insuranceStatus.status === "warning"
                      ? "text-warning-text"
                      : "text-ink"
                  }`}
                >
                  {selectedRoute.insuranceStatus.text}
                </span>
              </div>

              {/* Permit */}
              <div className="border border-line bg-white rounded-control p-3 flex flex-col gap-1">
                <span className="text-xs text-ink-secondary">Permit</span>
                <span className="text-xs font-semibold text-ink">
                  {selectedRoute.permitExpiry}
                </span>
              </div>

              {/* PUC */}
              <div className="border border-line bg-white rounded-control p-3 flex flex-col gap-1">
                <span className="text-xs text-ink-secondary">PUC</span>
                <span className="text-xs font-semibold text-ink">
                  {selectedRoute.pucExpiry}
                </span>
              </div>

              {/* Speed Governor */}
              <div className="border border-line bg-white rounded-control p-3 flex flex-col gap-1">
                <span className="text-xs text-ink-secondary">Speed governor</span>
                <span className="text-xs font-semibold text-ink">
                  {selectedRoute.speedGovernor}
                </span>
              </div>

              {/* First-Aid Kit */}
              <div className="border border-line bg-white rounded-control p-3 flex flex-col gap-1">
                <span className="text-xs text-ink-secondary">First-aid kit</span>
                <span className="text-xs font-semibold text-ink">
                  {selectedRoute.firstAidChecked}
                </span>
              </div>
            </div>

            <div className="text-xs text-ink-secondary pt-1 border-t border-line/60">
              Driver {selectedRoute.driver} · licence {selectedRoute.driverLicence} · Attendant {selectedRoute.attendant} · {selectedRoute.attendantVerification}
            </div>
          </section>
        </div>
      </div>

      {/* Assign Student Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-line rounded-card w-full max-w-md shadow-xl p-6 space-y-4 font-sans animate-in fade-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center pb-2.5 border-b border-line">
              <h3 className="font-semibold text-base text-ink">Assign Student to Route</h3>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="text-ink-secondary hover:text-ink text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignStudent} className="space-y-3.5">
              <div>
                <label className="block text-ink font-medium mb-1">Select Route</label>
                <div className="p-2.5 bg-slate-50 border border-line rounded-control text-ink font-semibold">
                  {selectedRoute.name} · {selectedRoute.routeName} ({selectedRoute.occupied}/{selectedRoute.capacity} filled)
                </div>
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Student Name or Admission No.</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma (2026/0142) or Class 8-A"
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Boarding / Drop Stop</label>
                <select
                  required
                  value={selectedStop}
                  onChange={e => setSelectedStop(e.target.value)}
                  className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                >
                  <option value="">-- Choose Stop --</option>
                  {selectedRoute.stops.map(s => (
                    <option key={s.stopName} value={s.stopName}>
                      {s.stopName} ({s.time})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 border border-line-input rounded-control text-ink hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-control font-semibold shadow-xs"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Route Modal */}
      {isAddRouteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-line rounded-card w-full max-w-lg shadow-xl p-6 space-y-4 font-sans animate-in fade-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center pb-2.5 border-b border-line">
              <h3 className="font-semibold text-base text-ink">Add Transport Route & Vehicle</h3>
              <button
                type="button"
                onClick={() => setIsAddRouteModalOpen(false)}
                className="text-ink-secondary hover:text-ink text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRoute} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink font-medium mb-1">Route Identifier</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bus 5 or Van 3"
                    value={newRouteForm.name}
                    onChange={e => setNewRouteForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-ink font-medium mb-1">Vehicle Type</label>
                  <select
                    value={newRouteForm.type}
                    onChange={e => setNewRouteForm(prev => ({ ...prev, type: e.target.value as "Bus" | "Van" }))}
                    className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  >
                    <option value="Bus">School Bus (40–50 seats)</option>
                    <option value="Van">School Van (10–14 seats)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink font-medium mb-1">Vehicle Registration No.</label>
                  <input
                    type="text"
                    required
                    placeholder="RJ 14 PA 9812"
                    value={newRouteForm.regNo}
                    onChange={e => setNewRouteForm(prev => ({ ...prev, regNo: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-line rounded-control text-ink font-mono text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-ink font-medium mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    required
                    value={newRouteForm.capacity}
                    onChange={e => setNewRouteForm(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                    className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Route Corridor Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mansarovar – Sanganer Link"
                  value={newRouteForm.routeName}
                  onChange={e => setNewRouteForm(prev => ({ ...prev, routeName: e.target.value }))}
                  className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink font-medium mb-1">Assigned Driver</label>
                  <input
                    type="text"
                    required
                    placeholder="Driver Full Name"
                    value={newRouteForm.driver}
                    onChange={e => setNewRouteForm(prev => ({ ...prev, driver: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-ink font-medium mb-1">Driver Mobile No.</label>
                  <input
                    type="tel"
                    required
                    placeholder="98290 xxxxx"
                    value={newRouteForm.driverPhone}
                    onChange={e => setNewRouteForm(prev => ({ ...prev, driverPhone: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Stops List (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Stop 1, Stop 2, Stop 3, School Gate"
                  value={newRouteForm.stops}
                  onChange={e => setNewRouteForm(prev => ({ ...prev, stops: e.target.value }))}
                  className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddRouteModalOpen(false)}
                  className="px-4 py-2 border border-line-input rounded-control text-ink hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-control font-semibold shadow-xs"
                >
                  Create Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
