import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  MdSearch,
  MdSend,
  MdAttachFile,
  MdClose,
  MdPhone,
  MdCampaign,
  MdAccessTime,
  MdDoneAll,
  MdChevronLeft,
  MdOutlineMedicalServices,
  MdFactCheck,
  MdGrade,
  MdFileDownload,
  MdOutlineThumbUp,
} from "react-icons/md";
import { FiPaperclip } from "react-icons/fi";

// ==========================================
// TYPE DEFINITIONS
// ==========================================
export type MessageCategory = "all" | "8b" | "unread" | "leave" | "academic";

export interface ChatMessage {
  id: string;
  sender: "teacher" | "parent" | "system";
  text: string;
  time: string;
  dateGroup?: string;
  attachment?: {
    name: string;
    size: string;
    type: "pdf" | "image" | "leave-slip";
  };
}

export interface Thread {
  id: string;
  studentName: string;
  roll: string;
  classSection: string;
  guardianName: string;
  guardianRelation: "Mother" | "Father" | "Parents";
  guardianPhone: string;
  avatarBg: string;
  tag: "Leave Request" | "Medical Alert" | "PTM Query" | "Academic Update" | "Homework Inquiry";
  tagColor: string;
  lastMessage: string;
  lastSender: "teacher" | "parent";
  time: string;
  unreadCount: number;
  attendancePct: number;
  latestGrade: string;
  healthAlert?: string;
  messages: ChatMessage[];
}

