import React, { useState } from "react";
import {
  FiPlus,
  FiCheckCircle,
  FiClock,
  FiX,
  FiUser,
  FiPhone,
  FiCalendar,
  FiDownload,
  FiAlertTriangle
} from "react-icons/fi";
import { useToast } from "../../../context/ToastContext";

interface BedSlot {
  bedNumber: number;
  status: "Occupied" | "Vacant" | "Out on pass";
  studentName?: string;
  admissionNo?: string;
  classSection?: string;
  guardianPhone?: string;
}

interface HostelRoom {
  roomNo: string;
  capacity: number;
  beds: BedSlot[];
}

interface OutpassItem {
  id: string;
  studentName: string;
  classSection: string;
  roomNo: string;
  duration: string;
  accompaniedBy: string;
  status: "Parent approved in app" | "Out now" | "Waiting for parent approval";
  actionText?: string;
}

const INITIAL_ROOMS: HostelRoom[] = [
  {
    roomNo: "Room 101",
    capacity: 4,
    beds: [
      { bedNumber: 1, status: "Occupied", studentName: "Aman Sharma", admissionNo: "2024/0112", classSection: "9-A", guardianPhone: "98290 12091" },
      { bedNumber: 2, status: "Occupied", studentName: "Rahul Choudhary", admissionNo: "2024/0145", classSection: "9-A", guardianPhone: "94140 33812" },
      { bedNumber: 3, status: "Occupied", studentName: "Devendra Verma", admissionNo: "2024/0198", classSection: "9-B", guardianPhone: "97840 22109" },
      { bedNumber: 4, status: "Occupied", studentName: "Sandeep Singh", admissionNo: "2024/0205", classSection: "9-B", guardianPhone: "96490 88219" }
    ]
  },
  {
    roomNo: "Room 102",
    capacity: 4,
    beds: [
      { bedNumber: 1, status: "Occupied", studentName: "Vikram Rathore", admissionNo: "2023/0088", classSection: "10-A", guardianPhone: "98290 44910" },
      { bedNumber: 2, status: "Occupied", studentName: "Mayank Jain", admissionNo: "2023/0094", classSection: "10-A", guardianPhone: "94140 11928" },
      { bedNumber: 3, status: "Occupied", studentName: "Nitin Meena", admissionNo: "2023/0115", classSection: "10-B", guardianPhone: "99280 44810" },
      { bedNumber: 4, status: "Vacant" }
    ]
  },
  {
    roomNo: "Room 103",
    capacity: 4,
    beds: [
      { bedNumber: 1, status: "Occupied", studentName: "Harshit Vyas", admissionNo: "2024/0302", classSection: "9-B", guardianPhone: "97720 19912" },
      { bedNumber: 2, status: "Occupied", studentName: "Pawan Gurjar", admissionNo: "2024/0315", classSection: "9-B", guardianPhone: "98870 33190" },
      { bedNumber: 3, status: "Out on pass", studentName: "Yash Rathore", admissionNo: "2024/0177", classSection: "9-B", guardianPhone: "98290 81820" },
      { bedNumber: 4, status: "Occupied", studentName: "Tarun Soni", admissionNo: "2024/0289", classSection: "9-A", guardianPhone: "96490 12044" }
    ]
  },
  {
    roomNo: "Room 104",
    capacity: 4,
    beds: [
      { bedNumber: 1, status: "Occupied", studentName: "Saurabh Mishra", admissionNo: "2022/0045", classSection: "11-Sci", guardianPhone: "98290 77102" },
      { bedNumber: 2, status: "Occupied", studentName: "Gaurav Joshi", admissionNo: "2022/0052", classSection: "11-Sci", guardianPhone: "94140 66291" },
      { bedNumber: 3, status: "Occupied", studentName: "Anurag Pareek", admissionNo: "2022/0064", classSection: "11-Sci", guardianPhone: "97840 55198" },
      { bedNumber: 4, status: "Occupied", studentName: "Deepak Yadav", admissionNo: "2022/0071", classSection: "11-Sci", guardianPhone: "99280 33104" }
    ]
  },
  {
    roomNo: "Room 105",
    capacity: 4,
    beds: [
      { bedNumber: 1, status: "Occupied", studentName: "Naveen Bishnoi", admissionNo: "2025/0018", classSection: "8-A", guardianPhone: "98290 99182" },
      { bedNumber: 2, status: "Occupied", studentName: "Kapil Sharma", admissionNo: "2025/0024", classSection: "8-A", guardianPhone: "94140 88291" },
      { bedNumber: 3, status: "Vacant" },
      { bedNumber: 4, status: "Vacant" }
    ]
  },
  {
    roomNo: "Room 106",
    capacity: 4,
    beds: [
      { bedNumber: 1, status: "Occupied", studentName: "Manish Kumar", admissionNo: "2023/0182", classSection: "10-B", guardianPhone: "97720 44102" },
      { bedNumber: 2, status: "Occupied", studentName: "Rakesh Meena", admissionNo: "2023/0190", classSection: "10-B", guardianPhone: "98870 55219" },
      { bedNumber: 3, status: "Occupied", studentName: "Ajay Singh", admissionNo: "2023/0199", classSection: "10-B", guardianPhone: "96490 66304" },
      { bedNumber: 4, status: "Occupied", studentName: "Sonu Yadav", admissionNo: "2023/0205", classSection: "10-A", guardianPhone: "98290 33190" }
    ]
  },
  {
    roomNo: "Room 107",
    capacity: 4,
    beds: [
      { bedNumber: 1, status: "Occupied", studentName: "Kuldeep Ranawat", admissionNo: "2022/0110", classSection: "11-Sci", guardianPhone: "98290 88120" },
      { bedNumber: 2, status: "Out on pass", studentName: "Aditya Shekhawat", admissionNo: "2022/0118", classSection: "11-Sci", guardianPhone: "94140 77291" },
      { bedNumber: 3, status: "Occupied", studentName: "Jitendra Bhati", admissionNo: "2022/0125", classSection: "11-Com", guardianPhone: "97840 11920" },
      { bedNumber: 4, status: "Occupied", studentName: "Praveen Sharma", admissionNo: "2022/0130", classSection: "11-Com", guardianPhone: "99280 22194" }
    ]
  },
  {
    roomNo: "Room 108",
    capacity: 4,
    beds: [
      { bedNumber: 1, status: "Occupied", studentName: "Mukesh Gurjar", admissionNo: "2024/0088", classSection: "9-A", guardianPhone: "97720 88190" },
      { bedNumber: 2, status: "Occupied", studentName: "Lalit Jangid", admissionNo: "2024/0095", classSection: "9-A", guardianPhone: "98870 99201" },
      { bedNumber: 3, status: "Occupied", studentName: "Sunil Meena", admissionNo: "2024/0104", classSection: "9-A", guardianPhone: "96490 33182" },
      { bedNumber: 4, status: "Occupied", studentName: "Vinod Saini", admissionNo: "2024/0110", classSection: "9-B", guardianPhone: "98290 55198" }
    ]
  },
  {
    roomNo: "Room 109",
    capacity: 4,
    beds: [
      { bedNumber: 1, status: "Occupied", studentName: "Ashok Yadav", admissionNo: "2023/0045", classSection: "10-A", guardianPhone: "94140 99182" },
      { bedNumber: 2, status: "Occupied", studentName: "Hemant Verma", admissionNo: "2023/0052", classSection: "10-A", guardianPhone: "97840 88291" },
      { bedNumber: 3, status: "Vacant" },
      { bedNumber: 4, status: "Occupied", studentName: "Dharmendra Jat", admissionNo: "2023/0068", classSection: "10-B", guardianPhone: "99280 77192" }
    ]
  },
  {
    roomNo: "Room 110",
    capacity: 4,
    beds: [
      { bedNumber: 1, status: "Occupied", studentName: "Rohan Bishnoi", admissionNo: "2023/0212", classSection: "10-A", guardianPhone: "98290 66190" },
      { bedNumber: 2, status: "Occupied", studentName: "Pankaj Sharma", admissionNo: "2023/0218", classSection: "10-A", guardianPhone: "94140 55291" },
      { bedNumber: 3, status: "Occupied", studentName: "Vishal Soni", admissionNo: "2023/0225", classSection: "10-B", guardianPhone: "97840 44102" },
      { bedNumber: 4, status: "Occupied", studentName: "Narendra Singh", admissionNo: "2023/0230", classSection: "10-B", guardianPhone: "99280 88120" }
    ]
  },
  {
    roomNo: "Room 111",
    capacity: 4,
    beds: [
      { bedNumber: 1, status: "Occupied", studentName: "Rajendra Meena", admissionNo: "2025/0088", classSection: "8-B", guardianPhone: "97720 33190" },
      { bedNumber: 2, status: "Occupied", studentName: "Dinesh Gurjar", admissionNo: "2025/0095", classSection: "8-B", guardianPhone: "98870 22182" },
      { bedNumber: 3, status: "Occupied", studentName: "Mahesh Yadav", admissionNo: "2025/0104", classSection: "8-B", guardianPhone: "96490 11928" },
      { bedNumber: 4, status: "Vacant" }
    ]
  },
  {
    roomNo: "Room 112",
    capacity: 4,
    beds: [
      { bedNumber: 1, status: "Occupied", studentName: "Bhupendra Jat", admissionNo: "2022/0182", classSection: "12-Sci", guardianPhone: "98290 22104" },
      { bedNumber: 2, status: "Occupied", studentName: "Sanjay Sharma", admissionNo: "2022/0190", classSection: "12-Sci", guardianPhone: "94140 33190" },
      { bedNumber: 3, status: "Occupied", studentName: "Rohitash Meena", admissionNo: "2022/0198", classSection: "12-Com", guardianPhone: "97840 99201" },
      { bedNumber: 4, status: "Occupied", studentName: "Kamlesh Verma", admissionNo: "2022/0205", classSection: "12-Com", guardianPhone: "99280 11928" }
    ]
  }
];

