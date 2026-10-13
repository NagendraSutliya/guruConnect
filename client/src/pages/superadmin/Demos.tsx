import { useState } from "react";
import { Calendar, Search, CheckCircle2, Clock, Phone, MapPin, ExternalLink, UserCheck, X, Sparkles, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DemoRequest {
  id: string;
  schoolName: string;
  city: string;
  state: string;
  contactPerson: string;
  mobile: string;
  email: string;
  students: string;
  requestedDate: string;
  timeSlot: string;
  status: "Pending" | "Scheduled" | "Completed" | "Converted";
  assignedTo?: string;
  meetLink?: string;
}

const initialDemos: DemoRequest[] = [
  {
    id: "DEMO-101",
    schoolName: "St. Xavier's Senior Secondary",
    city: "Jaipur",
    state: "Rajasthan",
    contactPerson: "Fr. Augustine Joseph",
    mobile: "+91 98290 44102",
    email: "principal@stxaviersjaipur.org",
    students: "1,200–2,000",
    requestedDate: "16 Oct 2026",
    timeSlot: "11:00 AM – 12:00 PM",
    status: "Pending"
  },
  {
    id: "DEMO-102",
    schoolName: "Marwar International Academy",
    city: "Jodhpur",
    state: "Rajasthan",
    contactPerson: "Dr. Mahendra Rathore",
    mobile: "+91 94141 88912",
    email: "trustee@marwarschool.com",
    students: "800–1,200",
    requestedDate: "16 Oct 2026",
    timeSlot: "03:00 PM – 04:00 PM",
    status: "Scheduled",
    assignedTo: "Aman Shekhawat",
    meetLink: "https://meet.google.com/abc-guru-con"
  },
  {
    id: "DEMO-103",
    schoolName: "Daffodils Public School",
    city: "Kota",
    state: "Rajasthan",
    contactPerson: "Sunita Khandelwal",
    mobile: "+91 97850 11920",
    email: "sunita@daffodilskota.in",
    students: "500–800",
    requestedDate: "17 Oct 2026",
    timeSlot: "02:30 PM – 03:30 PM",
    status: "Pending"
  },
  {
    id: "DEMO-104",
    schoolName: "Bright Future Career Coaching",
    city: "Sikar",
    state: "Rajasthan",
    contactPerson: "Er. Rameshwar Dhakar",
    mobile: "+91 94133 77218",
    email: "director@brightfuturesikar.com",
    students: "1,500+",
    requestedDate: "14 Oct 2026",
    timeSlot: "10:00 AM – 11:00 AM",
    status: "Completed",
    assignedTo: "Aman Shekhawat"
  },
  {
    id: "DEMO-105",
    schoolName: "Sanskar Gurukul Academy",
    city: "Alwar",
    state: "Rajasthan",
    contactPerson: "Pt. Radheshyam Sharma",
    mobile: "+91 98280 33419",
    email: "admin@sanskargurukul.org",
    students: "400–600",
    requestedDate: "12 Oct 2026",
    timeSlot: "12:00 PM – 01:00 PM",
    status: "Converted",
    assignedTo: "Aman Shekhawat"
  }
];

export default function SuperAdminDemos() {
  const [demos, setDemos] = useState<DemoRequest[]>(initialDemos);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [selectedDemoForSchedule, setSelectedDemoForSchedule] = useState<DemoRequest | null>(null);
  const nav = useNavigate();

  const [scheduleData, setScheduleData] = useState({
    assignedTo: "Aman Shekhawat",
    date: "16 Oct 2026",
    time: "11:00 AM",
    meetLink: "https://meet.google.com/guru-demo-session"
  });

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDemoForSchedule) return;

    setDemos(demos.map(d => 
      d.id === selectedDemoForSchedule.id 
        ? { ...d, status: "Scheduled", assignedTo: scheduleData.assignedTo, meetLink: scheduleData.meetLink }
        : d
    ));
    setSelectedDemoForSchedule(null);
    alert(`Demo confirmed for ${selectedDemoForSchedule.schoolName}. Calendar invite dispatched to school owner.`);
  };

  const handleConvertToTrial = (demo: DemoRequest) => {
    // Navigate to schools with pre-filled intention
    nav("/superadmin/schools");
  };

  const tabs = [
    { label: "All", count: demos.length },
    { label: "Pending", count: demos.filter(d => d.status === "Pending").length },
    { label: "Scheduled", count: demos.filter(d => d.status === "Scheduled").length },
    { label: "Completed", count: demos.filter(d => d.status === "Completed").length },
    { label: "Converted", count: demos.filter(d => d.status === "Converted").length }
  ];

  const filteredDemos = demos.filter(d => {
    const matchesTab = activeTab === "All" || d.status === activeTab;
    const matchesSearch = 
      d.schoolName.toLowerCase().includes(search.toLowerCase()) ||
      d.city.toLowerCase().includes(search.toLowerCase()) ||
      d.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      d.mobile.includes(search);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink m-0">
            Demo Requests & Inbound Leads <span className="text-ink-secondary text-lg font-normal">· {demos.length} leads</span>
          </h1>
          <p className="text-sm text-ink-secondary mt-1 mb-0">
            Inbound demo inquiries from landing page and institution referral signups. Convert directly into 30-day sandbox trials.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-line">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === tab.label
                ? "bg-nav-bg text-white shadow-2xs"
                : "text-ink-secondary hover:text-ink hover:bg-surface"
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] ${
              activeTab === tab.label ? "bg-white/20 text-white" : "bg-line/60 text-ink-secondary"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-line shadow-2xs">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-ink-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search demo by school, city, or contact..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-surface rounded-xl border border-line focus:outline-hidden"
          />
        </div>
        <div className="text-xs text-ink-secondary font-medium">
          Showing <span className="font-bold text-ink">{filteredDemos.length}</span> demo inquiries
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-line shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[850px]">
            <thead>
              <tr className="bg-surface border-b border-line text-ink-secondary text-[11px] uppercase tracking-wider font-bold">
                <th className="py-3 px-4">School & City</th>
                <th className="py-3 px-4">Decision Maker</th>
                <th className="py-3 px-4">Student Scale</th>
                <th className="py-3 px-4">Requested Slot</th>
                <th className="py-3 px-4">Lead Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {filteredDemos.map((demo) => (
                <tr key={demo.id} className="hover:bg-primary-tint/10 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-ink">{demo.schoolName}</div>
                    <div className="text-[11px] text-ink-secondary flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-ink-muted" />
                      <span>{demo.city}, {demo.state}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-ink">{demo.contactPerson}</div>
                    <div className="text-[11px] text-ink-secondary font-mono">{demo.mobile}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-ink">
                    {demo.students} students
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-ink flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>{demo.requestedDate}</span>
                    </div>
                    <div className="text-[11px] text-ink-secondary font-mono">{demo.timeSlot}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      demo.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      demo.status === "Scheduled" ? "bg-sky-50 text-sky-700 border-sky-200" :
                      demo.status === "Completed" ? "bg-purple-50 text-purple-700 border-purple-200" :
                      "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}>
                      {demo.status}
                    </span>
                    {demo.assignedTo && (
                      <div className="text-[10.5px] text-ink-muted mt-1">Assigned: {demo.assignedTo}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {demo.status === "Pending" && (
                        <button
                          onClick={() => setSelectedDemoForSchedule(demo)}
                          className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow-xs hover:bg-primary-dark cursor-pointer"
                        >
                          Schedule
                        </button>
                      )}
                      {demo.status === "Scheduled" && demo.meetLink && (
                        <a
                          href={demo.meetLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-surface text-primary border border-line text-xs font-bold rounded-lg hover:bg-line/40 inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Join</span>
                        </a>
                      )}
                      {demo.status !== "Converted" && (
                        <button
                          onClick={() => handleConvertToTrial(demo)}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Create School
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SCHEDULE MODAL */}
      {selectedDemoForSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-line p-6 relative">
            <button onClick={() => setSelectedDemoForSchedule(null)} className="absolute top-4 right-4 text-ink-muted hover:text-ink cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-ink mb-1">Confirm Live Walkthrough</h3>
            <p className="text-xs text-ink-secondary mb-4">
              {selectedDemoForSchedule.schoolName} ({selectedDemoForSchedule.contactPerson})
            </p>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">Assigned Solution Engineer</label>
                <select
                  value={scheduleData.assignedTo}
                  onChange={(e) => setScheduleData({...scheduleData, assignedTo: e.target.value})}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-ink"
                >
                  <option value="Aman Shekhawat">Aman Shekhawat (Onboarding / Sales Lead)</option>
                  <option value="Priya Kumari">Priya Kumari (Senior Product Specialist)</option>
                  <option value="Platform Super Admin">Platform Super Admin</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Slot Date</label>
                  <input
                    type="text"
                    value={scheduleData.date}
                    onChange={(e) => setScheduleData({...scheduleData, date: e.target.value})}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-ink font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Time</label>
                  <input
                    type="text"
                    value={scheduleData.time}
                    onChange={(e) => setScheduleData({...scheduleData, time: e.target.value})}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-ink font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">Meeting Link (Google Meet / Zoom)</label>
                <input
                  type="url"
                  value={scheduleData.meetLink}
                  onChange={(e) => setScheduleData({...scheduleData, meetLink: e.target.value})}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-line text-ink font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setSelectedDemoForSchedule(null)} className="px-4 py-2 border border-line text-ink-secondary rounded-xl font-bold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-md cursor-pointer">
                  Confirm & Send Calendar Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