// ==========================================
// MOCK THREADS (Consistent with Class 8-B Roster & 7-A Science)
// ==========================================
const INITIAL_THREADS: Thread[] = [
  {
    id: "t1",
    studentName: "Dev Saini",
    roll: "04",
    classSection: "8-B",
    guardianName: "Kusum Saini",
    guardianRelation: "Mother",
    guardianPhone: "+91 98290 45678",
    avatarBg: "bg-amber-100 text-amber-800 border-amber-300",
    tag: "Medical Alert",
    tagColor: "bg-rose-50 text-rose-700 border-rose-200",
    lastMessage: "Doctor advised 2 more days rest for viral fever. Will send medical certificate.",
    lastSender: "parent",
    time: "9:10 am",
    unreadCount: 1,
    attendancePct: 71,
    latestGrade: "Term 1 · C2",
    healthAlert: "Seasonal viral fever recovering",
    messages: [
      {
        id: "m1",
        sender: "teacher",
        text: "Namaste Kusum ji. Dev has been absent since Friday. Is everything all right with his health?",
        time: "Mon 3:15 pm",
        dateGroup: "Monday, 12 Oct",
      },
      {
        id: "m2",
        sender: "parent",
        text: "Namaste ma’am. He developed a sudden high fever and throat infection on Friday evening. Doctor advised blood test.",
        time: "Today 8:55 am",
        dateGroup: "Today, 14 Oct",
      },
      {
        id: "m3",
        sender: "parent",
        text: "Doctor advised 2 more days rest for viral fever. Will send medical certificate with him when he rejoins on Thursday.",
        time: "Today 9:10 am",
        attachment: {
          name: "Dev_Saini_Doctor_Prescription.pdf",
          size: "480 KB",
          type: "pdf",
        },
      },
    ],
  },
  {
    id: "t2",
    studentName: "Isha Kanwar",
    roll: "09",
    classSection: "8-B",
    guardianName: "Vikram Kanwar",
    guardianRelation: "Father",
    guardianPhone: "+91 98290 90123",
    avatarBg: "bg-blue-100 text-blue-800 border-blue-300",
    tag: "Leave Request",
    tagColor: "bg-blue-50 text-blue-700 border-blue-200",
    lastMessage: "Applied leave for 14–15 Oct. Please approve in portal.",
    lastSender: "parent",
    time: "8:42 am",
    unreadCount: 1,
    attendancePct: 97,
    latestGrade: "Term 1 · A1",
    healthAlert: "Mild allergic cough",
    messages: [
      {
        id: "m1",
        sender: "parent",
        text: "Good morning Sunita ma'am. We have to visit our native village for my grandmother's annual prayer ceremony on 14th & 15th Oct.",
        time: "Today 8:40 am",
        dateGroup: "Today, 14 Oct",
      },
      {
        id: "m2",
        sender: "parent",
        text: "Applied leave for 14–15 Oct. Please approve in portal.",
        time: "Today 8:42 am",
        attachment: {
          name: "Leave_Application_Isha_Kanwar.pdf",
          size: "210 KB",
          type: "leave-slip",
        },
      },
    ],
  },
  {
    id: "t3",
    studentName: "Garima Joshi",
    roll: "07",
    classSection: "8-B",
    guardianName: "Mukesh Joshi",
    guardianRelation: "Father",
    guardianPhone: "+91 98290 78901",
    avatarBg: "bg-purple-100 text-purple-800 border-purple-300",
    tag: "PTM Query",
    tagColor: "bg-purple-50 text-purple-700 border-purple-200",
    lastMessage: "Can we book slot 3 (10:30 am) for Saturday PTM?",
    lastSender: "parent",
    time: "Yesterday",
    unreadCount: 1,
    attendancePct: 88,
    latestGrade: "Term 1 · C1",
    messages: [
      {
        id: "m1",
        sender: "parent",
        text: "Respected ma'am, I received the SMS regarding parent-teacher meeting this Saturday. Can we book slot 3 (10:30 am)?",
        time: "Yesterday 4:15 pm",
        dateGroup: "Yesterday, 13 Oct",
      },
    ],
  },
  {
    id: "t4",
    studentName: "Aditi Sharma",
    roll: "01",
    classSection: "8-B",
    guardianName: "Sanjay Sharma",
    guardianRelation: "Father",
    guardianPhone: "+91 98290 12345",
    avatarBg: "bg-emerald-100 text-emerald-800 border-emerald-300",
    tag: "Academic Update",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    lastMessage: "Thank you for the guidance ma'am. Aditi scored 89/100 in Half-Yearly Science.",
    lastSender: "parent",
    time: "Yesterday",
    unreadCount: 0,
    attendancePct: 96,
    latestGrade: "Term 1 · A2",
    messages: [
      {
        id: "m1",
        sender: "teacher",
        text: "Aditi's performance in Half-Yearly science has been very consistent. Her notebook and experiment work are exemplary.",
        time: "Yesterday 11:20 am",
        dateGroup: "Yesterday, 13 Oct",
      },
      {
        id: "m2",
        sender: "parent",
        text: "Thank you for the guidance ma'am. Aditi scored 89/100 in Half-Yearly Science.",
        time: "Yesterday 12:05 pm",
      },
    ],
  },
  {
    id: "t5",
    studentName: "Faizan Ali",
    roll: "06",
    classSection: "8-B",
    guardianName: "Imran Ali",
    guardianRelation: "Father",
    guardianPhone: "+91 98290 67890",
    avatarBg: "bg-teal-100 text-teal-800 border-teal-300",
    tag: "Homework Inquiry",
    tagColor: "bg-teal-50 text-teal-700 border-teal-200",
    lastMessage: "He has drawn candle flame zones in practical file. Submitting tomorrow.",
    lastSender: "teacher",
    time: "12 Oct",
    unreadCount: 0,
    attendancePct: 95,
    latestGrade: "Term 1 · A2",
    messages: [
      {
        id: "m1",
        sender: "parent",
        text: "Ma'am, for Ch. 6 Combustion & Flame diagram, do students need to use oil pastels or color pencils?",
        time: "12 Oct 6:20 pm",
        dateGroup: "Monday, 12 Oct",
      },
      {
        id: "m2",
        sender: "teacher",
        text: "Color pencils or normal sketch pens are preferred for clean labeling in practical record.",
        time: "12 Oct 6:45 pm",
      },
      {
        id: "m3",
        sender: "parent",
        text: "He has drawn candle flame zones in practical file. Submitting tomorrow.",
        time: "12 Oct 7:15 pm",
      },
    ],
  },
  {
    id: "t6",
    studentName: "Charu Mehta",
    roll: "03",
    classSection: "8-B",
    guardianName: "Sunil Mehta",
    guardianRelation: "Father",
    guardianPhone: "+91 98290 34567",
    avatarBg: "bg-cyan-100 text-cyan-800 border-cyan-300",
    tag: "Academic Update",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    lastMessage: "Registration for National Science Olympiad submitted.",
    lastSender: "teacher",
    time: "11 Oct",
    unreadCount: 0,
    attendancePct: 98,
    latestGrade: "Term 1 · A1",
    messages: [
      {
        id: "m1",
        sender: "parent",
        text: "Namaste ma'am, Charu wants to appear for NSO Level 1. Has the school started enrollment?",
        time: "11 Oct 10:15 am",
        dateGroup: "Sunday, 11 Oct",
      },
      {
        id: "m2",
        sender: "teacher",
        text: "Registration for National Science Olympiad submitted. Mock practice sessions will be held during Zero period.",
        time: "11 Oct 11:30 am",
      },
    ],
  },
  {
    id: "t7",
    studentName: "Jatin Soni",
    roll: "10",
    classSection: "8-B",
    guardianName: "Vijay Soni",
    guardianRelation: "Father",
    guardianPhone: "+91 98290 01234",
    avatarBg: "bg-slate-100 text-slate-800 border-slate-300",
    tag: "Academic Update",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    lastMessage: "Remedial class scheduled every Thursday 3:15 pm.",
    lastSender: "teacher",
    time: "10 Oct",
    unreadCount: 0,
    attendancePct: 85,
    latestGrade: "Term 1 · C2",
    messages: [
      {
        id: "m1",
        sender: "parent",
        text: "Ma'am, Jatin scored 33/100 in Half-Yearly. We are worried about his physics numericals.",
        time: "10 Oct 5:30 pm",
        dateGroup: "Saturday, 10 Oct",
      },
      {
        id: "m2",
        sender: "teacher",
        text: "Do not worry Vijay ji. Remedial class scheduled every Thursday 3:15 pm. I will personally supervise his practice.",
        time: "10 Oct 6:00 pm",
      },
    ],
  },
  {
    id: "t8",
    studentName: "Aanya Bhatt",
    roll: "01",
    classSection: "7-A",
    guardianName: "Sunita Bhatt",
    guardianRelation: "Mother",
    guardianPhone: "+91 98290 77112",
    avatarBg: "bg-indigo-100 text-indigo-800 border-indigo-300",
    tag: "Academic Update",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    lastMessage: "Aanya's science lab report was very well presented.",
    lastSender: "teacher",
    time: "9 Oct",
    unreadCount: 0,
    attendancePct: 94,
    latestGrade: "Term 1 · A1",
    messages: [
      {
        id: "m1",
        sender: "teacher",
        text: "Aanya's science lab report was very well presented. Her diagram on photosynthesis was selected for science notice board.",
        time: "9 Oct 2:15 pm",
        dateGroup: "Friday, 9 Oct",
      },
      {
        id: "m2",
        sender: "parent",
        text: "Thank you so much ma'am for motivating her! She loves your science classes.",
        time: "9 Oct 3:00 pm",
      },
    ],
  },
  {
    id: "t9",
    studentName: "Kabir Meena",
    roll: "15",
    classSection: "7-A",
    guardianName: "Mamta Meena",
    guardianRelation: "Mother",
    guardianPhone: "+91 98290 88223",
    avatarBg: "bg-teal-100 text-teal-800 border-teal-300",
    tag: "Homework Inquiry",
    tagColor: "bg-teal-50 text-teal-700 border-teal-200",
    lastMessage: "Understood ma'am, he will submit notebook tomorrow morning.",
    lastSender: "parent",
    time: "8 Oct",
    unreadCount: 0,
    attendancePct: 89,
    latestGrade: "Term 1 · B2",
    messages: [
      {
        id: "m1",
        sender: "parent",
        text: "Sunita ma'am, Kabir's app was showing upload failed for Ch. 5 Q1-8 homework.",
        time: "8 Oct 7:15 pm",
        dateGroup: "Thursday, 8 Oct",
      },
      {
        id: "m2",
        sender: "teacher",
        text: "No issue Mamta ji, the server was undergoing maintenance. He can bring physical notebook tomorrow morning.",
        time: "8 Oct 7:35 pm",
      },
      {
        id: "m3",
        sender: "parent",
        text: "Understood ma'am, he will submit notebook tomorrow morning.",
        time: "8 Oct 7:40 pm",
      },
    ],
  },
  {
    id: "t10",
    studentName: "Arnav Saini",
    roll: "03",
    classSection: "7-A",
    guardianName: "Rajesh Saini",
    guardianRelation: "Father",
    guardianPhone: "+91 98290 99334",
    avatarBg: "bg-slate-100 text-slate-800 border-slate-300",
    tag: "Homework Inquiry",
    tagColor: "bg-teal-50 text-teal-700 border-teal-200",
    lastMessage: "Reminder sent for pending Ch. 5 homework.",
    lastSender: "teacher",
    time: "8 Oct",
    unreadCount: 0,
    attendancePct: 82,
    latestGrade: "Term 1 · C1",
    messages: [
      {
        id: "m1",
        sender: "teacher",
        text: "Namaste Rajesh ji. Arnav has not submitted Science Chapter 5 questions due on 8 Oct. Please have him complete it tonight.",
        time: "8 Oct 4:10 pm",
        dateGroup: "Thursday, 8 Oct",
      },
    ],
  },
];