const INITIAL_OUTPASSES: OutpassItem[] = [
  {
    id: "op-1",
    studentName: "Yash Rathore",
    classSection: "9-B",
    roomNo: "Room 103",
    duration: "Sat 10 Oct, 4 pm → Sun 11 Oct, 6 pm",
    accompaniedBy: "with father",
    status: "Parent approved in app",
    actionText: "Issue Gate Pass"
  },
  {
    id: "op-2",
    studentName: "Aditya Shekhawat",
    classSection: "11-Sci",
    roomNo: "Room 107",
    duration: "Out since 8 Oct · return 9 Oct, 7 pm",
    accompaniedBy: "personal leave",
    status: "Out now",
    actionText: "Mark Returned"
  },
  {
    id: "op-3",
    studentName: "Rohan Bishnoi",
    classSection: "10-A",
    roomNo: "Room 110",
    duration: "Fri 16 Oct → Sun 18 Oct",
    accompaniedBy: "with uncle",
    status: "Waiting for parent approval",
    actionText: "Send SMS Reminder"
  }
];

export default function HostelPage() {
  const { showToast } = useToast();
  const [floor, setFloor] = useState("First floor");
  const [rooms, setRooms] = useState<HostelRoom[]>(INITIAL_ROOMS);
  const [outpasses, setOutpasses] = useState<OutpassItem[]>(INITIAL_OUTPASSES);
  const [selectedRoom, setSelectedRoom] = useState<HostelRoom | null>(null);
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);

  // Bed Allocation State
  const [allocateForm, setAllocateForm] = useState({
    studentName: "",
    admissionNo: "",
    classSection: "9-A",
    roomNo: "Room 102",
    guardianPhone: ""
  });

  // Calculate KPIs
  const totalBeds = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const occupiedBeds = rooms.reduce(
    (acc, r) => acc + r.beds.filter(b => b.status === "Occupied" || b.status === "Out on pass").length,
    0
  );
  const outOnPassCount = rooms.reduce(
    (acc, r) => acc + r.beds.filter(b => b.status === "Out on pass").length,
    0
  );
  const nightRollCallPresent = occupiedBeds - outOnPassCount;

  const handleAllocateBed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocateForm.studentName.trim() || !allocateForm.admissionNo.trim()) return;

    setRooms(prev =>
      prev.map(r => {
        if (r.roomNo === allocateForm.roomNo) {
          const vacantIndex = r.beds.findIndex(b => b.status === "Vacant");
          if (vacantIndex !== -1) {
            const updatedBeds = [...r.beds];
            updatedBeds[vacantIndex] = {
              bedNumber: vacantIndex + 1,
              status: "Occupied",
              studentName: allocateForm.studentName,
              admissionNo: allocateForm.admissionNo,
              classSection: allocateForm.classSection,
              guardianPhone: allocateForm.guardianPhone || "98290 00000"
            };
            return { ...r, beds: updatedBeds };
          }
        }
        return r;
      })
    );

    setIsAllocateModalOpen(false);
    showToast(`Bed successfully allotted to ${allocateForm.studentName} in ${allocateForm.roomNo}!`, "success");
    setAllocateForm({
      studentName: "",
      admissionNo: "",
      classSection: "9-A",
      roomNo: "Room 102",
      guardianPhone: ""
    });
  };

  const handleOutpassAction = (op: OutpassItem) => {
    if (op.status === "Parent approved in app") {
      setOutpasses(prev =>
        prev.map(o => (o.id === op.id ? { ...o, status: "Out now", actionText: "Mark Returned" } : o))
      );
      showToast(`Gate pass printed and student ${op.studentName} marked OUT!`, "success");
    } else if (op.status === "Out now") {
      setOutpasses(prev => prev.filter(o => o.id !== op.id));
      setRooms(prev =>
        prev.map(r => {
          if (r.roomNo === op.roomNo) {
            return {
              ...r,
              beds: r.beds.map(b =>
                b.studentName === op.studentName ? { ...b, status: "Occupied" } : b
              )
            };
          }
          return r;
        })
      );
      showToast(`Student ${op.studentName} marked RETURNED to hostel!`, "success");
    } else {
      showToast(`Automated parent approval SMS pushed for ${op.studentName}!`, "info");
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn max-w-content mx-auto pb-12 font-sans">
      {/* Header Row (Matching 32-Hostel.html) */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-[13px] text-ink-secondary">
            Hostel › Rooms · Roll call · Outpass · Visitors
          </div>
          <h1 className="text-2xl sm:text-[26px] font-semibold text-ink leading-tight">
            Boys hostel · Aravali block, {floor.toLowerCase()}
          </h1>
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          <label className="flex items-center gap-2 text-[13px] text-ink-secondary">
            Floor
            <select
              value={floor}
              onChange={e => setFloor(e.target.value)}
              className="min-h-[42px] px-3 border border-line-input rounded-control bg-white text-ink text-sm font-medium focus:border-primary focus:outline-none"
            >
              <option>First floor</option>
              <option>Ground floor</option>
              <option>Second floor</option>
            </select>
          </label>

          <button
            type="button"
            onClick={() => setIsAllocateModalOpen(true)}
            className="min-h-[42px] px-4 rounded-control bg-primary hover:bg-primary-dark text-white text-[13px] font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 active:scale-[0.98]"
          >
            <FiPlus size={15} />
            <span>Allocate bed</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards (Matching 32-Hostel.html) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="bg-white border border-line rounded-card p-4 flex flex-col gap-1 shadow-xs">
          <span className="text-xs text-ink-secondary font-medium">Beds on this floor</span>
          <span className="font-mono text-xl font-semibold text-ink">{totalBeds}</span>
        </div>

        <div className="bg-white border border-line rounded-card p-4 flex flex-col gap-1 shadow-xs">
          <span className="text-xs text-ink-secondary font-medium">Occupied</span>
          <span className="font-mono text-xl font-semibold text-ink">{occupiedBeds}</span>
        </div>

        <div className="bg-white border border-line rounded-card p-4 flex flex-col gap-1 shadow-xs">
          <span className="text-xs text-ink-secondary font-medium">Night roll call</span>
          <span className="font-mono text-xl font-semibold text-ink">
            {nightRollCallPresent} + {outOnPassCount} on pass
          </span>
        </div>

        <div className="bg-white border border-line rounded-card p-4 flex flex-col gap-1 shadow-xs">
          <span className="text-xs text-ink-secondary font-medium">Mess fee due</span>
          <span className="font-mono text-xl font-semibold text-ink">₹62,400</span>
        </div>
      </div>

      {/* Main Grid: Room Layout and Outpass Requests */}
      <div className="flex flex-wrap gap-5 items-start">
        {/* Left: Rooms Directory Grid (Screen 32) */}
        <section className="flex-1 basis-[520px] min-w-0 bg-white border border-line rounded-card p-5 flex flex-col gap-3.5 shadow-xs">
          <div className="flex justify-between items-center gap-3 flex-wrap">
            <h2 className="m-0 text-base font-semibold text-ink">Rooms</h2>
            <div className="flex items-center gap-3.5 text-xs text-ink-secondary flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-[3px] bg-primary block" />
                Occupied
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-[3px] border border-dashed border-ink-secondary bg-white block" />
                Vacant
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-[3px] bg-warning-cell block" />
                Out on pass
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {rooms.map(room => {
              const occupiedCount = room.beds.filter(
                b => b.status === "Occupied" || b.status === "Out on pass"
              ).length;

              return (
                <div
                  key={room.roomNo}
                  onClick={() => setSelectedRoom(room)}
                  className="border border-line rounded-control p-3 flex flex-col gap-2.5 bg-white hover:border-primary/50 transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-ink group-hover:text-primary">
                      {room.roomNo}
                    </span>
                    <span className="font-mono text-ink-secondary">
                      {occupiedCount}/{room.capacity}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {room.beds.map(bed => {
                      if (bed.status === "Occupied") {
                        return (
                          <span
                            key={bed.bedNumber}
                            title={`${bed.studentName} (${bed.classSection})`}
                            className="h-7 rounded-[5px] bg-primary border border-primary block"
                          />
                        );
                      }
                      if (bed.status === "Out on pass") {
                        return (
                          <span
                            key={bed.bedNumber}
                            title={`${bed.studentName} · Out on pass`}
                            className="h-7 rounded-[5px] bg-warning-cell border border-warning-cell block"
                          />
                        );
                      }
                      return (
                        <span
                          key={bed.bedNumber}
                          title="Vacant Bed"
                          className="h-7 rounded-[5px] bg-white border border-dashed border-ink-secondary block"
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Aside: Outpass Requests (Matching 32-Hostel.html) */}
        <aside className="flex-1 basis-[300px] max-w-full lg:max-w-[340px] bg-white border border-line rounded-card p-4 flex flex-col gap-2.5 shadow-xs">
          <h2 className="m-0 text-sm font-semibold text-ink">Outpass requests</h2>

          {outpasses.map((op, idx) => (
            <div
              key={op.id}
              className={`flex flex-col gap-1.5 pt-2.5 ${
                idx > 0 ? "border-t border-line-row" : ""
              }`}
            >
              <div className="flex justify-between items-baseline gap-2">
                <span className="font-semibold text-sm text-ink">
                  {op.studentName} · {op.classSection} · {op.roomNo}
                </span>
              </div>
              <span className="text-xs text-ink-secondary leading-relaxed">
                {op.duration} · {op.accompaniedBy}
              </span>
              <div className="flex justify-between items-center gap-2 pt-1">
                <span
                  className={`text-xs font-semibold ${
                    op.status === "Parent approved in app"
                      ? "text-success-text"
                      : op.status === "Out now"
                      ? "text-warning-inline"
                      : "text-ink-secondary"
                  }`}
                >
                  {op.status}
                </span>
                {op.actionText && (
                  <button
                    type="button"
                    onClick={() => handleOutpassAction(op)}
                    className="text-[11px] font-semibold text-primary hover:underline"
                  >
                    {op.actionText} →
                  </button>
                )}
              </div>
            </div>
          ))}
        </aside>
      </div>

      {/* Room Resident Inspector Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-line rounded-card w-full max-w-md shadow-xl p-6 space-y-4 font-sans animate-in fade-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center pb-2.5 border-b border-line">
              <h3 className="font-semibold text-base text-ink">
                {selectedRoom.roomNo} · Resident Roster
              </h3>
              <button
                type="button"
                onClick={() => setSelectedRoom(null)}
                className="text-ink-secondary hover:text-ink text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {selectedRoom.beds.map(bed => (
                <div
                  key={bed.bedNumber}
                  className="p-3 border border-line rounded-control flex justify-between items-center gap-2 bg-slate-50"
                >
                  <div>
                    <div className="font-semibold text-ink text-sm flex items-center gap-2">
                      <span>Bed {bed.bedNumber}:</span>
                      <span>{bed.studentName || "Vacant"}</span>
                    </div>
                    {bed.studentName && (
                      <div className="text-xs text-ink-secondary mt-0.5">
                        Adm: {bed.admissionNo} · Class {bed.classSection} · Phone: {bed.guardianPhone}
                      </div>
                    )}
                  </div>
                  <div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        bed.status === "Occupied"
                          ? "bg-primary text-white"
                          : bed.status === "Out on pass"
                          ? "bg-warning-cell text-white"
                          : "bg-slate-200 text-ink-secondary"
                      }`}
                    >
                      {bed.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => setSelectedRoom(null)}
                className="px-4 py-2 border border-line-input rounded-control text-ink hover:bg-slate-50 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Allocate Bed Modal */}
      {isAllocateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-line rounded-card w-full max-w-md shadow-xl p-6 space-y-4 font-sans animate-in fade-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center pb-2.5 border-b border-line">
              <h3 className="font-semibold text-base text-ink">Allocate Bed in Hostel</h3>
              <button
                type="button"
                onClick={() => setIsAllocateModalOpen(false)}
                className="text-ink-secondary hover:text-ink text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAllocateBed} className="space-y-3.5">
              <div>
                <label className="block text-ink font-medium mb-1">Select Room</label>
                <select
                  value={allocateForm.roomNo}
                  onChange={e => setAllocateForm(prev => ({ ...prev, roomNo: e.target.value }))}
                  className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                >
                  {rooms.map(r => {
                    const vacant = r.beds.filter(b => b.status === "Vacant").length;
                    return (
                      <option key={r.roomNo} value={r.roomNo}>
                        {r.roomNo} ({vacant} vacant beds)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yashpal Singh"
                  value={allocateForm.studentName}
                  onChange={e => setAllocateForm(prev => ({ ...prev, studentName: e.target.value }))}
                  className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink font-medium mb-1">Admission No.</label>
                  <input
                    type="text"
                    required
                    placeholder="2026/0290"
                    value={allocateForm.admissionNo}
                    onChange={e => setAllocateForm(prev => ({ ...prev, admissionNo: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-line rounded-control text-ink font-mono text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-ink font-medium mb-1">Class & Section</label>
                  <input
                    type="text"
                    required
                    placeholder="9-B"
                    value={allocateForm.classSection}
                    onChange={e => setAllocateForm(prev => ({ ...prev, classSection: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Guardian Mobile No.</label>
                <input
                  type="tel"
                  placeholder="98290 xxxxx"
                  value={allocateForm.guardianPhone}
                  onChange={e => setAllocateForm(prev => ({ ...prev, guardianPhone: e.target.value }))}
                  className="w-full p-2.5 bg-white border border-line rounded-control text-ink text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAllocateModalOpen(false)}
                  className="px-4 py-2 border border-line-input rounded-control text-ink hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-control font-semibold shadow-xs"
                >
                  Confirm Bed Allotment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