// Quick Reply suggestion chips
const QUICK_REPLIES = [
  "Thank you for informing. I have noted this in the register.",
  "Leave application approved. Please ensure pending homework is submitted.",
  "Yes, PTM Slot 3 (10:30 AM) is confirmed for you.",
  "Science practical file is due tomorrow morning by 8:30 AM.",
  "Good progress observed in recent class tests. Keep it up!",
];

const TeacherMessages: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const teacherName = user?.name || "Sunita Rathore";

  // State
  const [threads, setThreads] = useState<Thread[]>(INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string>("t1");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<MessageCategory>("all");
  const [sectionFilter, setSectionFilter] = useState<string>("ALL");
  const [inputText, setInputText] = useState("");
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastBody, setBroadcastBody] = useState("");
  const [broadcastSendSms, setBroadcastSendSms] = useState(true);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [mobilePane, setMobilePane] = useState<"list" | "chat">("list");

  // Active Thread
  const activeThread = useMemo(() => {
    return threads.find((t) => t.id === activeThreadId) || threads[0];
  }, [threads, activeThreadId]);

  // Total unread count across all threads
  const totalUnreadCount = useMemo(() => {
    return threads.reduce((acc, t) => acc + (t.unreadCount || 0), 0);
  }, [threads]);

  // Filtered threads list
  const filteredThreads = useMemo(() => {
    return threads.filter((t) => {
      // Search match
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        t.studentName.toLowerCase().includes(q) ||
        t.roll.includes(q) ||
        t.guardianName.toLowerCase().includes(q) ||
        t.lastMessage.toLowerCase().includes(q) ||
        t.classSection.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      // Section dropdown filter
      if (sectionFilter !== "ALL" && t.classSection !== sectionFilter) {
        return false;
      }

      // Category tab filter
      if (categoryFilter === "unread") return t.unreadCount > 0;
      if (categoryFilter === "8b") return t.classSection === "8-B";
      if (categoryFilter === "leave") return t.tag === "Leave Request" || t.tag === "Medical Alert";
      if (categoryFilter === "academic") return t.tag === "Academic Update" || t.tag === "Homework Inquiry";

      return true;
    });
  }, [threads, search, sectionFilter, categoryFilter]);

  // Handle Select Thread
  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId);
    setMobilePane("chat");

    // Clear unread count for this thread
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, unreadCount: 0 } : t))
    );
  };

  // Handle Send Message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: "teacher",
      text,
      time: "Just now",
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadId
          ? {
              ...t,
              messages: [...t.messages, newMsg],
              lastMessage: text,
              lastSender: "teacher",
              time: "Just now",
            }
          : t
      )
    );

    setInputText("");
    showToast(`Message sent to ${activeThread.guardianName} (${activeThread.studentName})`, "success");
  };

  // Quick Reply handler
  const handleInsertQuickReply = (text: string) => {
    setInputText(text);
  };

  // Attach File simulation
  const handleAttachFile = () => {
    showToast("Attachment dialog: PDF, image or circular up to 10MB", "info");
  };

  // Broadcast Submission
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastBody.trim()) {
      showToast("Please enter broadcast title and message.", "warn");
      return;
    }

    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setShowBroadcastModal(false);
      setBroadcastTitle("");
      setBroadcastBody("");
      showToast(
        `Broadcast announcement dispatched to all 38 guardians of Class 8-B via App ${
          broadcastSendSms ? "& SMS alert" : ""
        }.`,
        "success"
      );
    }, 900);
  };

  // Mark all threads as read
  const handleMarkAllRead = () => {
    setThreads((prev) => prev.map((t) => ({ ...t, unreadCount: 0 })));
    showToast("All message threads marked as read.", "info");
  };

  return (
    <div className="flex flex-col gap-4 w-full animate-fadeIn font-sans pb-12">
      {/* ================= HEADER SECTION ================= */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-line">
        <div className="flex flex-col gap-0.5 min-w-0">
          {/* Breadcrumb */}
          <div className="text-xs sm:text-[13px] text-ink-secondary flex items-center gap-1.5 mb-0.5 truncate">
            <Link to="/teacher/dashboard" className="hover:text-primary transition-colors shrink-0">
              Teacher Panel
            </Link>
            <span>›</span>
            <span className="text-ink shrink-0">Messages</span>
            <span>›</span>
            <span className="text-primary font-semibold truncate">Guardian Chats</span>
          </div>

          <div className="flex items-center gap-2.5 min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold text-ink leading-tight m-0 truncate">
              Messages & Guardian Communications
            </h1>
            {totalUnreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-xs shrink-0">
                {totalUnreadCount} Unread
              </span>
            )}
          </div>

          <div className="text-xs sm:text-[13px] text-ink-secondary truncate">
            Direct two-way messaging with parents of Class 8-B & Science sections · Office hours 8:00 AM – 6:00 PM
          </div>
        </div>

        {/* Top-Right Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-control bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Office Hours: Active</span>
          </div>

          {totalUnreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="px-3 py-1.5 rounded-control border border-line-input bg-white hover:bg-slate-50 text-xs font-semibold text-ink-secondary transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
            >
              Mark all read
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowBroadcastModal(true)}
            className="min-h-[38px] px-3.5 sm:px-4 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-xs transition-all cursor-pointer shadow-xs active:scale-[0.98] flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <MdCampaign size={17} />
            <span>Broadcast to Class 8-B</span>
          </button>
        </div>
      </div>

      {/* ================= CATEGORY FILTER TABS & SEARCH BAR ================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-2 rounded-card border border-line shadow-2xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: "all", label: "All Chats", count: threads.length },
            {
              id: "8b",
              label: "Class 8-B (My Class)",
              count: threads.filter((t) => t.classSection === "8-B").length,
            },
            { id: "unread", label: "Unread", count: totalUnreadCount },
            {
              id: "leave",
              label: "Leave & Medical",
              count: threads.filter((t) => t.tag === "Leave Request" || t.tag === "Medical Alert").length,
            },
            {
              id: "academic",
              label: "Academic & Marks",
              count: threads.filter((t) => t.tag === "Academic Update" || t.tag === "Homework Inquiry").length,
            },
          ].map((tab) => {
            const isActive = categoryFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategoryFilter(tab.id as MessageCategory)}
                className={`px-3 py-1.5 rounded-control text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-primary text-white shadow-2xs"
                    : "text-ink-secondary hover:text-ink hover:bg-surface-subtle"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-white/25 text-white"
                        : tab.id === "unread"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-surface-subtle border border-line text-ink-secondary"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Section Dropdown Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-secondary font-medium">Filter:</span>
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="h-8 px-2.5 rounded-control border border-line-input bg-surface-subtle text-xs text-ink font-medium focus:bg-surface focus:border-primary focus:outline-none transition-colors cursor-pointer"
          >
            <option value="ALL">All Sections</option>
            <option value="8-B">Class 8-B (Class Teacher)</option>
            <option value="7-A">Class 7-A (Science)</option>
          </select>
        </div>
      </div>

      {/* ================= MAIN CHAT TWO-PANE CONTAINER ================= */}
      <section className="bg-surface border border-line rounded-card flex h-[680px] overflow-hidden shadow-xs">
        {/* ================= LEFT PANE: THREADS LIST (340px) ================= */}
        <div
          className={`w-full md:w-[350px] shrink-0 border-r border-line flex flex-col bg-surface ${
            mobilePane === "chat" ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Thread Search Box */}
          <div className="p-3 border-b border-line-row bg-surface">
            <div className="relative flex items-center w-full">
              <MdSearch size={16} className="absolute left-3 text-ink-secondary pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student, parent, roll..."
                className="w-full h-9 pl-9 pr-3 rounded-control border border-line-input bg-surface-subtle text-xs text-ink placeholder:text-ink-secondary/60 focus:bg-surface focus:border-primary focus:outline-none transition-colors"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 text-ink-secondary hover:text-ink text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Threads List Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-line-row custom-scrollbar">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-ink-secondary text-xs">
                No conversations match your search or filter.
              </div>
            ) : (
              filteredThreads.map((t) => {
                const isActive = t.id === activeThreadId;
                return (
                  <div
                    key={t.id}
                    onClick={() => handleSelectThread(t.id)}
                    className={`flex items-start gap-3 p-3.5 cursor-pointer transition-colors relative select-none ${
                      isActive
                        ? "bg-primary-tint/70 border-l-4 border-l-primary"
                        : "hover:bg-slate-50/80 bg-surface border-l-4 border-l-transparent"
                    }`}
                  >
                    {/* Avatar Initials */}
                    <div
                      className={`w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center shrink-0 border ${t.avatarBg}`}
                    >
                      {t.studentName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>

                    {/* Thread Details */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      {/* Name & Time */}
                      <div className="flex justify-between items-baseline gap-1">
                        <span
                          className={`text-xs truncate ${
                            t.unreadCount > 0 ? "font-bold text-ink" : isActive ? "font-bold text-primary-dark" : "font-semibold text-ink"
                          }`}
                        >
                          {t.guardianName}
                          <span className="text-[11px] font-normal text-ink-secondary ml-1">
                            ({t.guardianRelation})
                          </span>
                        </span>
                        <span className="text-[11px] font-mono text-ink-secondary shrink-0">
                          {t.time}
                        </span>
                      </div>

                      {/* Student & Class Pill */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-medium text-ink">
                          {t.studentName}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-surface-subtle border border-line text-ink-secondary font-mono">
                          {t.classSection} · #{t.roll}
                        </span>
                        <span
                          className={`text-[9.5px] font-semibold px-1.5 py-0.2 rounded border ${t.tagColor}`}
                        >
                          {t.tag}
                        </span>
                      </div>

                      {/* Last Message Snippet */}
                      <p
                        className={`text-[11.5px] line-clamp-1 leading-snug m-0 ${
                          t.unreadCount > 0 ? "font-semibold text-ink" : "text-ink-secondary"
                        }`}
                      >
                        {t.lastSender === "teacher" && (
                          <span className="text-primary font-semibold mr-1">You:</span>
                        )}
                        {t.lastMessage}
                      </p>
                    </div>

                    {/* Unread Badge Indicator */}
                    {t.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[10.5px] flex items-center justify-center shrink-0 shadow-2xs">
                        {t.unreadCount}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Left Footer Summary */}
          <div className="p-2.5 px-3 border-t border-line-row bg-surface-subtle text-[11px] text-ink-secondary flex items-center justify-between">
            <span>
              Showing <strong>{filteredThreads.length}</strong> of {threads.length} chats
            </span>
            <span className="text-primary font-semibold">Synced with roster</span>
          </div>
        </div>

        {/* ================= RIGHT PANE: ACTIVE CHAT CONVERSATION ================= */}
        <div
          className={`flex-1 flex-col min-w-0 bg-surface ${
            mobilePane === "chat" ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Chat Header */}
          <div className="p-3.5 px-5 border-b border-line-row flex items-center justify-between gap-3 bg-surface shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile Back Button */}
              <button
                type="button"
                onClick={() => setMobilePane("list")}
                className="md:hidden p-1.5 rounded-control hover:bg-surface-subtle text-ink-secondary"
                title="Back to chats"
              >
                <MdChevronLeft size={22} />
              </button>

              {/* Student & Guardian Avatar */}
              <div
                className={`w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center shrink-0 border ${activeThread.avatarBg}`}
              >
                {activeThread.studentName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

              {/* Student & Guardian Name & Meta */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-ink truncate">
                    {activeThread.guardianName} ({activeThread.guardianRelation})
                  </span>
                  <span className="text-xs text-ink-secondary">·</span>
                  <span className="text-xs font-semibold text-primary">
                    Student: {activeThread.studentName}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-surface-subtle border border-line text-ink-secondary font-mono">
                    Class {activeThread.classSection} · Roll #{activeThread.roll}
                  </span>
                </div>

                <div className="text-[11.5px] text-ink-secondary flex items-center gap-2 truncate">
                  <span>Tel: {activeThread.guardianPhone}</span>
                  <span>·</span>
                  <span>
                    Attendance:{" "}
                    <strong
                      className={activeThread.attendancePct < 75 ? "text-rose-700 font-bold" : "text-emerald-700"}
                    >
                      {activeThread.attendancePct}%
                    </strong>
                  </span>
                  <span>·</span>
                  <span>
                    Result: <strong>{activeThread.latestGrade}</strong>
                  </span>
                  {activeThread.healthAlert && (
                    <>
                      <span>·</span>
                      <span className="text-rose-700 font-semibold flex items-center gap-0.5">
                        <MdOutlineMedicalServices size={13} /> {activeThread.healthAlert}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowStudentModal(true)}
                className="px-3 py-1.5 rounded-control border border-line-input bg-surface hover:bg-surface-subtle text-xs font-semibold text-primary flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <MdFactCheck size={15} />
                <span className="hidden sm:inline">Student Dossier</span>
              </button>

              <a
                href={`tel:${activeThread.guardianPhone.replace(/\s+/g, "")}`}
                className="p-2 rounded-control border border-line-input text-ink-secondary hover:text-ink hover:bg-slate-50 transition-colors"
                title={`Call ${activeThread.guardianPhone}`}
              >
                <MdPhone size={16} />
              </a>
            </div>
          </div>

          {/* Notice Banner */}
          <div className="bg-surface-subtle/80 border-b border-line-row px-5 py-2 text-[11px] text-ink-secondary flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <MdAccessTime size={14} className="text-primary shrink-0" />
              <span>
                Standard school communication record. All messages are archived for Parent-Teacher Conferences & coordinator review.
              </span>
            </div>
            <span className="text-emerald-700 font-bold hidden sm:inline">Office Hours 8 AM – 6 PM</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-3.5 bg-slate-50/50 custom-scrollbar">
            {activeThread.messages.map((m) => {
              const isTeacher = m.sender === "teacher";
              return (
                <React.Fragment key={m.id}>
                  {/* Date Group Divider */}
                  {m.dateGroup && (
                    <div className="flex items-center justify-center my-1">
                      <span className="px-3 py-0.5 rounded-full bg-white border border-line text-[10.5px] font-semibold text-ink-secondary shadow-2xs">
                        {m.dateGroup}
                      </span>
                    </div>
                  )}

                  {/* Message Bubble Container */}
                  <div
                    className={`flex flex-col gap-1 max-w-[80%] sm:max-w-[70%] ${
                      isTeacher ? "self-end items-end" : "self-start items-start"
                    }`}
                  >
                    {/* Sender Label */}
                    <span className="text-[10px] text-ink-secondary font-medium px-1">
                      {isTeacher ? `${teacherName} (You)` : `${activeThread.guardianName} (${activeThread.guardianRelation})`}
                    </span>

                    {/* Bubble Content */}
                    <div
                      className={`p-3.5 rounded-card text-xs leading-relaxed shadow-2xs ${
                        isTeacher
                          ? "bg-primary text-white rounded-tr-xs"
                          : "bg-white border border-line text-ink rounded-tl-xs"
                      }`}
                    >
                      <p className="m-0 whitespace-pre-wrap">{m.text}</p>

                      {/* File / Prescription / Slip Attachment Card */}
                      {m.attachment && (
                        <div
                          className={`mt-2.5 p-2.5 rounded-control flex items-center justify-between gap-3 border ${
                            isTeacher
                              ? "bg-primary-dark/40 border-white/20 text-white"
                              : "bg-surface-subtle border-line text-ink"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FiPaperclip size={15} className="shrink-0" />
                            <div className="flex flex-col min-w-0">
                              <span className="font-semibold text-xs truncate">
                                {m.attachment.name}
                              </span>
                              <span className="text-[10px] opacity-75">{m.attachment.size}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              showToast(`Downloaded ${m.attachment?.name}`, "success")
                            }
                            className={`p-1.5 rounded hover:opacity-80 transition-opacity cursor-pointer ${
                              isTeacher ? "bg-white/20 text-white" : "bg-white border border-line text-ink"
                            }`}
                            title="Download Attachment"
                          >
                            <MdFileDownload size={14} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Time Stamp & Checkmark */}
                    <div className="flex items-center gap-1 text-[10px] text-ink-secondary px-1">
                      <span>{m.time}</span>
                      {isTeacher && (
                        <span title="Delivered and read" className="text-primary-dark font-bold">
                          <MdDoneAll size={14} />
                        </span>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Quick Reply Suggestions Bar */}
          <div className="px-4 py-2 border-t border-line-row bg-surface flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10.5px] font-bold text-ink-secondary shrink-0 uppercase tracking-wide flex items-center gap-1">
              <MdOutlineThumbUp size={12} /> Quick:
            </span>
            {QUICK_REPLIES.map((reply, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleInsertQuickReply(reply)}
                className="px-2.5 py-1 rounded-full bg-surface-subtle hover:bg-slate-100 border border-line text-[11px] text-ink whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 px-4 border-t border-line-row bg-surface flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleAttachFile}
              className="p-2.5 rounded-control border border-line-input hover:bg-surface-subtle text-ink-secondary hover:text-ink transition-colors cursor-pointer shrink-0"
              title="Attach document or leave slip"
            >
              <MdAttachFile size={18} />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Write a message to ${activeThread.guardianName}...`}
              className="flex-1 h-10 px-3.5 rounded-control border border-line-input bg-surface-subtle text-xs text-ink placeholder:text-ink-secondary focus:bg-surface focus:border-primary focus:outline-none transition-colors"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="h-10 px-5 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-40 shadow-xs active:scale-[0.98] shrink-0"
            >
              <MdSend size={15} />
              <span>Send</span>
            </button>
          </form>
        </div>
      </section>

      {/* ================= MODAL 1: STUDENT DOSSIER / CARD ================= */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface border border-line rounded-card max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-line flex items-center justify-between bg-surface-subtle">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center border ${activeThread.avatarBg}`}
                >
                  {activeThread.studentName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-ink m-0">
                    {activeThread.studentName} · 360° Profile
                  </h3>
                  <span className="text-xs text-ink-secondary">
                    Class {activeThread.classSection} · Roll #{activeThread.roll} · Session 2026-27
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowStudentModal(false)}
                className="p-1 rounded text-ink-secondary hover:text-ink hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <MdClose size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 text-xs">
              {/* Quick Academic & Attendance Metrics */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-card bg-surface-subtle border border-line">
                  <span className="text-[11px] text-ink-secondary block">Attendance</span>
                  <strong
                    className={`text-lg font-bold font-mono ${
                      activeThread.attendancePct < 75 ? "text-rose-700" : "text-emerald-700"
                    }`}
                  >
                    {activeThread.attendancePct}%
                  </strong>
                  <span className="text-[10px] text-ink-secondary block">Min req. 75%</span>
                </div>

                <div className="p-3 rounded-card bg-surface-subtle border border-line">
                  <span className="text-[11px] text-ink-secondary block">Half-Yearly Result</span>
                  <strong className="text-lg font-bold font-mono text-primary">
                    {activeThread.latestGrade}
                  </strong>
                  <span className="text-[10px] text-ink-secondary block">CBSE Scale</span>
                </div>

                <div className="p-3 rounded-card bg-surface-subtle border border-line">
                  <span className="text-[11px] text-ink-secondary block">Pending Leaves</span>
                  <strong className="text-lg font-bold font-mono text-ink">
                    {activeThread.tag === "Leave Request" ? "1 Active" : "0"}
                  </strong>
                  <span className="text-[10px] text-ink-secondary block">Approved: 2</span>
                </div>
              </div>

              {/* Health Alert if any */}
              {activeThread.healthAlert && (
                <div className="p-3 rounded-card bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-900">
                  <MdOutlineMedicalServices size={17} className="text-rose-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Medical Notice on Record:</span>
                    <span className="text-[11.5px] leading-relaxed">
                      {activeThread.healthAlert}. Doctor note verified by class teacher.
                    </span>
                  </div>
                </div>
              )}

              {/* Guardian Contact Details */}
              <div className="p-3.5 rounded-card bg-surface-subtle border border-line space-y-2">
                <span className="font-semibold text-ink block uppercase text-[10.5px] tracking-wide text-ink-secondary">
                  Registered Guardian Contacts
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-ink-secondary block text-[11px]">Primary Guardian:</span>
                    <strong className="text-ink text-xs">{activeThread.guardianName}</strong>
                    <span className="text-[10.5px] text-ink-secondary block">
                      ({activeThread.guardianRelation})
                    </span>
                  </div>
                  <div>
                    <span className="text-ink-secondary block text-[11px]">Mobile Number:</span>
                    <strong className="text-ink text-xs font-mono">
                      {activeThread.guardianPhone}
                    </strong>
                    <span className="text-[10.5px] text-emerald-700 block font-semibold">
                      SMS Enabled
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Jump Links */}
              <div className="flex items-center justify-between pt-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowStudentModal(false);
                    navigate("/teacher/attendance");
                  }}
                  className="flex-1 py-2 px-3 rounded-control border border-line text-ink hover:bg-slate-50 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MdFactCheck size={15} />
                  <span>View Attendance</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowStudentModal(false);
                    navigate("/teacher/results");
                  }}
                  className="flex-1 py-2 px-3 rounded-control border border-line text-ink hover:bg-slate-50 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MdGrade size={15} />
                  <span>View Gradebook</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 px-6 border-t border-line bg-surface-subtle flex justify-end">
              <button
                type="button"
                onClick={() => setShowStudentModal(false)}
                className="px-4 py-1.5 rounded-control bg-primary text-white font-semibold text-xs hover:bg-primary-dark transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: BROADCAST CIRCULAR TO CLASS 8-B ================= */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface border border-line rounded-card max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-line flex items-center justify-between bg-surface-subtle">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary-tint text-primary-dark flex items-center justify-center">
                  <MdCampaign size={18} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-ink m-0">
                    Broadcast Announcement
                  </h3>
                  <span className="text-xs text-ink-secondary">
                    Send official circular to all 38 Guardians of Class 8-B
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="p-1 rounded text-ink-secondary hover:text-ink hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <MdClose size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSendBroadcast}>
              <div className="p-6 space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-ink block mb-1">
                    Announcement Subject / Title
                  </label>
                  <input
                    type="text"
                    required
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    placeholder="e.g. Science Practical Notebook Submission Deadline"
                    className="w-full h-9 px-3 rounded-control border border-line-input bg-surface-subtle text-xs text-ink placeholder:text-ink-secondary focus:bg-surface focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="font-semibold text-ink block mb-1">
                    Message Body (will appear in Parent App Daily Diary & Noticeboard)
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={broadcastBody}
                    onChange={(e) => setBroadcastBody(e.target.value)}
                    placeholder="Respected parents, please ensure your ward completes and brings the science practical file tomorrow for periodic evaluation..."
                    className="w-full p-3 rounded-control border border-line-input bg-surface-subtle text-xs text-ink placeholder:text-ink-secondary focus:bg-surface focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div className="p-3 rounded-control bg-amber-50 border border-amber-200 flex items-center justify-between">
                  <div>
                    <strong className="text-amber-900 block">Dispatch SMS Alert</strong>
                    <span className="text-[11px] text-amber-800">
                      Send urgent SMS alert to all 38 parents' primary phone numbers
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={broadcastSendSms}
                    onChange={(e) => setBroadcastSendSms(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 px-6 border-t border-line bg-surface-subtle flex items-center justify-between">
                <span className="text-[11.5px] text-ink-secondary">
                  Target: <strong>38 students (Class 8-B)</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBroadcastModal(false)}
                    className="px-3.5 py-1.5 rounded-control border border-line-input text-ink text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isBroadcasting}
                    className="px-5 py-1.5 rounded-control bg-primary hover:bg-primary-dark text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isBroadcasting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <MdSend size={14} />
                        <span>Publish Broadcast</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherMessages;
